import React, { useState } from 'react'
import api from '../utils/api'


const options = [
    { title: 'Lend a Tool', type: 'Borrow', img: '/logo.svg' },
    { title: 'Share a Book', type: 'Offer', img: '/logo.svg' },
    { title: 'Homemade Food', type: 'Order', img: '/logo.svg' },
    { title: 'Rent Appliance', type: 'Rent', img: '/logo.svg' }
]

export default function OfferItem() {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [location, setLocation] = useState('')
    const [contact, setContact] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [message, setMessage] = useState(null)
    const [type, setType] = useState('Offer')
    const [posting, setPosting] = useState(false)

    async function submit(e) {
        e.preventDefault()
        if (!title.trim()) { setMessage('Please enter a title'); return }
        setPosting(true)
        const res = await api.postItem({ title, description: desc, type, location, contact, image, category })
        if (res) { setMessage('Item posted'); setTitle(''); setDesc(''); setLocation(''); setContact(''); setImage(''); setCategory('') }
        else setMessage('Failed to post item')
        setPosting(false)
    }
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Offer an Item</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {options.map((op, i) => (
                    <button key={i} onClick={() => setType(op.type)} className={`rounded-lg p-4 flex flex-col items-center border transform hover:-translate-y-1 transition ${type === op.type ? 'ring-2 ring-emerald-400' : ''} ${op.type === 'Borrow' ? 'bg-green-50' : op.type === 'Offer' ? 'bg-blue-50' : op.type === 'Order' ? 'bg-orange-50' : 'bg-yellow-50'}`}>
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow">{op.img ? <img src={op.img} alt="" className="w-12 h-12" /> : '📦'}</div>
                        <h3 className="font-semibold text-sm">{op.title}</h3>
                        <span className="text-xs text-gray-500 mt-1">{op.type}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 max-w-md">
                <h3 className="font-semibold mb-2">Create an Offer</h3>
                {message && <div className="mb-2">{message}</div>}
                <form onSubmit={submit} className="space-y-2 bg-white p-4 rounded shadow">
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded" />
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 rounded" />
                    <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (e.g. Tools, Food)" className="w-full border px-3 py-2 rounded" />
                    <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="w-full border px-3 py-2 rounded" />
                    <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact" className="w-full border px-3 py-2 rounded" />
                    <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL (optional)" className="w-full border px-3 py-2 rounded" />
                    <div className="text-right">
                        <button disabled={posting} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">{posting ? 'Posting...' : 'Post'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
