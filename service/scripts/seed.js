// Inserts demo data. Usage: npm run seed  (reads MONGO_CONNECTION from service/.env)
import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedDemoData, DEMO_ACCOUNTS, DEMO_PASSWORD } from "./demo-data.js";

dotenv.config();

if (!process.env.MONGO_CONNECTION) {
    console.error("Missing MONGO_CONNECTION. Copy service/.env.example to service/.env and fill it in.");
    process.exit(1);
}

// Demo accounts share a published password, so never create them on a production database by accident
if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_SEED !== "true") {
    console.error("Refusing to seed demo accounts with NODE_ENV=production. Set ALLOW_DEMO_SEED=true to override.");
    process.exit(1);
}

try {
    await mongoose.connect(process.env.MONGO_CONNECTION);
    const { removed, created } = await seedDemoData();
    const removedTotal = Object.values(removed).reduce((sum, count) => sum + count, 0);

    console.log(`Seeded database "${mongoose.connection.name}".`);
    console.log(removedTotal > 0
        ? `Replaced previous demo data (${removedTotal} records). Non-demo data was not touched.`
        : "No previous demo data found.");
    console.log(
        `Created: ${created.users} users, ${created.pets} pets, ${created.foodProducts} food products, ` +
        `${created.ngos} NGOs (2 approved, 1 pending), ${created.fundraisers} fundraisers.`
    );
    console.log(`\nDemo logins (password for all: ${DEMO_PASSWORD})`);
    for (const account of DEMO_ACCOUNTS) {
        console.log(`  ${account.role.padEnd(5)}  ${account.email}`);
    }
} catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
