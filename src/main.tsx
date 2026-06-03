import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BingoProvider } from './context/BingoContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BingoProvider>
      <App />
    </BingoProvider>
  </StrictMode>,
)

