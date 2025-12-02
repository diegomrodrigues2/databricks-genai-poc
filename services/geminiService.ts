import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Keep track of active chat sessions by ID
const chatSessions: Record<string, Chat> = {};

export const getOrCreateChatSession = (chatId: string): Chat => {
  if (!chatSessions[chatId]) {
    chatSessions[chatId] = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful coding assistant embedded in a VS Code-like environment. Keep responses concise and technical.",
      },
    });
  }
  return chatSessions[chatId];
};

export const sendMessageToGemini = async (chatId: string, message: string): Promise<string> => {
  try {
    const chat = getOrCreateChatSession(chatId);
    const result = await chat.sendMessage({ message });
    return result.text || "No response received.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Error: Could not connect to the agent.";
  }
};