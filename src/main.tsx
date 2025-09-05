import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from '@/app/router'

// Create root and render app
const container = document.getElementById('root')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  )
}

// Register PWA Service Worker (if plugin present)
if ('serviceWorker' in navigator) {
  // dynamic import keeps dev clean if plugin is not active
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true })
  }).catch(() => {})
}

// Report minimal Web Vitals in production
if (import.meta.env.PROD) {
  import('./report-web-vitals').then(m => m.default()).catch(() => {})
}
