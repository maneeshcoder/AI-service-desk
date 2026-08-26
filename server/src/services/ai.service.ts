import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../utils/AppError";


export interface TicketAnalysis {
    category: "network" | "hardware" | "software" | "account" | "other";
    priority: "low" | "medium" | "high" | "urgent";
    summary: string;
}

export interface SuggestedSolution {
    steps: string[];
    reasoning: string;
}

function getGeminiModel() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    return genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
    });
}

export async function analyzeTicket(title: string, description: string): Promise<TicketAnalysis> {


    const model = getGeminiModel();
    const prompt = `You are an IT support triage assistant. Analyze this support ticket and respond with ONLY a JSON object, no other text.

Ticket title: ${title}
Ticket description: ${description}

Respond with this exact JSON shape:
{
  "category": one of "network" | "hardware" | "software" | "account" | "other",
  "priority": one of "low" | "medium" | "high" | "urgent",
  "summary": a one-sentence summary of the issue, under 20 words
}

Priority guidance:
- urgent: complete work stoppage, security issue, affects many people
- high: significant impact on one person's ability to work
- medium: annoying but has a workaround
- low: minor, cosmetic, or a how-to question

Respond with ONLY the JSON object.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);

        return {
            category: parsed.category ?? "other",
            priority: parsed.priority ?? "medium",
            summary: parsed.summary ?? title,
        };
    } catch (err) {
        console.error("AI analysis failed:", err);
        // fall back to safe defaults rather than blocking ticket creation
        return { category: "other", priority: "medium", summary: title };
    }
}


export async function suggestSolution(
    title: string,
    description: string,
    category: string
): Promise<SuggestedSolution> {
    const model = getGeminiModel();
    const prompt = `You are an experienced IT support engineer. A ticket has come in:

Title: ${title}
Description: ${description}
Category: ${category}

Suggest a troubleshooting approach. Respond with ONLY this JSON shape:
{
  "steps": ["step 1", "step 2", "step 3"],
  "reasoning": "one sentence on why you're suggesting this approach"
}

Give 2-5 concrete, actionable steps a support engineer could try, ordered from most likely to resolve the issue to least likely. Be specific to the actual problem described, not generic advice.`;

    try {
        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());
        return {
            steps: Array.isArray(parsed.steps) ? parsed.steps : [],
            reasoning: parsed.reasoning ?? "",
        };
    } catch (err) {
        console.error("AI solution suggestion failed:", err);
        return { steps: [], reasoning: "" };
    }
}