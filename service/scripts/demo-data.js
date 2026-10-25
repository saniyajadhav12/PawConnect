import User from "../service/models/user.js";
import Pet from "../service/models/pet.js";
import FoodProduct from "../service/models/food_product.js";
import NGO from "../service/models/ngo.js";
import Fundraiser from "../service/models/fundraiser.js";

// Shared password for every demo account (documented in the README)
export const DEMO_PASSWORD = "PawConnect123";

// Demo records are identified by these accounts: a record is demo data if a demo account created it
export const DEMO_ACCOUNTS = [
    { key: "user", name: "Demo User", email: "user@pawconnect.demo", role: "USER", address: "Boston, MA" },
    { key: "ngo", name: "Demo NGO", email: "ngo@pawconnect.demo", role: "NGO", address: "Cambridge, MA" },
    { key: "admin", name: "Demo Admin", email: "admin@pawconnect.demo", role: "ADMIN", address: "Boston, MA" },
];

const PETS = [
    { type: "Dog", breed: "Labrador Retriever", age: 3, size: "Large", disabilityStatus: false, healthConcerns: [], shelterLocation: "Boston Animal Shelter" },
    { type: "Dog", breed: "Beagle", age: 5, size: "Medium", disabilityStatus: false, healthConcerns: ["Seasonal allergies"], shelterLocation: "MSPCA-Angell, Jamaica Plain" },
    { type: "Dog", breed: "French Bulldog", age: 2, size: "Small", disabilityStatus: false, healthConcerns: ["Mild breathing issues"], shelterLocation: "Cambridge Pet Rescue" },
    { type: "Dog", breed: "German Shepherd", age: 7, size: "Large", disabilityStatus: true, healthConcerns: ["Missing front leg", "Hip dysplasia"], shelterLocation: "Boston Animal Shelter" },
    { type: "Cat", breed: "Siamese", age: 4, size: "Small", disabilityStatus: false, healthConcerns: [], shelterLocation: "Cambridge Pet Rescue" },
    { type: "Cat", breed: "Maine Coon", age: 6, size: "Large", disabilityStatus: false, healthConcerns: ["Dental care needed"], shelterLocation: "MSPCA-Angell, Jamaica Plain" },
    { type: "Cat", breed: "Domestic Shorthair", age: 1, size: "Small", disabilityStatus: true, healthConcerns: ["Deaf"], shelterLocation: "Somerville Animal Care" },
    { type: "Rabbit", breed: "Holland Lop", age: 2, size: "Small", disabilityStatus: false, healthConcerns: [], shelterLocation: "Somerville Animal Care" },
];

// Same names as the product cards on the Food Products page
const FOOD_PRODUCTS = [
    { name: "RawBlends Dog Food", brand: "RawBlends", price: 54.99, description: "Grain-free poultry kibble mixed with freeze-dried raw pieces for adult dogs.", nutritionDetails: "Protein 34%, Fat 18%, Fiber 4%, Moisture 10%" },
    { name: "Hills Cat Food", brand: "Hill's Science Diet", price: 42.99, description: "Vet-recommended dry food for adult cats with sensitive stomachs and skin.", nutritionDetails: "Protein 31%, Fat 18%, Fiber 2%, Moisture 8%" },
    { name: "3D Parrot Food", brand: "3D Pet Products", price: 19.99, description: "Seed, fruit and nut blend for parrots, fortified with vitamins and calcium.", nutritionDetails: "Protein 14%, Fat 10%, Fiber 18%, Moisture 12%" },
    { name: "Maxime Dog Food", brand: "Maxime", price: 39.99, description: "Prime dog diet for puppies, with DHA for brain development and probiotics for digestion.", nutritionDetails: "Protein 28%, Fat 17%, Fiber 3%, Moisture 10%" },
    { name: "NoIssue Pet Food", brand: "NoIssue", price: 12.99, description: "100% organic soft-baked dog treats, ideal for training and rewards.", nutritionDetails: "Protein 22%, Fat 9%, Fiber 2%, Moisture 25%" },
    { name: "Parakreet Dog Food", brand: "Parakreet", price: 14.99, description: "Natural seed and pellet blend for parakeets and budgies, with added vitamins.", nutritionDetails: "Protein 13%, Fat 5%, Fiber 8%, Moisture 12%" },
    { name: "Sheba Cat Food", brand: "Sheba", price: 18.99, description: "Perfect-portion wet pate trays with tuna and whitefish for adult cats.", nutritionDetails: "Protein 10%, Fat 5%, Fiber 1.5%, Moisture 82%" },
    { name: "Yum Yum Dog Food", brand: "Yum Yum", price: 29.99, description: "High-protein, high-energy dry food for active adult dogs.", nutritionDetails: "Protein 30%, Fat 20%, Fiber 3%, Moisture 10%" },
];

const NGOS = [
    {
        owner: "ngo", status: "approved",
        name: "Paws & Whiskers Rescue", registrationId: "MA-NGO-2021-0147",
        location: { latitude: 42.3736, longitude: -71.1097, address: "1 Brattle Square, Cambridge, MA" },
        contactInfo: "+16175550142",
        description: "Volunteer-run rescue that fosters and rehomes cats and dogs across Greater Boston.",
    },
    {
        owner: "user", status: "approved",
        name: "Boston Animal Haven", registrationId: "MA-NGO-2018-0062",
        location: { latitude: 42.3467, longitude: -71.0972, address: "350 Boylston Street, Boston, MA" },
        contactInfo: "+16175550188",
        description: "Shelter providing medical care, vaccinations and adoption for stray animals.",
    },
    {
        owner: "user", status: "pending",
        name: "Second Chance Shelter", registrationId: "MA-NGO-2024-0315",
        location: { latitude: 42.3876, longitude: -71.0995, address: "93 Highland Avenue, Somerville, MA" },
        contactInfo: "+16175550231",
        description: "New shelter focused on senior and special-needs pets. Awaiting admin approval.",
    },
];

const FUNDRAISERS = [
    { title: "Winter Shelter Fund", description: "Blankets, heating and warm beds for our foster animals this winter.", targetAmount: 5000, collectedAmount: 1850 },
    { title: "Senior Pet Medical Care", description: "Covers surgeries, dental work and medication for senior rescue pets.", targetAmount: 3000, collectedAmount: 720 },
];

// Removes previous demo data (only records owned by demo accounts) and inserts a fresh set.
// Requires an open mongoose connection. Safe to run repeatedly.
export const seedDemoData = async () => {
    const demoEmails = DEMO_ACCOUNTS.map((account) => account.email);
    const existingDemoUsers = await User.find({ email: { $in: demoEmails } }, "_id");
    const existingIds = existingDemoUsers.map((user) => user._id);

    const removed = {
        fundraisers: (await Fundraiser.deleteMany({ createdBy: { $in: existingIds } })).deletedCount,
        ngos: (await NGO.deleteMany({ createdBy: { $in: existingIds } })).deletedCount,
        foodProducts: (await FoodProduct.deleteMany({ createdBy: { $in: existingIds } })).deletedCount,
        pets: (await Pet.deleteMany({ createdBy: { $in: existingIds } })).deletedCount,
        users: (await User.deleteMany({ _id: { $in: existingIds } })).deletedCount,
    };

    // create() runs the save hook, so passwords are hashed
    const users = {};
    for (const { key, ...account } of DEMO_ACCOUNTS) {
        users[key] = await User.create({ ...account, password: DEMO_PASSWORD });
    }

    const pets = await Pet.insertMany(PETS.map((pet) => ({ ...pet, createdBy: users.user._id })));
    const foodProducts = await FoodProduct.insertMany(
        FOOD_PRODUCTS.map((product) => ({ ...product, createdBy: users.admin._id }))
    );
    const ngos = await NGO.insertMany(
        NGOS.map(({ owner, ...ngo }) => ({ ...ngo, createdBy: users[owner]._id }))
    );
    const ngoAccountNgo = ngos[0];
    const fundraisers = await Fundraiser.insertMany(
        FUNDRAISERS.map((fundraiser) => ({ ...fundraiser, ngo: ngoAccountNgo._id, createdBy: users.ngo._id }))
    );

    return {
        removed,
        created: {
            users: Object.keys(users).length,
            pets: pets.length,
            foodProducts: foodProducts.length,
            ngos: ngos.length,
            fundraisers: fundraisers.length,
        },
    };
};
