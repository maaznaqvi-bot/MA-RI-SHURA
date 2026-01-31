
import { GoogleGenAI } from "@google/genai";
import { ALL_SHURA_DATA } from "../constants";

export async function askAboutShura(question: string, history: { role: string; text: string }[] = []) {
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
    - Users can merge existing calendars (like local chapter calendars) into the main view using the "Link Chapter Calendar" button.
    - To link a calendar, the user needs the Google Calendar ID, which is found in Calendar Settings > Integrate Calendar.
    - Users can also request new events to be added to the calendar using the "Request Event" button.
    - Individual sidebar events can be added to personal calendars via the "+ Add to Cal" link.

    Leadership Data:
    ${shuraContext}

    IMPORTANT FORMATTING RULE:
    - DO NOT use Markdown bolding or italics.
    - Provide all information in clean, plain text.

    Guidelines:
    - If asked about adding existing calendars, explain the "Link Chapter Calendar" button and where to find the Calendar ID.
    - Maintain a helpful, respectful, and concise professional tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "There was an error communicating with the AI. Please try again.";
  }
}
