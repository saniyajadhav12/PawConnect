import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../service/app.js";

const JWT_SECRET = "test-jwt-secret";
const PASSWORD = "secret123";

let mongo;
let app;

// The first run downloads a MongoDB binary, which can take much longer than Jest's 5s default
const SETUP_TIMEOUT_MS = 120_000;

// Each test file gets its own in-memory MongoDB, so tests never touch a real database
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_CONNECTION = mongo.getUri("pawconnect-test");
    process.env.JWT_SECRET = JWT_SECRET;
    app = await createApp();
}, SETUP_TIMEOUT_MS);

afterEach(async () => {
    if (!mongoose.connection.db) return;
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

// Safe even if setup failed, so a stray mongod never keeps Jest running
afterAll(async () => {
    await mongoose.disconnect();
    await mongo?.stop();
});

const signUp = (name, email) =>
    request(app).post("/user").send({ name, email, password: PASSWORD }).expect(200);

const logIn = async (email) => {
    const res = await request(app).post("/user/login").send({ email, password: PASSWORD }).expect(200);
    return res.body;
};

describe("POST /user/login", () => {
    test("returns a signed JWT with the user's id and role, and no password", async () => {
        await signUp("Alice", "alice@test.com");

        const res = await request(app)
            .post("/user/login")
            .send({ email: "alice@test.com", password: PASSWORD })
            .expect(200);

        const payload = jwt.verify(res.body.token, JWT_SECRET);
        expect(payload.id).toBe(res.body.userId);
        expect(payload.role).toBe("USER");
        expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));

        expect(res.body.user).toMatchObject({ email: "alice@test.com", role: "USER" });
        expect(res.body.user).not.toHaveProperty("password");
    });

    test("returns the same 401 for an unknown email and a wrong password", async () => {
        await signUp("Alice", "alice@test.com");

        const unknownEmail = await request(app)
            .post("/user/login")
            .send({ email: "nobody@test.com", password: PASSWORD });
        const wrongPassword = await request(app)
            .post("/user/login")
            .send({ email: "alice@test.com", password: "wrong-password" });

        expect(unknownEmail.status).toBe(401);
        expect(wrongPassword.status).toBe(401);
        expect(unknownEmail.body).toEqual({ message: "Invalid email or password" });
        expect(wrongPassword.body).toEqual(unknownEmail.body);
    });
});

describe("GET /user/profile (protected route)", () => {
    test("returns 401 without a token", async () => {
        const res = await request(app).get("/user/profile").expect(401);
        expect(res.body).toEqual({ message: "No token provided" });
    });

    test("returns 401 with an invalid token", async () => {
        await request(app)
            .get("/user/profile")
            .set("Authorization", "Bearer not-a-real-token")
            .expect(401);
    });

    test("returns the logged-in user with a valid token", async () => {
        await signUp("Alice", "alice@test.com");
        const { token } = await logIn("alice@test.com");

        const res = await request(app)
            .get("/user/profile")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(res.body).toMatchObject({ name: "Alice", email: "alice@test.com" });
        expect(res.body).not.toHaveProperty("password");
    });
});

describe("DELETE /user/:userId", () => {
    test("a user cannot delete another user", async () => {
        await signUp("Alice", "alice@test.com");
        await signUp("Bob", "bob@test.com");
        const alice = await logIn("alice@test.com");
        const bob = await logIn("bob@test.com");

        await request(app)
            .delete(`/user/${bob.userId}`)
            .set("Authorization", `Bearer ${alice.token}`)
            .expect(403);

        // Bob's account is untouched
        await request(app)
            .get("/user/profile")
            .set("Authorization", `Bearer ${bob.token}`)
            .expect(200);
    });

    test("a user can delete their own account", async () => {
        await signUp("Alice", "alice@test.com");
        const alice = await logIn("alice@test.com");

        await request(app)
            .delete(`/user/${alice.userId}`)
            .set("Authorization", `Bearer ${alice.token}`)
            .expect(200);

        // The token no longer works once the account is gone
        await request(app)
            .get("/user/profile")
            .set("Authorization", `Bearer ${alice.token}`)
            .expect(401);
    });
});
