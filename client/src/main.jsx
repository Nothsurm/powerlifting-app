import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { store, persistor } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'


import Home from './pages/Home.jsx'
import ThemeProvider from './components/ThemeProvider.jsx'
import Login from './pages/Login.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Dashboard from './pages/PrivateRoute/Dashboard.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} element={<Home />} />
      <Route path='/signin' element={<Login />} />
      <Route path='/verify-email/:userId' element={<VerifyEmail />} />
      <Route path='/forgotPassword' element={<ForgotPassword />} />

      {/* Signed In */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </PersistGate>
)
