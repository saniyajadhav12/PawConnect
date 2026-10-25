import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../service/app.js";
import { seedDemoData, DEMO_ACCOUNTS, DEMO_PASSWORD } from "../scripts/demo-data.js";
import User from "../service/models/user.js";
import Pet from "../service/models/pet.js";
import FoodProduct from "../service/models/food_product.js";
import NGO from "../service/models/ngo.js";
import Fundraiser from "../service/models/fundraiser.js";

// The first run downloads a MongoDB binary, which can take much longer than Jest's 5s default
const SETUP_TIMEOUT_MS = 120_000;

let mongo;
let app;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_CONNECTION = mongo.getUri("pawconnect-seed-test");
    process.env.JWT_SECRET = "test-jwt-secret";
    app = await createApp();
}, SETUP_TIMEOUT_MS);

afterAll(async () => {
    await mongoose.disconnect();
    await mongo?.stop();
});

const countAll = async () => ({
    users: await User.countDocuments(),
    pets: await Pet.countDocuments(),
    foodProducts: await FoodProduct.countDocuments(),
    ngos: await NGO.countDocuments(),
    fundraisers: await Fundraiser.countDocuments(),
});

describe("seedDemoData", () => {
    test("is idempotent, keeps non-demo data, and creates working demo logins", async () => {
        // Data that belongs to a real user must survive seeding
        const realUser = await User.create({ name: "Real", email: "real@example.com", password: "secret123" });
        await Pet.create({
            type: "Dog", breed: "Poodle", age: 4, size: "Medium",
            disabilityStatus: false, shelterLocation: "Real Shelter", createdBy: realUser._id,
        });

        const first = await seedDemoData();
        const afterFirst = await countAll();
        const second = await seedDemoData();
        const afterSecond = await countAll();

        expect(afterSecond).toEqual(afterFirst);
        expect(second.created).toEqual(first.created);
        expect(afterFirst).toEqual({
            users: 1 + first.created.users,
            pets: 1 + first.created.pets,
            foodProducts: first.created.foodProducts,
            ngos: first.created.ngos,
            fundraisers: first.created.fundraisers,
        });
        expect(first.created).toMatchObject({ users: 3, foodProducts: 8, ngos: 3 });

        // The second run replaced exactly the first run's demo records
        expect(second.removed).toEqual(first.created);

        expect(await User.exists({ email: "real@example.com" })).toBeTruthy();
        expect(await Pet.exists({ breed: "Poodle", createdBy: realUser._id })).toBeTruthy();
        expect(await NGO.countDocuments({ status: "approved" })).toBe(2);
        expect(await NGO.countDocuments({ status: "pending" })).toBe(1);

        for (const account of DEMO_ACCOUNTS) {
            const res = await request(app)
                .post("/user/login")
                .send({ email: account.email, password: DEMO_PASSWORD })
                .expect(200);
            expect(res.body.user.role).toBe(account.role);
        }
    });
});
