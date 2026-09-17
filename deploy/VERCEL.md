Deploying frontend to Vercel

1. Push your repo to GitHub (or connect Vercel to your Git provider).
2. In Vercel, import project and select `frontend` folder as project root.
3. Build command: `npm run build` (Vite), Output directory: `dist`.
4. Add Environment Variable: `VITE_API_URL` -> `https://api.YOUR_DOMAIN/api` (replace YOUR_DOMAIN).
5. Add custom domain (e.g. `assessments.shnoor.com`) in Vercel dashboard and follow DNS instructions (CNAME).

SSL is automatic. After deployment, the frontend will be served from the custom domain.
