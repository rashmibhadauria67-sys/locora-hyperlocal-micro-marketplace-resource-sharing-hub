require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');
const store = require('../lib/store');

async function seedWithMongo(uri) {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');
    await User.deleteMany({});
    await Item.deleteMany({});
    await Request.deleteMany({});

    const hashed = await bcrypt.hash('password123', 10);
    const user = await User.create({ name: 'Demo User', email: 'demo@locora.local', password: hashed });

    await Item.create({ title: 'Demo Drill', description: 'Cordless drill for borrowing', type: 'Borrow', owner: user._id });
    await Item.create({ title: 'Demo Pickles', description: 'Homemade pickles', type: 'Order', owner: user._id });

    await Request.create({ title: 'Need Pressure Cooker', description: 'For weekend', requester: user._id });

    console.log('MongoDB seed completed');
    process.exit(0);
}

async function seedWithStore() {
    await store.init();
    // clear
    // overwrite store file
    const users = [];
    const hashed = await bcrypt.hash('password123', 10);
    users.push({ id: '1', name: 'Demo User', email: 'demo@locora.local', password: hashed, refreshTokens: [], createdAt: new Date() });
    await store.addUser(users[0]);
    await store.addItem({ id: 'i1', title: 'Demo Drill', description: 'Cordless drill for borrowing', type: 'Borrow', createdAt: new Date() });
    await store.addItem({ id: 'i2', title: 'Demo Pickles', description: 'Homemade pickles', type: 'Order', createdAt: new Date() });
    await store.addRequest({ id: 'r1', title: 'Need Pressure Cooker', description: 'For weekend', createdAt: new Date() });
    console.log('File-based store seed completed');
    process.exit(0);
}

async function run() {
    const uri = process.env.MONGO_URI;
    if (uri && !uri.includes('<')) {
        await seedWithMongo(uri);
    } else {
        await seedWithStore();
    }
}

run().catch(err => { console.error(err); process.exit(1) });
