import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const sample = [
    { title: 'Need a Pressure Cooker', desc: 'Urgent for weekend', contact: 'eve@example.com' },
    { title: 'Looking for a Study Lamp', desc: 'LED lamp preferred', contact: 'frank@example.com' },
    { title: 'Help with Plumber', desc: 'Looking for recommendations', contact: 'grace@example.com' }
]

export default function CommunityRequests() {
    const [reqs, setReqs] = useState([])
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [location, setLocation] = useState('')
    const [contact, setContact] = useState('')
    const [message, setMessage] = useState(null)
    const [posting, setPosting] = useState(false)
    useEffect(() => {
        api.getRequests().then(data => {
            if (data) setReqs(data)
            else setReqs(sample)
        }).catch(() => setReqs(sample))
    }, [])

    async function submit(e) {
        e.preventDefault()
        if (!title.trim()) { setMessage('Please enter a title'); return }
        setPosting(true)
        const res = await api.postRequest({ title, description: desc, location, contact })
        if (res) { setMessage('Request posted'); setReqs(prev => [res, ...prev]); setTitle(''); setDesc(''); setLocation(''); setContact('') }
        else setMessage('Failed to post request')
        setPosting(false)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Community Requests</h2>
            <div className="space-y-4">
                {reqs.length === 0 && <div className="text-gray-600">No requests yet. Create one below.</div>}
                {reqs.map((r, i) => (
                    <div key={i} className="bg-white rounded shadow p-4 flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">📢</div>
                            <div>
                                <h3 className="font-semibold">{r.title || r}</h3>
                                <p className="text-sm text-gray-600">{r.description || r.desc}</p>
                            </div>
                        </div>
                        <div>
                            <button className="px-3 py-1 bg-indigo-600 text-white rounded">Offer Help</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 max-w-md">
                <h3 className="font-semibold mb-2">Create a Request</h3>
                {message && <div className="mb-2">{message}</div>}
                <form onSubmit={submit} className="space-y-2 bg-white p-4 rounded shadow">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded" />
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 rounded" />
                    <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="w-full border px-3 py-2 rounded" />
                    <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact" className="w-full border px-3 py-2 rounded" />
                    <div className="text-right">
                        <button disabled={posting} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">{posting ? 'Posting...' : 'Post Request'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
