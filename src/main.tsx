import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './ErrorBoundary'
import { ClerkProvider } from "@clerk/react"

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set in environment variables");
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </ErrorBoundary>
);
