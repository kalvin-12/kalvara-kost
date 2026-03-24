/**
 * Kalvara AI Chat — Vercel Serverless Function
 * Menggunakan Google Gemini API (gemini-2.0-flash)
 *
 * Setup:
 * 1. Buat API key di: https://aistudio.google.com/apikey
 * 2. Set environment variable di Vercel: GEMINI_API_KEY = api key Anda
 */

export default async function handler(req, res) {

  // ── CORS ────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── API Key ──────────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Batasi history (hemat token)
    const trimmed = messages.slice(-20);

    // ── Convert format Anthropic → Gemini ───────────────────
    // Anthropic: [{ role: 'user'|'assistant', content: '...' }]
    // Gemini:    [{ role: 'user'|'model',     parts: [{ text: '...' }] }]
    const geminiContents = trimmed.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // ── Gemini API URL ───────────────────────────────────────
    const GEMINI_URL =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // System instruction (konteks Kalvara)
        system_instruction: {
          parts: [{ text: system || '' }],
        },
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.75,
          topP: 0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    const data = await geminiRes.json();

    // ── Error dari Gemini ────────────────────────────────────
    if (!geminiRes.ok) {
      console.error('Gemini error:', JSON.stringify(data));
      return res.status(geminiRes.status).json({
        error: data.error?.message || 'Gemini API error',
      });
    }

    // ── Ambil teks dari response Gemini ─────────────────────
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Empty Gemini response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    // ── Kembalikan dalam format yang sama dengan Anthropic ───
    // Supaya frontend tidak perlu diubah
    return res.status(200).json({
      content: [{ type: 'text', text }],
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
