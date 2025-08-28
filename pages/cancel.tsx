import Head from 'next/head'
import { useRouter } from 'next/router'

export default function CancelPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Bestellung abgebrochen - cardl.io</title>
        <meta name="description" content="Ihre Bestellung wurde abgebrochen" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bestellung abgebrochen
            </h1>
            
            <p className="text-gray-600 mb-6">
              Ihre Bestellung wurde nicht abgeschlossen. Keine Sorge - es wurde nichts von Ihrem Konto abgebucht.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Zurück zur Startseite
              </button>
              
              <p className="text-sm text-gray-500">
                Haben Sie Fragen?{' '}
                <a href="mailto:support@cardl.io" className="text-blue-600 hover:text-blue-500">
                  Kontaktieren Sie uns
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
