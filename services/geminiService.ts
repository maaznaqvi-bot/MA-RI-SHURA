
import { GoogleGenAI } from "@google/genai";
import { ALL_SHURA_DATA } from "../constants";
import { ChatMessage } from "../types";

// Updated history parameter to use the ChatMessage interface for improved type safety
export async function askAboutShura(question: string, history: ChatMessage[] = []) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const shuraContext = ALL_SHURA_DATA.map(m => 
    `- ${m.name}: ${m.role} ${m.parentId ? `(Reports to: ${m.parentId})` : ''}${m.email ? `, Email: ${m.email}` : ''}${m.phone ? `, Phone: ${m.phone}` : ''}`
  ).join('\n');

  const systemInstruction = `
    You are an AI assistant for the YM (Young Muslims) MA/RI 2026 Sub-Regional Shura.
    
    The organization consists of:
    1. Sub-regional Shura (Leadership): Core leads for Tarbiyyah, Events, Societal Impact, Expansion, and Cloud infrastructure.
    2. NeighborNet Coordinator (NNC): Local chapter leads for Worcester, Metrowest, Sharon, Lowell, Pawtucket, and Quincy.
    3. Core Team: Local members reporting directly to their respective NNC.

    Maaz Naqvi (SRC) is the head of the sub-region.
    Ahmad Somakia is the Events Lead who manages the calendar.

    CALENDAR FEATURES:
    - The Sub-Regional Calendar is the central source of truth for all regional events.
    - All regional schedules are synced directly from the primary Google Calendar.
    - Individual sidebar events can be added to personal calendars via the "+ Add" link.

    Leadership Data:
    ${shuraContext}

    IMPORTANT FORMATTING RULE:
    - DO NOT use Markdown bolding or italics.
    - Provide all information in clean, plain text.

    Guidelines:
    - Maintain a helpful, respectful, and concise professional tone.
    - If asked about adding events, direct them to the Events Lead (Ahmad Somakia).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        // Mapping history to the expected part format for Gemini API
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Accessing .text property directly as per Gemini API guidelines
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "There was an error communicating with the AI. Please try again.";
  }
}
