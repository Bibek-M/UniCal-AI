import type { ChatMessage } from './types.ts';

const GROQ_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models';

// Popular Groq chat models in order of capability & availability
const PREFERRED_GROQ_ORDER = [
  'llama3-70b-8192',
  'llama3-8b-8192',
  'gemma2-9b-it',
  'llama-3.1-70b-versatile',
  'llama-3.2-3b-preview',
  'llama-3.2-1b-preview',
  'llama-3.2-11b-vision-preview',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

let cachedGroqModels: string[] | null = null;

export function getGroqApiKey(): string {
  const key = (process.env.GROQ_API || process.env.GROQ_API_KEY || '').trim();
  if (!key) {
    throw new Error(
      'GROQ_API key is not configured in environment variables. Please check server/.env.'
    );
  }
  return key;
}

/**
 * Dynamically queries Groq's official /models API to discover which models
 * are currently active and authorized for this specific API key.
 */
export async function fetchAvailableGroqModels(apiKey: string): Promise<string[]> {
  if (cachedGroqModels && cachedGroqModels.length > 0) {
    return cachedGroqModels;
  }

  try {
    const res = await fetch(GROQ_MODELS_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data?.data)) {
        const activeModels = data.data
          .filter((m: any) => {
            const id = m?.id;
            if (!id || typeof id !== 'string') return false;
            // Exclude audio/whisper models
            if (id.toLowerCase().includes('whisper')) return false;
            // Exclude decommissioned or inactive models
            if (m.active === false) return false;
            return true;
          })
          .map((m: any) => m.id as string);

        if (activeModels.length > 0) {
          console.log('[Groq Client] Discovered active models for this key:', activeModels);
          cachedGroqModels = activeModels;
          return activeModels;
        }
      }
    } else {
      const errText = await res.text();
      console.warn(`[Groq Client] /models API returned status ${res.status}:`, errText);
    }
  } catch (err: any) {
    console.warn('[Groq Client] Could not query /models dynamically:', err.message);
  }

  // Fallback to static preferred list if network discovery fails
  return PREFERRED_GROQ_ORDER;
}

export interface GroqCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Dispatches a chat completion request to the Groq API, dynamically prioritizing
 * models that are actually available for this API key.
 */
export async function generateGroqChatCompletion(
  messages: ChatMessage[],
  options: GroqCompletionOptions = {}
): Promise<{ reply: string; modelUsed: string }> {
  const apiKey = getGroqApiKey();

  // 1. Discover models authorized for this key
  const availableModels = await fetchAvailableGroqModels(apiKey);

  // 2. Build candidate queue prioritized by preference & actual availability
  const envModel = process.env.GROQ_MODEL?.trim();
  const candidateModels: string[] = [];

  // Env override has top priority
  if (envModel) {
    candidateModels.push(envModel);
  }

  // Preferred models that are verified to be in availableModels
  for (const preferred of PREFERRED_GROQ_ORDER) {
    if (availableModels.includes(preferred) && !candidateModels.includes(preferred)) {
      candidateModels.push(preferred);
    }
  }

  // Any other active models reported by Groq
  for (const available of availableModels) {
    if (!candidateModels.includes(available)) {
      candidateModels.push(available);
    }
  }

  // Fallback candidates if list is empty
  for (const preferred of PREFERRED_GROQ_ORDER) {
    if (!candidateModels.includes(preferred)) {
      candidateModels.push(preferred);
    }
  }

  console.log(`[Groq Client] Attempting chat completion with models: ${candidateModels.slice(0, 5).join(', ')}...`);

  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch(GROQ_COMPLETIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: options.temperature ?? 0.2,
          max_tokens: options.max_tokens ?? 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Groq Client] Model "${model}" failed with HTTP ${response.status}:`, errorText);
        lastError = new Error(`Groq API error (${response.status}): ${errorText}`);

        // If model not found or decommissioned, invalidate cached model list and continue to next
        if (response.status === 404 || response.status === 400) {
          if (cachedGroqModels) {
            cachedGroqModels = cachedGroqModels.filter((m) => m !== model);
          }
        }
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        throw new Error(`Groq returned empty response for model "${model}".`);
      }

      console.log(`[Groq Client] Chat completion succeeded with model "${model}"`);
      return {
        reply,
        modelUsed: model,
      };
    } catch (err: any) {
      console.warn(`[Groq Client] Attempt with model "${model}" failed:`, err.message);
      lastError = err;
    }
  }

  // 3. Optional fallback: If all Groq models failed and GEMINI_API_KEY is available, fallback to Gemini
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    console.warn('[Groq Client] All Groq models failed. Attempting fallback to Gemini...');
    try {
      const fallbackReply = await generateGeminiFallbackCompletion(messages, geminiKey);
      if (fallbackReply) {
        return {
          reply: fallbackReply,
          modelUsed: 'gemini-flash-fallback',
        };
      }
    } catch (fallbackErr: any) {
      console.warn('[Groq Client] Gemini fallback also failed:', fallbackErr.message);
    }
  }

  throw lastError || new Error('All Groq model attempts failed.');
}

/**
 * Fallback helper using Google Gemini if Groq is experiencing outages or decommission issues
 */
async function generateGeminiFallbackCompletion(messages: ChatMessage[], apiKey: string): Promise<string> {
  const geminiModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-1.5-flash'];
  const systemMsg = messages.find((m) => m.role === 'system')?.content || '';
  const conversation = messages.filter((m) => m.role !== 'system');

  const contents = conversation.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  for (const model of geminiModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(systemMsg && {
            systemInstruction: { parts: [{ text: systemMsg }] },
          }),
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          console.log(`[Groq Client] Gemini fallback succeeded with model "${model}"`);
          return text;
        }
      }
    } catch {
      // Try next model
    }
  }

  throw new Error('Gemini fallback could not generate response.');
}
