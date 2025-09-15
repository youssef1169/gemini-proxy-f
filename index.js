require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json({ limit: '25mb' })); // allow large base64 bodies

const MODEL = 'gemini-2.5-flash-lite';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

app.get('/', (req, res) => {
  res.send('✅ Gemini Proxy is running');
});

app.post('/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', prompt } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Build Gemini request payload
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt || 'Describe this image briefly.' },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        thinkingConfig: { thinkingBudget: 0 } // fastest response
      }
    };

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.GEMINI_API_KEY) {
      headers['x-goog-api-key'] = process.env.GEMINI_API_KEY;
    }

    const r = await axios.post(API_URL, payload, { headers });

    // Parse Gemini response
    const text = r.data?.candidates?.[0]?.content?.parts?.[0]?.text 
               ?? JSON.stringify(r.data);

    return res.json({ text });
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
    return res.status(500).json({ error: err.response?.data || err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
