import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LazyMotion, MotionConfig } from 'framer-motion'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

// Animation features load after first paint. reducedMotion="user" drops transforms for people who ask for less motion.
const loadFeatures = () => import('./lib/motionFeatures').then((m) => m.default)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
  </StrictMode>,
)
