import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Files, Images, Share2,
    LogOut, User, Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/files', icon: Files, label: 'My Files' },
    { to: '/gallery', icon: Images, label: 'Gallery' },
    { to: '/share', icon: Share2, label: 'Share Files' },
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <Zap size={20} color="white" />
                </div>
                <span className="sidebar-logo-text">FileFlow</span>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">Main Menu</div>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="nav-item" style={{ cursor: 'default', marginBottom: '4px' }}>
                    <div style={{
                        width: 32, height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <User size={16} color="white" />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{
                            fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                            {user?.email || 'User'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Logged in</div>
                    </div>
                </div>
                <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
