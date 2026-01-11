import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import App from './App.jsx'
import Header from './components/Header/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>s
    <BrowserRouter basename="/WaveHeaven">
      <App />
    </BrowserRouter>
  </StrictMode>,
)