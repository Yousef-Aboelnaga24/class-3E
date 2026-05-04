import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import AppLayout from './components/layout/AppLayout'

// Pages
import Home from './pages/Home'
import CreateMemory from './pages/CreateMemory'
import Gallery from './pages/Gallery'
import Timeline from './pages/Timeline'
import Members from './pages/Members'
import Profile from './pages/Profile'
import Confessions from './pages/Confessions'
import Admin from './pages/Admin'
import Play from './pages/Play'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
// import VerifyEmail from './pages/auth/VerifyEmail'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route
                path="/verify-email"
                element={
                  <ProtectedRoute requireVerification={false}>
                    <VerifyEmail />
                  </ProtectedRoute>
                }
              /> */}

              {/* Protected routes inside app layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateMemory />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/members" element={<Members />} />
                <Route path="/play" element={<Play />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/confessions" element={<Confessions />} />
              </Route>
            </Routes>
          </BrowserRouter>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#FFFFFF',
                color: '#3D2B1F',
                border: '1px solid #F0E6D3',
                borderRadius: '14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                boxShadow: '0 8px 32px rgba(61, 43, 31, 0.14)',
              },
              success: {
                iconTheme: { primary: '#F4A261', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#E76F51', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
