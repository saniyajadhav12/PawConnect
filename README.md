# PawConnect

PawConnect is a full-stack pet adoption and care platform. Users can browse adoptable pets, find nearby vets, groomers, pet therapy and animal NGOs on a map, explore pet food, generate a diet plan for their pet, and support animal NGOs through fundraisers. NGOs can register on the platform and an admin approves them.

Built with a React + TypeScript frontend and a Node.js/Express + MongoDB REST API secured with JWT authentication and role-based access control.

📄 [Project presentation (PDF)](PawConnect.pdf)

## Features

- **Accounts and authentication**: sign up, log in and log out. JWT-based sessions; view, update or delete your own profile.
- **Role-based access control**: `USER`, `NGO` and `ADMIN` roles enforced on the API, plus ownership checks (only a pet's or fundraiser's creator, or an admin, can change it).
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
│   ├── service/
│   │   ├── app.js            # Middleware, database connection, routes
│   │   ├── routers/          # Route definitions and access rules
│   │   ├── controllers/      # Request handling
│   │   ├── services/         # Database access
│   │   ├── models/           # Mongoose schemas
│   │   └── middleware/       # JWT authentication and role checks
│   ├── docs/
│   │   ├── openapi/          # OpenAPI specs, one per area
│   │   └── bruno/            # Bruno API collection
│   └── .env.example
└── PawConnect.pdf            # Project presentation
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or newer (developed with Node 22)
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

### Google Maps

The Vet, Pet Salon, Pet Therapy and NGOs Near Me pages need a Google Maps API key with these APIs enabled in Google Cloud:

- **Maps JavaScript API**
- **Places API (New)**

Put the key in `app/.env` as `VITE_GOOGLE_MAPS_API_KEY` and restart `npm run dev`. Without a key, those pages show a "Map unavailable" message and the rest of the app works normally. Because the key is used in the browser, restrict it to your site's domain (HTTP referrer restriction) in Google Cloud.

### Admin and NGO accounts

Every account signs up with the `USER` role; the API ignores any role sent by a client. To try the admin dashboard or create fundraisers, promote an account in MongoDB:

```bash
mongosh "mongodb://localhost:27017/pawconnect" --eval \
  'db.users.updateOne({ email: "you@example.com" }, { $set: { role: "ADMIN" } })'
```

Use `"NGO"` instead of `"ADMIN"` for an NGO account. The new role applies to the next request; no need to log in again.

## API overview

Base URL: `http://localhost:3002`. Protected endpoints expect `Authorization: Bearer <token>`, using the token returned by `POST /user/login`.

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

PawConnect was built as a team project by **Web Architects** at Northeastern University.

### My contributions

TODO: Saniya to fill in.
