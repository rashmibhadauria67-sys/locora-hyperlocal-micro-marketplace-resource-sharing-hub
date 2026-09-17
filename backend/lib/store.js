const { join } = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const fs = require('fs');

const file = join(__dirname, '..', 'data', 'store.json');
fs.mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const adapter = new JSONFile(file);
const defaultData = { users: [], items: [], requests: [], reviews: [], notifications: [] };
const db = new Low(adapter, defaultData);

async function init() {
    await db.read();
    db.data = db.data || { users: [], items: [], requests: [], reviews: [], notifications: [] };
    if (!db.data.reviews) db.data.reviews = [];
    if (!db.data.notifications) db.data.notifications = [];
    await db.write();
}

async function getUsers() { await init(); return db.data.users }
async function getItems() { await init(); return db.data.items }
async function getRequests() { await init(); return db.data.requests }
async function getReviews(itemId) { await init(); return db.data.reviews.filter(r => String(r.itemId) === String(itemId)).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); }
async function getNotifications(userId) { await init(); return db.data.notifications.filter(n => String(n.userId) === String(userId)).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); }

async function addItem(item) { await init(); db.data.items.push(item); await db.write(); return item }
async function addRequest(r) { await init(); db.data.requests.push(r); await db.write(); return r }
async function addReview(r) { await init(); db.data.reviews.push(r); await db.write(); return r }
async function addNotification(n) { await init(); db.data.notifications.push(n); await db.write(); return n }
async function markNotificationRead(id) { await init(); const idx = db.data.notifications.findIndex(n => String(n.id) === String(id) || String(n._id) === String(id)); if (idx === -1) return null; db.data.notifications[idx].read = true; await db.write(); return db.data.notifications[idx]; }
async function findUserByEmail(email) { const users = await getUsers(); return users.find(u => u.email === email) }
async function findUserById(id) { const users = await getUsers(); return users.find(u => String(u.id) === String(id)) }
async function updateUser(id, patch) { await init(); const idx = db.data.users.findIndex(u => String(u.id) === String(id)); if (idx === -1) return null; db.data.users[idx] = { ...db.data.users[idx], ...patch }; await db.write(); return db.data.users[idx]; }

async function addRefreshTokenToUser(id, token) { await init(); const user = await findUserById(id); if (!user) return null; user.refreshTokens = user.refreshTokens || []; user.refreshTokens.push(token); await db.write(); return user }

async function removeRefreshTokenFromUser(id, token) { await init(); const user = await findUserById(id); if (!user) return null; user.refreshTokens = (user.refreshTokens || []).filter(t => t !== token); await db.write(); return user }

async function addUser(u) { await init(); if (!u.id) u.id = Date.now().toString(); db.data.users.push(u); await db.write(); return u }

module.exports = { init, getUsers, getItems, getRequests, getReviews, getNotifications, addUser, addItem, addRequest, addReview, addNotification, markNotificationRead, findUserByEmail, findUserById, updateUser, addRefreshTokenToUser, removeRefreshTokenFromUser };
