const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { type, content } = req.body;
  
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:8b",
        prompt: `You are a cybersecurity expert. Analyze this ${type} for threats:

${content}

Respond with:
1. RISK LEVEL: (Critical/High/Medium/Low)
2. THREAT SUMMARY: (2-3 sentences)
3. KEY INDICATORS: (bullet points of suspicious elements)
4. RECOMMENDED ACTIONS: (bullet points)`,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ result: data.response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Make sure Ollama is running: ollama serve" });
  }
});

module.exports = router;