# Gemini Proxy (Render.com)

A simple proxy to safely use **Gemini 2.5 Flash-Lite** from a Flutter app without exposing your API key.

## 🚀 Deploying to Render

1. Fork or clone this repo, then push it to your GitHub.
2. On [Render.com](https://render.com):
   - Click **New → Web Service**
   - Connect your repo
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Add an environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: (your API key from Google AI Studio)

Render will give you a public URL like:
```
https://your-service.onrender.com
```

Test it:
```
curl https://your-service.onrender.com/
```

Analyze an image:
```bash
IMAGE_B64=$(base64 -w0 path/to/image.jpg)
curl -X POST https://your-service.onrender.com/analyze   -H "Content-Type: application/json"   -d "{\"imageBase64\":\"$IMAGE_B64\",\"mimeType\":\"image/jpeg\",\"prompt\":\"Say hello\"}"
```

## 🔑 Security
- Never put your API key inside the Flutter app.
- All requests go through this proxy.
