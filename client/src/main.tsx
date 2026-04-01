import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/QueryClient.ts'


const  PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing publishable key")
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
  
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      
      <QueryClientProvider client={queryClient}>
    <App />
      </QueryClientProvider>

  </ClerkProvider>
  </StrictMode>,
)
