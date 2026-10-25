import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../service/app.js";
import User from "../service/models/user.js";

// The first run downloads a MongoDB binary, which can take much longer than Jest's 5s default
const SETUP_TIMEOUT_MS = 120_000;
const PASSWORD = "secret123";

let mongo;
let app;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_CONNECTION = mongo.getUri("pawconnect-security-test");
    process.env.JWT_SECRET = "test-jwt-secret";
    app = await createApp({ authRateLimit: { limit: 1000 } });
}, SETUP_TIMEOUT_MS);

afterEach(async () => {
    delete process.env.CORS_ORIGIN;
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo?.stop();
});

const signUpAndLogIn = async (name, email) => {
    await request(app).post("/user").send({ name, email, password: PASSWORD }).expect(200);
    const res = await request(app).post("/user/login").send({ email, password: PASSWORD }).expect(200);
    return res.body;
};

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe("rate limiting", () => {
    test("returns a JSON 429 after too many failed logins", async () => {
        const limitedApp = await createApp({ authRateLimit: { limit: 3, windowMs: 60_000 } });
        await request(limitedApp).post("/user").send({ name: "Alice", email: "alice@test.com", password: PASSWORD });

        for (let attempt = 0; attempt < 3; attempt++) {
            await request(limitedApp)
                .post("/user/login")
                .send({ email: "alice@test.com", password: "wrong-password" })
                .expect(401);
        }

        const blocked = await request(limitedApp)
            .post("/user/login")
            .send({ email: "alice@test.com", password: PASSWORD })
            .expect(429);
        expect(blocked.body).toEqual({ message: "Too many attempts. Please try again in 1 minute." });
        expect(blocked.headers["content-type"]).toMatch(/application\/json/);
    });

    test("successful logins don't count towards the login limit", async () => {
        const limitedApp = await createApp({ authRateLimit: { limit: 2, windowMs: 60_000 } });
        await request(limitedApp).post("/user").send({ name: "Bob", email: "bob@test.com", password: PASSWORD });

        for (let attempt = 0; attempt < 4; attempt++) {
            await request(limitedApp)
                .post("/user/login")
                .send({ email: "bob@test.com", password: PASSWORD })
                .expect(200);
        }
    });
});

describe("request validation", () => {
    test("rejects invalid signup data with 400 and clear messages", async () => {
        const res = await request(app)
            .post("/user")
            .send({ name: "  ", email: "not-an-email", password: "123" })
            .expect(400);

        expect(res.body.errors).toEqual(expect.arrayContaining([
            { field: "name", message: "Name is required" },
            { field: "email", message: "Email must be a valid email address" },
            { field: "password", message: "Password must be at least 6 characters" },
        ]));
        expect(res.body.message).toContain("Email must be a valid email address");
        expect(await User.countDocuments()).toBe(0);
    });

    test("rejects a pet with wrong types", async () => {
        const { token } = await signUpAndLogIn("Alice", "alice@test.com");
        const res = await request(app)
            .post("/pets")
            .set(auth(token))
            .send({ type: "Dog", breed: "Beagle", age: "three", size: "Medium", disabilityStatus: "no", shelterLocation: "Boston" })
            .expect(400);

        expect(res.body.errors.map((error) => error.field).sort()).toEqual(["age", "disabilityStatus"]);
    });

    test("rejects JSON bodies over the size limit with 413", async () => {
        const res = await request(app)
            .post("/user")
            .send({ name: "x".repeat(200 * 1024), email: "big@test.com", password: PASSWORD })
            .expect(413);
        expect(res.body.message).toMatch(/too large/);
    });
});

describe("mass assignment", () => {
    test("a pet update cannot change createdBy", async () => {
        const alice = await signUpAndLogIn("Alice", "alice@test.com");
        const bob = await signUpAndLogIn("Bob", "bob@test.com");
        const pet = await request(app)
            .post("/pets")
            .set(auth(alice.token))
            .send({ type: "Dog", breed: "Beagle", age: 3, size: "Medium", disabilityStatus: false, shelterLocation: "Boston" })
            .expect(200);

        const updated = await request(app)
            .put(`/pets/${pet.body._id}`)
            .set(auth(alice.token))
            .send({ age: 4, createdBy: bob.userId, _id: "000000000000000000000000" })
            .expect(200);

        expect(updated.body.age).toBe(4);
        expect(updated.body.createdBy).toBe(alice.userId);
        expect(updated.body._id).toBe(pet.body._id);

        // Bob still can't edit it, so ownership really didn't move
        await request(app).put(`/pets/${pet.body._id}`).set(auth(bob.token)).send({ age: 9 }).expect(403);
    });

    test("signup and profile updates cannot set the role", async () => {
        await request(app)
            .post("/user")
            .send({ name: "Eve", email: "eve@test.com", password: PASSWORD, role: "ADMIN" })
            .expect(200);
        const eve = (await request(app).post("/user/login").send({ email: "eve@test.com", password: PASSWORD })).body;
        expect(eve.user.role).toBe("USER");

        const updated = await request(app)
            .put(`/user/${eve.userId}`)
            .set(auth(eve.token))
            .send({ name: "Eve Updated", role: "ADMIN" })
            .expect(200);
        expect(updated.body).toMatchObject({ name: "Eve Updated", role: "USER" });
    });

    test("an update with only protected fields is rejected", async () => {
        const alice = await signUpAndLogIn("Alice", "alice@test.com");
        const res = await request(app)
            .put(`/user/${alice.userId}`)
            .set(auth(alice.token))
            .send({ role: "ADMIN", _id: "000000000000000000000000" })
            .expect(400);
        expect(res.body.message).toBe("Provide at least one field to update");
    });

    test("NGO registration cannot set its own status or owner", async () => {
        const alice = await signUpAndLogIn("Alice", "alice@test.com");
        const res = await request(app)
            .post("/ngos")
            .set(auth(alice.token))
            .send({
                name: "Happy Tails", registrationId: "R-1", contactInfo: "+16175550100", description: "Rescue",
                location: { latitude: 42.36, longitude: -71.06, address: "Boston" },
                status: "approved", createdBy: "000000000000000000000000",
            })
            .expect(201);
        expect(res.body.status).toBe("pending");
        expect(res.body.createdBy).toBe(alice.userId);
    });
});

describe("security headers and CORS", () => {
    test("helmet sets security headers", async () => {
        const res = await request(app).get("/pets").expect(200);
        expect(res.headers["x-content-type-options"]).toBe("nosniff");
        expect(res.headers["x-powered-by"]).toBeUndefined();
    });

    test("CORS_ORIGIN restricts which origins are allowed", async () => {
        process.env.CORS_ORIGIN = "https://pawconnect.example, http://localhost:5173";
        const restrictedApp = await createApp();

        const allowed = await request(restrictedApp).get("/pets").set("Origin", "https://pawconnect.example");
        expect(allowed.headers["access-control-allow-origin"]).toBe("https://pawconnect.example");

        const blocked = await request(restrictedApp).get("/pets").set("Origin", "https://evil.example");
        expect(blocked.headers["access-control-allow-origin"]).toBeUndefined();
    });
});
