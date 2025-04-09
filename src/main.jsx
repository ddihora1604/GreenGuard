import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { NotificationProvider } from './context/NotificationContext'
import { ActionNotificationProvider } from './context/ActionNotificationContext'
import { LanguageProvider } from './context/LanguageContext'
import './i18n/config'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AppProvider>
          <NotificationProvider>
            <ActionNotificationProvider>
              <App />
            </ActionNotificationProvider>
          </NotificationProvider>
        </AppProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
