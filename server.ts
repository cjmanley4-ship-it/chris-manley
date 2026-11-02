import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? parseInt(process.env.PORT || '8080', 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI SDK instance if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Server-side unified LLM caller
 * Uses gemini-3.8-flash for fast and reliable structured JSON generation.
 */
async function callLLM(prompt: string, data: any, agentName: string = 'Agent') {
  if (!aiClient) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please verify your secrets configuration.');
  }

  const promptContent = `${prompt}

INPUT DATA:
${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}

REMINDER: Return ONLY a valid JSON object matching the requested OUTPUT FORMAT schema. Do NOT wrap with any conversational text.`;

  // Retry up to 3 times with exponential backoff for transient 503 or network errors
  let lastError: any = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text || '';
      
      // Clean any markdown codeblocks if returned
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.slice(7);
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.slice(3);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
      cleanJson = cleanJson.trim();

      const parsed = JSON.parse(cleanJson);
      return parsed;
    } catch (err: any) {
      lastError = err;
      console.warn(`Attempt ${attempt} for ${agentName} encountered:`, err?.message || err);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(lastError?.message || `Failed to generate response for ${agentName} after retries`);
}

// API endpoint for calling LLM
app.post('/api/call-llm', async (req: Request, res: Response) => {
  const { prompt, data, agentName } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt parameter' });
  }

  try {
    const result = await callLLM(prompt, data, agentName);
    return res.json({ success: true, result });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'LLM generation failed',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    model: 'gemini-3.8-flash',
  });
});

async function startServer() {
  if (!isProduction) {
    // Vite middleware for development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port} [${isProduction ? 'prod' : 'dev'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
