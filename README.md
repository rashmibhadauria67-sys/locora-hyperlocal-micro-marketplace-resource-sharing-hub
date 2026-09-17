Locora

Full-stack scaffold: React + Tailwind frontend and Node/Express + MongoDB backend.

Quick start

1. Backend

```bash
cd backend
npm install
# create a .env file and set MONGO_URI and JWT_SECRET
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
# create a .env.local file and set VITE_API_URL if using a remote backend
npm run dev
```

Local environment files

- `backend/.env`: backend secrets and database URL
- `backend/.env.local`: local development fallback for backend
- `frontend/.env.local`: frontend API URL for local development

Deployment

- Frontend: deploy `/frontend` to Vercel. Set `VITE_API_URL` to your backend URL.
- Backend: deploy `/backend` to Render. Set `MONGO_URI` and `JWT_SECRET` on Render.

Assets

The current frontend branding asset is available at `frontend/public/logo.svg`.
