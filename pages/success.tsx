import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function SuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { session_id } = router.query
    
    if (session_id) {
      // Hier könnten wir die Bestelldetails aus der Datenbank holen
      // Für jetzt: Mock-Daten
      setOrderDetails({
        sessionId: session_id,
        productName: 'Ihr Produkt',
        amount: '0,00 €',
        status: 'Bezahlt'
      })
      setLoading(false)
    }
  }, [router.query])

  return (
    <>
      <Head>
        <title>Bestellung erfolgreich - cardl.io</title>
        <meta name="description" content="Ihre Bestellung wurde erfolgreich verarbeitet" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bestellung erfolgreich!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Vielen Dank für Ihre Bestellung. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
            </p>

            {!loading && orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-gray-900 mb-2">Bestelldetails:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Produkt:</span> {orderDetails.productName}</p>
                  <p><span className="font-medium">Betrag:</span> {orderDetails.amount}</p>
                  <p><span className="font-medium">Status:</span> {orderDetails.status}</p>
                  <p><span className="font-medium">Session ID:</span> {orderDetails.sessionId}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Zurück zur Startseite
              </button>
              
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
              >
                Zum Konto
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
