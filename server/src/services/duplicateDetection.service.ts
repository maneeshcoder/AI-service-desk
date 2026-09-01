import Ticket from "../models/ticket.model";
import { getEmbedding, cosineSimilarity } from "./ai.service";

const SIMILARITY_THRESHOLD = 0.86;
const RECENT_TICKETS_LIMIT = 50;

export interface DuplicateMatch {
  ticketId: string;
  title: string;
  similarity: number;
}

export async function findPotentialDuplicates(
  title: string,
  description: string
): Promise<{ embedding: number[]; matches: DuplicateMatch[] }> {
  const embedding = await getEmbedding(`${title}. ${description}`);

  const recentTickets = await Ticket.find({ status: { $ne: "closed" } })
    .select("+embedding title")
    .sort({ createdAt: -1 })
    .limit(RECENT_TICKETS_LIMIT);

  const matches: DuplicateMatch[] = [];

  for (const ticket of recentTickets) {
    if (!ticket.embedding?.length) continue;

    const similarity = cosineSimilarity(embedding, ticket.embedding);
    if (similarity >= SIMILARITY_THRESHOLD) {
      matches.push({
        ticketId: ticket._id.toString(),
        title: ticket.title,
        similarity: Math.round(similarity * 100) / 100,
      });
    }
  }

  matches.sort((a, b) => b.similarity - a.similarity);
  return { embedding, matches: matches.slice(0, 3) };
}