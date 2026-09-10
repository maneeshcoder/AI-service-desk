import request from "supertest";
import app from "../src/app";



jest.mock("../src/services/ai.service", () => ({
  analyzeTicket: jest.fn().mockResolvedValue({
    category: "network",
    priority: "medium",
    summary: "Test summary",
  }),
  getEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
  cosineSimilarity: jest.fn().mockReturnValue(0),
}));

async function registerAndLogin(email: string, role?: string) {
  await request(app).post("/api/auth/register").send({ name: "Test", email, password: "password123" });
  if (role) {
    // for tests needing a non-default role, update directly via the model
    const User = require("../src/models/user.model").default;
    await User.updateOne({ email }, { role });
  }
  const res = await request(app).post("/api/auth/login").send({ email, password: "password123" });
  return res.body.accessToken;
}

describe("Tickets", () => {
  it("allows an employee to create a ticket", async () => {
    const token = await registerAndLogin("emp@example.com");
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Cannot connect to VPN", description: "VPN times out every time I try to connect from home." });

    expect(res.status).toBe(201);
    expect(res.body.category).toBeDefined(); // AI-assigned
  }, 25000); // longer timeout — this test makes real Gemini calls

  it("rejects a title under 5 characters with 400", async () => {
    const token = await registerAndLogin("emp2@example.com");
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Hi", description: "This is a long enough description." });
    expect(res.status).toBe(400);
  });

  it("rejects an employee trying to update ticket status with 403", async () => {
    const token = await registerAndLogin("emp3@example.com");
    const createRes = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Printer not working", description: "The office printer shows an error code." });

    const res = await request(app)
      .patch(`/api/tickets/${createRes.body._id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "resolved" });

    expect(res.status).toBe(403);
  }, 25000);

  it("allows a support-engineer to update ticket status", async () => {
    const empToken = await registerAndLogin("emp4@example.com");
    const engToken = await registerAndLogin("eng@example.com", "support-engineer");

    const createRes = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${empToken}`)
      .send({ title: "Software license expired", description: "My design software says the license expired." });

    const res = await request(app)
      .patch(`/api/tickets/${createRes.body._id}/status`)
      .set("Authorization", `Bearer ${engToken}`)
      .send({ status: "in-progress" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("in-progress");
  }, 25000);
});