import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = '277994584649-7s97n1trbj6oi5eh91jcfokl0pf6g3bm.apps.googleusercontent.com' // This is a placeholder - you'll need to get your own from Google Cloud Console

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-100">
        <App />
      </div>
    </GoogleOAuthProvider>
  </StrictMode>,
)
