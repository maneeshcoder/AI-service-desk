import "dotenv/config";
import { analyzeTicket } from "../services/ai.service";

async function main() {
  const result = await analyzeTicket(
    "Can't connect to VPN",
    "I've been trying to connect to the office VPN since this morning and it keeps timing out. I have a client call in 20 minutes."
  );

  console.log("AI Analysis:");
  console.log(result);
}

main().catch(console.error);