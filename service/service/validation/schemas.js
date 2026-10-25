import { z } from "zod";

// Request body schemas. Unknown fields are stripped, so each schema is also the list of
// fields a route accepts.

const requiredText = (label, max = 200) =>
    z.string({ error: `${label} is required` })
        .trim()
        .min(1, `${label} is required`)
        .max(max, `${label} must be at most ${max} characters`);

const optionalText = (label, max = 200) =>
    z.string({ error: `${label} must be text` })
        .trim()
        .max(max, `${label} must be at most ${max} characters`)
        .optional();

const number = (label) => z.number({ error: `${label} must be a number` });

const objectId = (label) =>
    z.string({ error: `${label} is required` }).regex(/^[0-9a-fA-F]{24}$/, `${label} must be a valid id`);

const atLeastOneField = (data) => Object.keys(data).length > 0;
const atLeastOneFieldMessage = { error: "Provide at least one field to update" };

// --- Users

const email = z.email({ error: "Email must be a valid email address" });
const password = z.string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be at most 72 characters"); // bcrypt only uses the first 72 bytes

export const signupSchema = z.object({
    name: requiredText("Name", 100),
    email,
    password,
    address: optionalText("Address"),
});

export const loginSchema = z.object({
    email: z.string({ error: "Email is required" }).trim().min(1, "Email is required"),
    password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

export const userUpdateSchema = signupSchema.partial().refine(atLeastOneField, atLeastOneFieldMessage);

// --- Pets

const petFields = z.object({
    type: requiredText("Type", 50),
    breed: requiredText("Breed", 100),
    age: number("Age").int("Age must be a whole number").min(0, "Age cannot be negative").max(40, "Age must be at most 40"),
    size: requiredText("Size", 50),
    disabilityStatus: z.boolean({ error: "Disability status must be true or false" }),
    healthConcerns: z.array(z.string().trim().max(100, "Each health concern must be at most 100 characters"), { error: "Health concerns must be a list" })
        .max(20, "At most 20 health concerns")
        .transform((concerns) => concerns.filter(Boolean))
        .optional(),
    shelterLocation: requiredText("Shelter location"),
});

export const petSchema = petFields;
export const petUpdateSchema = petFields.partial().refine(atLeastOneField, atLeastOneFieldMessage);

// --- NGOs

export const ngoSchema = z.object({
    name: requiredText("Name", 150),
    registrationId: requiredText("Registration ID", 100),
    location: z.object({
        latitude: number("Latitude").min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
        longitude: number("Longitude").min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
        address: requiredText("Address"),
    }, { error: "Location is required" }),
    contactInfo: requiredText("Contact info", 100),
    description: requiredText("Description", 2000),
});

export const ngoStatusSchema = z.object({
    status: z.enum(["approved", "rejected"], { error: 'Status must be "approved" or "rejected"' }),
});

// --- Fundraisers

const fundraiserFields = {
    title: requiredText("Title", 150),
    description: requiredText("Description", 2000),
    targetAmount: number("Target amount").positive("Target amount must be greater than 0"),
    collectedAmount: number("Collected amount").min(0, "Collected amount cannot be negative"),
};

export const fundraiserSchema = z.object({
    ...fundraiserFields,
    collectedAmount: fundraiserFields.collectedAmount.optional(),
    ngo: objectId("NGO"),
});

// The NGO and creator of an existing fundraiser can't be changed
export const fundraiserUpdateSchema = z.object(fundraiserFields).partial().refine(atLeastOneField, atLeastOneFieldMessage);

// --- Food products

export const foodProductSchema = z.object({
    name: requiredText("Name", 150),
    brand: requiredText("Brand", 100),
    price: number("Price").positive("Price must be greater than 0"),
    description: optionalText("Description", 2000),
    nutritionDetails: requiredText("Nutrition details", 500),
});
