import React, { useState } from 'react';

export default function App() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleQuestions = [
    'Who are the top 5 highest paid employees?',
    'Show total budget and location for each department',
    'List all projects that are currently In Progress',
    'Delete all inactive employees from the database', // To showcase security guardrail block!
  ];

  const handleQuery = async (queryText) => {
    const textToQuery = queryText || question;
    if (!textToQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to process query');
        if (data.sql || data.generatedSQL) {
          setResult({ sql: data.sql || data.generatedSQL, blocked: data.blocked });
        }
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(`Network error: ${err.message}. Ensure backend is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!result || !result.data || result.data.length === 0) return;
    const headers = result.columns.join(',');
    const rows = result.data.map(row => result.columns.map(col => `"${row[col] ?? ''}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `intellidb_query_result_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 16px', borderRadius: '20px', marginBottom: '16px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          <span style={{ fontSize: '13px', color: '#93c5fd', fontWeight: 500 }}>PERN Stack + Google Gemini AI</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}>
          Intelli<span style={{ color: '#38bdf8' }}>DB</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', marginTop: '8px' }}>
          Natural Language to SQL Query Engine with Read-Only Security Guardrails
        </p>
      </header>

      {/* Query Input Box */}
      <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
          Ask a business question in plain English:
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="e.g. Who are the top 5 highest paid employees?"
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleQuery()}
            disabled={loading}
            style={{
              padding: '14px 28px',
              borderRadius: '8px',
              background: loading ? '#475569' : '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Translating...' : 'Run Query ⚡'}
          </button>
        </div>

        {/* Sample Prompts */}
        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Try asking:</span>
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(sq);
                handleQuery(sq);
              }}
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: idx === 3 ? 'rgba(239, 68, 68, 0.15)' : '#1e293b',
                color: idx === 3 ? '#f87171' : '#94a3b8',
                border: idx === 3 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #334155',
                cursor: 'pointer',
              }}
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Security Error Alert */}
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#fca5a5' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>🛡️ Security Guardrail Triggered:</div>
          <div style={{ fontSize: '13px' }}>{error}</div>
        </div>
      )}

      {/* Generated SQL & Results */}
      {result && (
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          {/* SQL Preview Banner */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>Synthesized ANSI SQL Query:</span>
              {result.executionTimeMs && (
                <span style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  Execution: {result.executionTimeMs}ms
                </span>
              )}
            </div>
            <pre style={{ background: '#090d16', padding: '14px', borderRadius: '8px', color: '#a5f3fc', fontSize: '14px', overflowX: 'auto', border: '1px solid #1e293b' }}>
              {result.sql}
            </pre>
          </div>

          {/* Results Table */}
          {result.data && result.data.length > 0 ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>
                  Query Results ({result.rowCount} rows)
                </span>
                <button
                  onClick={exportToCSV}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    background: '#1e293b',
                    color: '#38bdf8',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  📥 Export to CSV
                </button>
              </div>

              <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
                      {result.columns.map((col, idx) => (
                        <th key={idx} style={{ padding: '12px 16px', borderBottom: '1px solid #334155', textTransform: 'capitalize' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row, rowIdx) => (
                      <tr key={rowIdx} style={{ borderBottom: '1px solid #1e293b', background: rowIdx % 2 === 0 ? '#131b2e' : '#0f172a' }}>
                        {result.columns.map((col, colIdx) => (
                          <td key={colIdx} style={{ padding: '12px 16px', color: '#e2e8f0' }}>
                            {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span style={{ color: '#64748b' }}>NULL</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : !result.blocked ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '14px' }}>
              No rows returned matching this query.
            </div>
          ) : null}
        </div>
      )}

      {/* Schema Card */}
      <footer style={{ textAlign: 'center', marginTop: '32px', color: '#475569', fontSize: '13px' }}>
        IntelliDB Engine &copy; 2026 Developed by Sripallav Yerram &bull; Department, Employee & Project Catalogs Introspected
      </footer>
    </div>
  );
}
