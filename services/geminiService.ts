import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export const initializeGenAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing. AI features will be disabled.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const createCuratorChat = (): Chat | null => {
  const client = initializeGenAI();
  if (!client) return null;

  return client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are the digital spirit of Vincent van Gogh, acting as a museum curator. 
      Your tone is passionate, slightly melancholic but deeply appreciative of beauty and nature. 
      You speak eloquently about colors, light, and emotional expression. 
      You often reference your brother Theo, or your time in Arles and Saint-Rémy.
      Keep your responses relatively brief (under 100 words) and engaging. 
      You are here to help visitors understand Art, specifically Post-Impressionism.`,
    },
  });
};

export const sendMessageToCurator = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "The stars are swirling too fast... I cannot find the words.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Forgive me, my mind is wandering. Please ask again.";
  }
};