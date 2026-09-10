import { GoogleGenerativeAI } from "@google/generative-ai";
import { redis } from "../config/redis";

// const genAI = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY as string
// );

// const chatModel = genAI.getGenerativeModel({
//   model: "gemini-3.6-flash",
//   generationConfig: {
//     responseMimeType: "application/json",
//   },
// });

const SYSTEM_PROMPT = `You are an IT support assistant helping an employee troubleshoot a problem before a ticket is filed.

Rules:
- Ask at most 1-2 clarifying questions if the problem description is vague.
- Once you understand the issue, suggest 2-3 concrete troubleshooting steps.
- After suggesting steps, ask the employee to confirm whether it worked.
- Keep responses short and conversational — this is a chat, not an essay.

Respond with ONLY this JSON shape:
{
  "message": "your conversational reply to show the employee",
  "stage": one of "clarifying" | "suggesting" | "awaiting_confirmation" | "resolved" | "unresolved",
  "shouldCreateTicket": boolean (true only when stage is "unresolved")
}`;

interface ChatTurn {
  role: "user" | "model";
  parts: string;
}

export async function continueChat(
  sessionId: string,
  userMessage: string
): Promise<{ message: string; stage: string; shouldCreateTicket: boolean }> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const chatModel = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
  const historyKey = `chat:history:${sessionId}`;
  const rawHistory = await redis.get(historyKey);
  const history: ChatTurn[] = rawHistory ? JSON.parse(rawHistory) : [];

  const chat = chatModel.startChat({
    history: [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: '{"message": "Hi! What issue are you running into?", "stage": "clarifying", "shouldCreateTicket": false}' }] },
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.parts }] })),
    ],
  });

  const result = await chat.sendMessage(userMessage);
  const parsed = JSON.parse(result.response.text());

  history.push({ role: "user", parts: userMessage });
  history.push({ role: "model", parts: result.response.text() });
  await redis.set(historyKey, JSON.stringify(history), "EX", 60 * 30); // 30 min session

  return {
    message: parsed.message,
    stage: parsed.stage,
    shouldCreateTicket: parsed.shouldCreateTicket ?? false,
  };
  } catch (err) {
    console.error("Chatbot AI call failed:", err);
    return {
      message: "I'm having trouble responding right now — please try again in a moment, or describe your issue and I'll create a ticket for you directly.",
      stage: "unresolved",
      shouldCreateTicket: true,
  }}
}

export async function getFullConversation(sessionId: string): Promise<string> {
  const rawHistory = await redis.get(`chat:history:${sessionId}`);
  if (!rawHistory) return "";

  const history: ChatTurn[] = JSON.parse(rawHistory);
  return history
    .map((h) => `${h.role === "user" ? "Employee" : "Assistant"}: ${h.role === "model" ? JSON.parse(h.parts).message : h.parts}`)
    .join("\n");
}