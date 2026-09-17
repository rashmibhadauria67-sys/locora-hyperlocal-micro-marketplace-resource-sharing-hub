const TOKEN_KEY = 'locora_token'
const REFRESH_KEY = 'locora_refresh'

export function saveToken(token) { localStorage.setItem(TOKEN_KEY, token) }
export function getToken() { return localStorage.getItem(TOKEN_KEY) }
export function removeToken() { localStorage.removeItem(TOKEN_KEY) }

export function saveRefresh(token) { localStorage.setItem(REFRESH_KEY, token) }
export function getRefresh() { return localStorage.getItem(REFRESH_KEY) }
export function removeRefresh() { localStorage.removeItem(REFRESH_KEY) }

export function authHeader() { const t = getToken(); return t ? { Authorization: `Bearer ${t}` } : {} }
