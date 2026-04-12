const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const isGemini = process.env.AI_PROVIDER === 'gemini';

if (!process.env.OPENAI_API_KEY && !isGemini) {
  console.warn('Warning: OPENAI_API_KEY is not set in environment variables');
}

let aiClient;

if (isGemini) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');
  
  // Create an OpenAI-compatible mock client wrapper
  aiClient = {
    chat: {
      completions: {
        create: async ({ model, messages, response_format }) => {
          const geminiModel = process.env.AI_MODEL || 'gemini-2.5-flash';
          const aiModel = genAI.getGenerativeModel({ 
            model: geminiModel,
            generationConfig: {
              responseMimeType: response_format && response_format.type === 'json_object' ? 'application/json' : 'text/plain'
            }
          });

          let fullPrompt = '';
          for (let msg of messages) {
            fullPrompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
          }
          
          const result = await aiModel.generateContent(fullPrompt);
          const responseText = result.response.text();
          
          return {
            choices: [
              {
                message: {
                  content: responseText
                }
              }
            ]
          };
        }
      }
    }
  };
} else {
  // Use standard OpenAI client
  aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
  });
}

module.exports = aiClient;
