// services/geminiService.js - Google Gemini Text-to-SQL Translation Service
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Translates plain English user question into an ANSI PostgreSQL query
 * using schema context and strict few-shot instructions.
 */
async function generateSQLFromText(userQuestion, schemaContext) {
  const systemInstruction = `
You are an expert PostgreSQL DBA and data analyst for IntelliDB.
Your sole job is to translate a plain English question into a syntactically correct, optimized, safe PostgreSQL SELECT query.

DATABASE SCHEMA:
${schemaContext}

STRICT RULES:
1. Output ONLY the raw SQL query.
2. Do NOT enclose the query in markdown code blocks like \`\`\`sql ... \`\`\`.
3. Do NOT include any explanations, greetings, comments, or notes.
4. ONLY write read-only SELECT queries.
5. If table or column names need joining, use appropriate INNER JOIN or LEFT JOIN based on foreign keys.
6. Target PostgreSQL dialect.
`.trim();

  // If Gemini API key is present, attempt native REST API call without heavy library dependency!
  if (apiKey && apiKey !== 'demo_key') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemInstruction}\n\nTranslate this business question to SQL: "${userQuestion}"` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 250,
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          let cleanSQL = candidateText.trim();
          cleanSQL = cleanSQL.replace(/^```(sql)?/i, '').replace(/```$/i, '').trim();
          return cleanSQL;
        }
      }
    } catch (apiError) {
      console.warn('⚠️ Gemini fetch error, falling back to heuristic engine:', apiError.message);
    }
  }

  // Graceful fallback heuristic query generator for offline demo / network limits
  return fallbackQueryGenerator(userQuestion);
}

/**
 * Fallback query generator for offline testing or demo mode
 */
function fallbackQueryGenerator(question) {
  const q = question.toLowerCase();
  if (q.includes('delete') || q.includes('drop') || q.includes('remove') || q.includes('truncate')) {
    return 'DELETE FROM employees WHERE status = \'inactive\';'; // Intentionally returns delete to test security guardrail!
  }
  if (q.includes('highest') || q.includes('salary') || q.includes('paid') || q.includes('earning')) {
    return 'SELECT id, name, role, salary FROM employees ORDER BY salary DESC LIMIT 5;';
  }
  if (q.includes('budget') || q.includes('department')) {
    return 'SELECT dept_name, location, budget FROM departments ORDER BY budget DESC;';
  }
  if (q.includes('project')) {
    return 'SELECT project_name, status, deadline FROM projects WHERE status = \'In Progress\';';
  }
  return 'SELECT id, name, role, salary FROM employees LIMIT 10;';
}

module.exports = {
  generateSQLFromText,
};
