import request from "supertest";
import app from "../src/app";



describe("Auth", () => {
  const testUser = { name: "Test User", email: "test@example.com", password: "password123" };

  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.password).toBeUndefined();
  });

  it("rejects duplicate email registration with 409", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(409);
  });

  it("rejects registration with a short password via Zod validation", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...testUser, password: "short" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("logs in with correct credentials and sets a refresh cookie", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects login with wrong password with 401", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });
});