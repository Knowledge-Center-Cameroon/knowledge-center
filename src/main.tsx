import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './ErrorBoundary'
import { GoogleOAuthProvider } from "@react-oauth/google"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
if (!googleClientId) {
  console.warn(
    "[KC] VITE_GOOGLE_CLIENT_ID is not set. Google sign-in will not work. " +
    "Add it to your .env file or GitHub Actions secrets."
  );
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </ErrorBoundary>
);
