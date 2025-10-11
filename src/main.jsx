import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HabitProvider } from './context/HabitContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HabitProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#111113',
              color: '#FAFAFA',
              border: '1px solid #27272A',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#111113',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#111113',
              },
            },
          }}
        />
      </HabitProvider>
    </BrowserRouter>
  </StrictMode>,
)
