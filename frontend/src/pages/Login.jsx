import React, { useEffect, useState } from 'react'
import { saveToken, saveRefresh, getToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    useEffect(() => {
        if (getToken()) nav('/')
    }, [nav])

    async function submit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
            })
            const data = await res.json().catch(() => null)
            if (!res.ok) {
                setError(data?.message || 'Login failed')
                return
            }
            saveToken(data.token)
            if (data.refreshToken) saveRefresh(data.refreshToken)
            nav('/')
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <form onSubmit={submit} className="space-y-3">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border px-3 py-2 rounded" />
                <div className="flex justify-end">
                    <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    )
}
