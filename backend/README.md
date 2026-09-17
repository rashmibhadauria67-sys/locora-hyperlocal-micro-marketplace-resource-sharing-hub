Locora - Backend

Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in development:

```bash
npm run dev
```

API Endpoints

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/items`
- POST `/api/items`
- GET `/api/requests`
- POST `/api/requests`

Seeding (demo data)

Run a seed script to populate a demo user, items and requests. If you have set `MONGO_URI` in `.env`, the script will seed MongoDB; otherwise it will seed the file-based store:

```bash
npm run seed
```

