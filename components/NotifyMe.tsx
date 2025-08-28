import { useState } from 'react'

interface NotifyMeProps {
  className?: string
}

export default function NotifyMe({ className = '' }: NotifyMeProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/notify-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null,
          interests: ['coming-soon']
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setMessageType('success')
        setEmail('')
        setName('')
      } else {
        setMessage(data.error || 'Ein Fehler ist aufgetreten')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Verbindungsfehler. Bitte versuchen Sie es später erneut.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ihr Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail-Adresse *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ihre@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Wird gesendet...' : 'Benachrichtigen Sie mich'}
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Wir senden Ihnen eine E-Mail, sobald cardl.io verfügbar ist. 
        Sie können sich jederzeit abmelden.
      </p>
    </div>
  )
}
