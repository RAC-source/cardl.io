import AuthForm from '../../components/AuthForm'
import Head from 'next/head'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Anmelden - cardl.io</title>
        <meta name="description" content="Melden Sie sich bei cardl.io an" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              cardl.io
            </h1>
            <p className="text-gray-600">
              Erstellen Sie Ihre eigenen Karten und Druckerzeugnisse
            </p>
          </div>
          
          <AuthForm />
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Noch kein Konto?{' '}
              <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Zurück zur Startseite
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
