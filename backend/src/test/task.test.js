import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Auth API", () => {
  const signupPayload = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  const loginPayload = {
    email: "test@example.com",
    password: "password123",
  };

  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(signupPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("accessToken"); // updated
    expect(res.body.data.user).toHaveProperty("email", "test@example.com");
    expect(res.body.data.user).toHaveProperty("username", "testuser");
  });

  it("should log in an existing user", async () => {
    await request(app).post("/api/auth/signup").send(signupPayload);

    const res = await request(app).post("/api/auth/login").send(loginPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data.user).toHaveProperty("email", "test@example.com");
  });

  it("should get current user with valid token", async () => {
    const signupRes = await request(app).post("/api/auth/signup").send(signupPayload);
    const token = signupRes.body.data.accessToken;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user).toHaveProperty("email", "test@example.com");
  });

  it("should logout a user", async () => {
    const signupRes = await request(app).post("/api/auth/signup").send(signupPayload);
    const token = signupRes.body.data.accessToken;

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User logged out");
  });
});
