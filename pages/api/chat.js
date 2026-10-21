
import nc from 'next-connect';
import { GoogleGenAI, Type } from '@google/genai';

const handler = nc();

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    advice_text: {
      type: Type.STRING,
      description: 'Practical farming advice in the requested language',
    },
    fertilizer: {
      type: Type.STRING,
      description: 'Cautious fertilizer and soil amendment guidance',
    },
    pest_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['advice_text', 'fertilizer', 'pest_flags', 'suggestions'],
};

handler.post(async (req, res) => {
  const { message, lang, lat, lon, crop } = req.body || {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: 'Please enter a farming question.',
    });
  }

  if (message.length > 4000) {
    return res.status(400).json({
      ok: false,
      error: 'Please keep your question under 4000 characters.',
    });
  }

  if (
    lat != null &&
    (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90)
  ) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid latitude.',
    });
  }

  if (
    lon != null &&
    (typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180)
  ) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid longitude.',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      error: 'AI Assistant is not configured. Check the server environment.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const prompt = `
You are KrishiSethuu, an agricultural information assistant for farmers,
especially in India.

Give practical, clear farming guidance in the requested language.
Never invent local weather, soil test results, or location facts.
Do not invent pesticide or fertilizer dosages.
Recommend following product labels and local agricultural department
or agricultural university guidance.
Explain uncertainty when details are missing.

Farmer's question: ${message.trim()}
Crop: ${crop ? String(crop).slice(0, 100) : 'Not specified'}
Preferred language: ${lang ? String(lang).slice(0, 50) : 'English'}
Approximate coordinates: ${
      lat != null && lon != null ? `${lat}, ${lon}` : 'Not provided'
    }

Return:
- advice_text: helpful farming advice
- fertilizer: cautious fertilizer or soil amendment guidance
- pest_flags: an array of pests or diseases to monitor
- suggestions: an array of actionable next steps

Treat coordinates as context only. Do not claim to have measured soil or
confirmed a disease from this text question.
    `.trim();

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const responseText = result.text;

    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    const data = JSON.parse(responseText);

    if (
      typeof data.advice_text !== 'string' ||
      typeof data.fertilizer !== 'string' ||
      !Array.isArray(data.pest_flags) ||
      !Array.isArray(data.suggestions)
    ) {
      throw new Error('Gemini returned an invalid response format.');
    }

    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error(
      'Gemini API error:',
      error.status || error.code || 'unknown',
      error.message || 'No error details'
    );

    const details = String(error.message || '').toLowerCase();

    if (
      error.status === 429 ||
      details.includes('quota') ||
      details.includes('rate limit')
    ) {
      return res.status(429).json({
        ok: false,
        error: 'AI usage limit reached. Please try again later.',
      });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(502).json({
        ok: false,
        error: 'Gemini authentication failed. Check your API key and permissions.',
      });
    }

    if (error.status === 404 || details.includes('not found')) {
      return res.status(502).json({
        ok: false,
        error: 'The configured Gemini model was not found. Check GEMINI_MODEL.',
      });
    }

    return res.status(502).json({
      ok: false,
      error: 'The AI Assistant could not generate a response. Please try again.',
    });
  }
});

export default handler;
