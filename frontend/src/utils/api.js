import { getToken, getRefresh, saveToken, saveRefresh, removeToken, removeRefresh } from './auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function parseJson(res) {
    try {
        const data = await res.json()
        return res.ok ? data : null
    } catch (e) {
        return null
    }
}

async function refreshAccessToken() {
    const refresh = getRefresh()
    if (!refresh) return false
    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refresh })
        })
        if (!res.ok) {
            removeToken(); removeRefresh();
            return false
        }
        const data = await res.json()
        if (data.token) saveToken(data.token)
        if (data.refreshToken) saveRefresh(data.refreshToken)
        return true
    } catch (err) {
        return false
    }
}

async function fetchWithAuth(url, opts = {}) {
    opts.headers = opts.headers || {}
    if (getToken()) opts.headers.Authorization = `Bearer ${getToken()}`

    let res = await fetch(url, opts)
    if (res.status === 401) {
        const ok = await refreshAccessToken()
        if (!ok) return res
        // retry with new token
        opts.headers.Authorization = `Bearer ${getToken()}`
        res = await fetch(url, opts)
    }
    return res
}

export default {
    async getItems() {
        const res = await fetch(`${API_BASE}/items`)
        return parseJson(res)
    },
    async postItem(item) {
        const res = await fetchWithAuth(`${API_BASE}/post`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, kind: 'offer' })
        })
        return parseJson(res)
    },
    async getRequests() {
        const res = await fetch(`${API_BASE}/requests`)
        return parseJson(res)
    },
    async postRequest(req) {
        const res = await fetchWithAuth(`${API_BASE}/post`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...req, kind: 'request' })
        })
        return parseJson(res)
    },
    async getMatches() {
        const res = await fetch(`${API_BASE}/match/demo`)
        return parseJson(res)
    },
    async shareMatch(payload) {
        const res = await fetchWithAuth(`${API_BASE}/share`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        return parseJson(res)
    },
    async getReviews(itemId) {
        const res = await fetch(`${API_BASE}/reviews/${itemId}`)
        return parseJson(res)
    },
    async addReview(itemId, payload) {
        const res = await fetchWithAuth(`${API_BASE}/reviews/${itemId}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        return parseJson(res)
    },
    async getNotifications() {
        const res = await fetchWithAuth(`${API_BASE}/notifications`)
        return parseJson(res)
    },
    async createNotification(payload) {
        const res = await fetchWithAuth(`${API_BASE}/notifications`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        return parseJson(res)
    },
    async markNotificationRead(id) {
        const res = await fetchWithAuth(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' })
        return parseJson(res)
    },
    // exported helpers for pages
    fetchWithAuth,
    refreshAccessToken
}
