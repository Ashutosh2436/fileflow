import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MyFilesPage from './pages/MyFilesPage'
import GalleryPage from './pages/GalleryPage'
import SharePage from './pages/SharePage'
import LandingPage from './pages/LandingPage'

function ProtectedLayout() {
    const { token } = useAuth()
    if (!token) return <Navigate to="/login" replace />
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/files" element={<MyFilesPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/share" element={<SharePage />} />
                </Routes>
            </main>
        </div>
    )
}

function AppRoutes() {
    const { token } = useAuth()
    return (
        <Routes>
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />
            <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    )
}
