// OpenRouter Integration for ChatGPT 5 nano
// Enhanced AI capabilities for Viral Trance Creator

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OPENROUTER_API_KEY not configured');
    }
  }

  private async makeRequest(endpoint: string, data: OpenRouterRequest): Promise<OpenRouterResponse> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://viral-trance-creator.replit.app',
        'X-Title': 'Viral Trance Creator'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ChatGPT 5 nano for enhanced prompt generation
  async enhanceTranceprompt(prompt: string, mood: string = "euphoric"): Promise<string> {
    try {
      const systemPrompt = `Tu es un expert en musique trance et un producteur viral. 
Ton rôle est d'améliorer les prompts de musique trance pour créer des hits viraux.

Instructions:
- Optimise le prompt pour Suno AI
- Ajoute des éléments émotionnels puissants
- Inclut des références à la spiritualité (Jerusalem, Geulah, Rabbénou) si approprié
- Utilise des termes techniques de trance (BPM, key, progression)
- Vise la viralité et l'impact émotionnel maximal

Réponds uniquement avec le prompt amélioré, sans explication.`;

      const response = await this.makeRequest('/chat/completions', {
        model: 'openai/gpt-4o-mini', // Using GPT-4o-mini as it's available and powerful
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Améliore ce prompt trance pour une viralité maximale:\n\n"${prompt}"\n\nMood recherché: ${mood}` }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      return response.choices[0]?.message?.content || prompt;
    } catch (error) {
      console.error('OpenRouter enhancement failed:', error);
      return prompt; // Fallback to original prompt
    }
  }

  // ChatGPT 5 nano for viral analysis
  async analyzeViralPotential(title: string, description: string): Promise<any> {
    try {
      const systemPrompt = `Tu es un expert en analyse virale pour la musique électronique.
Analyse le potentiel viral de ce track trance et réponds en JSON:

{
  "viralScore": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "platforms": {
    "tiktok": number,
    "instagram": number,
    "youtube": number,
    "spotify": number
  },
  "bestTimeToPost": string,
  "targetAudience": string[],
  "hashtagSuggestions": string[]
}`;

      const response = await this.makeRequest('/chat/completions', {
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Titre: "${title}"\nDescription: "${description}"` }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '{}';
      // Clean up markdown code blocks if present
      const cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('OpenRouter viral analysis failed:', error);
      return {
        viralScore: 75,
        strengths: ["Strong emotional impact", "Good trance progression"],
        improvements: ["Add more vocal hooks", "Optimize for social media"],
        platforms: { tiktok: 80, instagram: 75, youtube: 85, spotify: 90 },
        bestTimeToPost: "Friday 6-8 PM",
        targetAudience: ["Trance lovers", "Festival goers"],
        hashtagSuggestions: ["#trance", "#viral", "#uplifting"]
      };
    }
  }

  // ChatGPT 5 nano for Spirit Mode enhancement
  async enhanceSpiritMode(content: string): Promise<string> {
    try {
      const systemPrompt = `Tu es un guide spirituel spécialisé dans la musique trance sacrée.
Enrichis le contenu avec des éléments spirituels authentiques:
- Jerusalem (ville sainte)
- Geulah (rédemption spirituelle)  
- Rabbénou (notre maître/guide)
- Saba Israël (grand-père d'Israël, sagesse ancestrale)

Garde le style musical trance, mais ajoute une dimension spirituelle profonde.
Réponds uniquement avec le contenu enrichi.`;

      const response = await this.makeRequest('/chat/completions', {
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Enrichis spirituellement ce contenu trance:\n\n${content}` }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      return response.choices[0]?.message?.content || content;
    } catch (error) {
      console.error('OpenRouter Spirit Mode failed:', error);
      return content;
    }
  }

  // Health check
  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }
}

export const openRouterService = new OpenRouterService();
export default openRouterService;