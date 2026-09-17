const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Provide safe defaults for JWT secrets in local/dev environment
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'locora_dev_jwt_secret'
    console.warn('Warning: JWT_SECRET not set; using development fallback')
}
if (!process.env.REFRESH_TOKEN_SECRET) {
    process.env.REFRESH_TOKEN_SECRET = process.env.JWT_SECRET
}

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const requestsRoutes = require('./routes/requests');
const postRoutes = require('./routes/post');
const matchRoutes = require('./routes/match');
const shareRoutes = require('./routes/share');
const reviewsRoutes = require('./routes/reviews');
const notificationsRoutes = require('./routes/notifications');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/post', postRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);

const PORT = process.env.PORT || 5100;

async function start() {
    try {
        let useMongo = false;
        let mongoUri = process.env.MONGO_URI;
        if (mongoUri && !mongoUri.includes('<')) {
            useMongo = true;
        }

        if (useMongo) {
            await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Connected to MongoDB');
        } else {
            console.log('No valid MONGO_URI provided — running with file-based store');
        }

        let port = Number(process.env.PORT) || PORT;
        const maxAttempts = 100;
        let attempts = 0;
        const startServer = () => {
            const server = app.listen(port, () => console.log(`Server running on port ${port}`));
            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
                    attempts++;
                    port = port + 1;
                    console.warn(`Port in use, trying port ${port}`);
                    setTimeout(startServer, 200);
                } else {
                    console.error('Failed to start server:', err);
                    process.exit(1);
                }
            });
        };
        startServer();
    } catch (err) {
        console.error('Startup error:', err);
        process.exit(1);
    }
}

start();
