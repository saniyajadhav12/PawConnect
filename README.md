# PawConnect

[![CI](https://github.com/saniyajadhav12/PawConnect/actions/workflows/ci.yml/badge.svg)](https://github.com/saniyajadhav12/PawConnect/actions/workflows/ci.yml)

PawConnect is a full-stack pet adoption and care platform. Users can browse adoptable pets, find nearby vets, groomers, pet therapy and animal NGOs on a map, explore pet food, generate a diet plan for their pet, and support animal NGOs through fundraisers. NGOs can register on the platform and an admin approves them.

Built with a React + TypeScript frontend and a Node.js/Express + MongoDB REST API secured with JWT authentication and role-based access control.

📄 [Project presentation (PDF)](PawConnect.pdf)

## Screenshots

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/home.jpg" alt="Home page"><br><sub>Home page</sub></td>
    <td align="center"><img src="docs/screenshots/pet-adoption.jpg" alt="Pet adoption page with filters and pet cards"><br><sub>Pet adoption with filters</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/food-products.jpg" alt="Food products catalog"><br><sub>Food products catalog</sub></td>
    <td align="center"><img src="docs/screenshots/diet-generator.jpg" alt="Generated diet plan"><br><sub>Diet generator result</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/pet-salons-map.jpg" alt="Pet salons near you on Google Maps"><br><sub>Pet salons near you (Google Maps; image from the project presentation)</sub></td>
    <td align="center"><img src="docs/screenshots/admin-dashboard.jpg" alt="Admin dashboard with a pending NGO"><br><sub>Admin dashboard: approve or reject NGOs</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/login.jpg" alt="Login page"><br><sub>Login</sub></td>
    <td></td>
  </tr>
</table>

Screenshots use the [demo data](#demo-accounts) from `npm run seed`.

## Features

- **Accounts and authentication**: sign up, log in and log out. JWT-based sessions; view, update or delete your own profile.
- **Role-based access control**: `USER`, `NGO` and `ADMIN` roles enforced on the API, plus ownership checks (only a pet's or fundraiser's creator, or an admin, can change it).
- **API hardening**: request validation with clear error messages, whitelisted fields on every create and update (clients can't set roles, owners or approval status), rate-limited login and signup, security headers (helmet), a request size limit and configurable CORS.
- **Pet adoption**: browse pets and filter by type, breed, size and age. Logged-in users can list a pet for adoption.
- **Nearby pet services**: find veterinarians, pet salons, pet therapy and animal NGOs near you on Google Maps, with one-click directions (Places API (New) text search around your location).
- **NGO management**: register an NGO; admins approve or reject pending NGOs from the admin dashboard.
- **Fundraisers**: browse fundraisers; NGO and admin accounts can start a fundraiser for an approved NGO.
- **Pet food catalog**: browse food products, sort by price and open a product's details page.
- **Diet generator**: step-by-step form that suggests a meal plan and care tips for your pet.
- **Pet care tips**: guides on hygiene, food, exercise and safety.
- **English and French**: switch the interface language from the header.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Material UI, Redux Toolkit, React Router, i18next, Axios |
| Maps | Google Maps JavaScript API, Places API (New), `@react-google-maps/api` |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (`jsonwebtoken`), password hashing with `bcrypt` |
| API docs | OpenAPI 3 specs, Bruno collection |
| Testing and CI | Jest, Supertest, mongodb-memory-server, GitHub Actions |

## Project structure

```text
PawConnect/
├── app/                      # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/       # Header, Sidebar, NearbyPlacesMap and other shared components
│   │   ├── config/           # API client (base URL, JWT header, 401 handling) and session helpers
│   │   ├── pages/            # One component per route
│   │   ├── redux/            # Redux Toolkit store and slices
│   │   ├── locales/          # English and French translations
│   │   ├── styles/           # Page stylesheets
│   │   └── images/
│   └── .env.example
├── service/                  # Backend (Node.js + Express + MongoDB)
│   ├── server.js             # Entry point: loads env vars, starts the server
│   ├── scripts/              # npm run seed: demo accounts and data
│   ├── service/
│   │   ├── app.js            # Middleware, database connection, routes
│   │   ├── routers/          # Route definitions and access rules
│   │   ├── controllers/      # Request handling
│   │   ├── services/         # Database access
│   │   ├── models/           # Mongoose schemas
│   │   └── middleware/       # JWT authentication and role checks
│   ├── tests/                # API tests (Jest + Supertest, in-memory MongoDB)
│   ├── docs/
│   │   ├── openapi/          # OpenAPI specs, one per area
│   │   └── bruno/            # Bruno API collection
│   └── .env.example
├── docs/screenshots/         # Screenshots used in this README
├── .github/workflows/ci.yml  # CI: backend tests and frontend build
└── PawConnect.pdf            # Project presentation
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or newer (developed and tested with Node 22)
- [MongoDB](https://www.mongodb.com/try/download/community), running locally or a MongoDB Atlas connection string
- Optional: a Google Maps API key for the map pages (see [Google Maps](#google-maps))

### 1. Clone and install

```bash
git clone <repository-url>
cd PawConnect

cd service && npm install
cd ../app && npm install
```

### 2. Configure environment variables

Each app has a `.env.example`. Copy it to `.env` and fill in the values. The `.env` files are git-ignored.

```bash
cp service/.env.example service/.env
cp app/.env.example app/.env
```

**Backend** (`service/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_CONNECTION` | Yes | MongoDB connection string, e.g. `mongodb://localhost:27017/pawconnect` |
| `JWT_SECRET` | Yes | Secret used to sign login tokens. Use a long random string, e.g. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `PORT` | No | API port (default `3002`) |
| `CORS_ORIGIN` | For deployment | Comma-separated frontend origins allowed to call the API, e.g. `https://pawconnect.example.com`. If unset, all origins are allowed in development and none when `NODE_ENV=production`. |
| `TRUST_PROXY` | For deployment | Set to `true` behind a hosting proxy or load balancer, so rate limiting sees each client's real IP instead of the proxy's |
| `NODE_ENV` | For deployment | Set to `production` when deployed (affects the CORS default above, and `npm run seed` refuses to run) |

The server refuses to start, with a clear error, if `MONGO_CONNECTION` or `JWT_SECRET` is missing.

**Frontend** (`app/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | No | Backend URL (default `http://localhost:3002`) |
| `VITE_GOOGLE_MAPS_API_KEY` | No | Google Maps key for the map pages. Leave empty to run without maps. |

### 3. Run the backend

```bash
cd service
npm start        # or: npm run dev  (restarts on file changes)
```

The API runs on <http://localhost:3002>.

### 4. Run the frontend

In a second terminal:

```bash
cd app
npm run dev
```

Open the URL Vite prints (by default <http://localhost:5173>), sign up, and you're logged in.

To create a production build, run `npm run build` (output in `app/dist/`) and `npm run preview` to serve it locally.

### Demo accounts

To try every feature right away, load the demo data into the database configured in `service/.env`:

```bash
cd service
npm run seed
```

This creates three accounts, 8 adoptable pets, the 8 food products from the catalog, 3 NGOs (two approved, one pending for the admin to review) and 2 fundraisers. All accounts use the password `PawConnect123`:

| Role | Email | Try |
| --- | --- | --- |
| USER | `user@pawconnect.demo` | Browse and list pets, edit your profile, register an NGO |
| NGO | `ngo@pawconnect.demo` | Create and manage fundraisers for *Paws & Whiskers Rescue* |
| ADMIN | `admin@pawconnect.demo` | Approve or reject *Second Chance Shelter* on the admin dashboard (sidebar → Admin Dashboard) |

Running `npm run seed` again resets the demo data: it replaces only the records owned by the `@pawconnect.demo` accounts and never touches other data.

> **Note:** the demo accounts, including an admin, share a published password. Don't seed a public deployment unless you want visitors to have these accounts. `npm run seed` refuses to run when `NODE_ENV=production` unless `ALLOW_DEMO_SEED=true` is set.

### Google Maps

The Vet, Pet Salon, Pet Therapy and NGOs Near Me pages need a Google Maps API key with these APIs enabled in Google Cloud:

- **Maps JavaScript API**
- **Places API (New)**

Put the key in `app/.env` as `VITE_GOOGLE_MAPS_API_KEY` and restart `npm run dev`. Without a key, those pages show a "Map unavailable" message and the rest of the app works normally. Because the key is used in the browser, restrict it to your site's domain (HTTP referrer restriction) in Google Cloud.

### Admin and NGO accounts

Every account signs up with the `USER` role; the API ignores any role sent by a client. The [demo accounts](#demo-accounts) already include an NGO and an admin. To make one of your own accounts an admin or NGO, promote it in MongoDB:

```bash
mongosh "mongodb://localhost:27017/pawconnect" --eval \
  'db.users.updateOne({ email: "you@example.com" }, { $set: { role: "ADMIN" } })'
```

Use `"NGO"` instead of `"ADMIN"` for an NGO account. The API applies the new role immediately; log out and back in so the app's pages and menus pick it up too.

## Testing

The backend has an API test suite built with Jest and Supertest. It covers login and JWT issuing, the uniform 401 for bad credentials, protected routes with and without a token, users not being able to delete each other's accounts, rate limiting, request validation, protected fields on updates, security headers, CORS, and the demo seed script.

```bash
cd service
npm test
```

The tests run against an in-memory MongoDB ([mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server)), so they never touch your database and need no `.env`. The first run downloads a MongoDB binary, which is cached afterwards.

[GitHub Actions](.github/workflows/ci.yml) runs the backend tests and the frontend production build (`npm run build`) on every push and pull request.

## API overview

Base URL: `http://localhost:3002`. Protected endpoints expect `Authorization: Bearer <token>`, using the token returned by `POST /user/login`.

Request bodies are validated: invalid data returns `400` with a `message` and a per-field `errors` list, and fields a route doesn't accept are ignored. `POST /user/login` allows 10 failed attempts and `POST /user` 10 signups per 15 minutes per IP; after that the API returns `429`.

| Area | Endpoints | Access |
| --- | --- | --- |
| Users | `POST /user`, `POST /user/login` | Public |
| | `GET /user/profile` | Logged in |
| | `GET`, `PUT`, `DELETE /user/:userId` | The user themselves or ADMIN |
| Pets | `GET /pets`, `GET /pets/:petId` | Public |
| | `POST /pets` | Logged in |
| | `PUT`, `DELETE /pets/:petId` | Pet's creator or ADMIN |
| Food products | `GET /foodProduct`, `GET /foodProduct/:id` | Public |
| | `POST /foodProduct` | ADMIN |
| NGOs | `GET /ngos?status=pending\|approved\|rejected` | Public |
| | `POST /ngos` | Logged in (new NGOs start as `pending`) |
| | `PATCH /ngos/:id/status` | ADMIN |
| Fundraisers | `GET /api/fundraisers` | Public |
| | `POST /api/fundraisers` | NGO or ADMIN, for an approved NGO |
| | `PATCH`, `DELETE /api/fundraisers/:id` | Fundraiser's creator or ADMIN |

Full request and response details:

- **OpenAPI specs**: [`service/docs/openapi/`](service/docs/openapi/): [users](service/docs/openapi/user_management_api.yml), [pets](service/docs/openapi/pet_management_api.yml), [food products](service/docs/openapi/food_product_api.yml), [NGOs](service/docs/openapi/ngo_management_api.yml), [fundraisers](service/docs/openapi/fundraiser_api.yml)
- **Bruno collection**: open [`service/docs/bruno/PawConnect API`](service/docs/bruno/PawConnect%20API) in [Bruno](https://www.usebruno.com/) and select the `Local` environment. The Login request saves the token for the other requests.

## Team project

PawConnect started as a team project by **Web Architects** at Northeastern University: Aditi Bailur, Saniya Jadhav, Pratham Rathod and Yashika Lodh.

### My contributions

**During the team project**

- **Sign-up and login**: the sign-up and login pages and their connection to the user API.
- **Pet Salons Near You**: the page that finds nearby pet salons on Google Maps, with directions.
- **NGO management**: the page where NGOs register and approved NGOs are listed.

**After the course**, I continued developing this repository on my own:

- **Security**: JWT authentication, role-based access control (`USER`, `NGO`, `ADMIN`) with ownership checks, password hashing on every update, and no password hashes or stack traces in API responses.
- **End-to-end fixes**: made the NGO approval workflow, profile management, product details and signup-to-login flows work end to end.
- **Refactoring**: replaced four near-duplicate map pages (~880 lines) with one shared component and migrated to Google Places API (New).
- **Frontend**: a shared API client with token handling and logout, and fixed all 19 TypeScript build errors.
- **Quality**: backend API tests (Jest, Supertest, in-memory MongoDB), GitHub Actions CI, updated OpenAPI specs and Bruno collection, and 0 known dependency vulnerabilities.
