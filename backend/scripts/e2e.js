require('dotenv').config()
const fetch = global.fetch || require('node-fetch')

const API = (process.env.API_URL) ? process.env.API_URL : `http://localhost:5107/api`

async function main() {
    console.log('Using API:', API)
    const email = `e2e+${Date.now()}@locora.local`
    const password = 'password123'
    // signup
    let res = await fetch(`${API}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'E2E Tester', email, password }) })
    const signup = await res.json().catch(() => null)
    if (!res.ok) { console.error('Signup failed', signup); process.exit(1) }
    console.log('Signup OK')

    // login
    res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const login = await res.json().catch(() => null)
    if (!res.ok || !login.token) { console.error('Login failed', login); process.exit(1) }
    console.log('Login OK')
    const token = login.token

    // post item
    res = await fetch(`${API}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: 'E2E Drill', description: 'Test drill', type: 'Borrow' }) })
    const item = await res.json().catch(() => null)
    if (!res.ok) { console.error('Post item failed', item); process.exit(1) }
    console.log('Post item OK')

    // post request
    res = await fetch(`${API}/requests`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: 'E2E Need Cooker', description: 'For tests' }) })
    const req = await res.json().catch(() => null)
    if (!res.ok) { console.error('Post request failed', req); process.exit(1) }
    console.log('Post request OK')

    // get items
    res = await fetch(`${API}/items`)
    const items = await res.json().catch(() => null)
    if (!res.ok || !Array.isArray(items)) { console.error('Get items failed', items); process.exit(1) }
    const foundItem = items.find(i => i.title && i.title.includes('E2E Drill'))
    if (!foundItem) { console.error('Created item not found in items list'); process.exit(1) }
    console.log('Item visible in list')

    // get requests
    res = await fetch(`${API}/requests`)
    const reqs = await res.json().catch(() => null)
    if (!res.ok || !Array.isArray(reqs)) { console.error('Get requests failed', reqs); process.exit(1) }
    const foundReq = reqs.find(r => r.title && r.title.includes('E2E Need Cooker'))
    if (!foundReq) { console.error('Created request not found'); process.exit(1) }
    console.log('Request visible in list')

    console.log('E2E flow completed successfully')
    process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
