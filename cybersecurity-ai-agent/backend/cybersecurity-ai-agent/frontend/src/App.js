import React, { useState } from 'react';
import './App.css';

function App() {
  const [tab, setTab] = useState('email');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState('');

  const scan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    setRiskLevel('');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab, content: input })
      });
      const data = await res.json();
      setResult(data.result);
      if (data.result.includes('Critical')) setRiskLevel('critical');
      else if (data.result.includes('High')) setRiskLevel('high');
      else if (data.result.includes('Medium')) setRiskLevel('medium');
      else setRiskLevel('low');
    } catch (e) {
      setResult('Error: ' + e.message);
    }
    setLoading(false);
  };

  const riskColor = {
    critical: '#ff0000',
    high: '#ff6600',
    medium: '#ffaa00',
    low: '#00cc44'
  };

  return (
    <div className="app">
      <header className="header">
        <h1>CYBERSECURITY AI AGENT</h1>
        <p>Powered by LLaMA 3.1 — Local AI, Zero Data Leaks</p>
      </header>

      <div className="tabs">
        {['email', 'url', 'log'].map(t => (
          <button
            key={t}
            className={tab === t ? 'tab active' : 'tab'}
            onClick={() => { setTab(t); setInput(''); setResult(''); }}
          >
            {t === 'email' ? 'Email Scanner' : t === 'url' ? 'URL Scanner' : 'Log Analyzer'}
          </button>
        ))}
      </div>

      <div className="scanner">
        <textarea
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={
            tab === 'email' ? 'Paste suspicious email here...' :
            tab === 'url' ? 'Enter URL to analyze...' :
            'Paste security logs here...'
          }
          rows={6}
        />
        <button className="scan-btn" onClick={scan} disabled={loading}>
          {loading ? 'Analyzing...' : 'Scan for Threats'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>AI analyzing threats...</p>
        </div>
      )}

      {result && (
        <div className="result">
          <div className="risk-badge" style={{ background: riskColor[riskLevel] || '#666' }}>
            RISK: {riskLevel.toUpperCase()}
          </div>
          <pre className="result-text">{result}</pre>
        </div>
      )}

      <footer className="footer">
        <p>Cybersecurity AI Agent — Microsoft Build Hackathon 2026</p>
      </footer>
    </div>
  );
}

export default App;