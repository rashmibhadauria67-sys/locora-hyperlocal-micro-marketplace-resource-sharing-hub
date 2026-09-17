Deploying backend to Render

1. Create a new Web Service on Render and connect your Git repo.
2. Set the service root to the `backend` folder.
3. Start Command: `npm start` (or `node server.js`).
4. Environment variables (set in Render dashboard):
   - `MONGO_URI` (MongoDB connection string)
   - `JWT_SECRET` (random secret)
   - `REFRESH_TOKEN_SECRET` (random secret)
   - Optionally `ACCESS_TOKEN_EXPIRES`, `REFRESH_TOKEN_EXPIRES`
5. Add a custom domain (e.g. `api.YOUR_DOMAIN`) and follow Render's DNS instructions.

Render will assign a target CNAME; create a DNS record pointing your domain's subdomain to that CNAME.
