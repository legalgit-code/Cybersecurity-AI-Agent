const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.post('/api/scan', async (req, res) => {
  const { type, content } = req.body;
  try {
    const r = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3.1:8b', prompt: 'You are a cybersecurity expert. Analyze this ' + type + ' for threats: ' + content + ' Give: 1.RISK LEVEL 2.THREAT SUMMARY 3.KEY INDICATORS 4.ACTIONS', stream: false })
    });
    const d = await r.json();
    res.json({ result: d.response });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.listen(5000, '127.0.0.1', () => console.log('SERVER OK http://127.0.0.1:5000'));
