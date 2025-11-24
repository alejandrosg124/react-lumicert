import { Route, Routes, Navigate } from 'react-router-dom'
import { Index } from './pages/Index'
import { Login } from './pages/auth/Login'
import { ProtectedRoutes } from './pages/auth/ProtectRoutes'
import { Layout } from './pages/Layout'
import { SectorConfig } from './pages/SectorConfig'

import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { AppDispatch } from './store/store'
import { useDispatch } from 'react-redux'
import { checkAuthStatus } from './store/thunks/authThunk'

export const LumiCert = () => {

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Index />} />
        </Route>
        <Route path='/login' element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path='/sectores' element={<SectorConfig />} />
          </Route>
          {/* Catch-all for any other routes - requires authentication */}
          <Route path='*' element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
