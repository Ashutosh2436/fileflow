import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser } from '../api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({ email: '', passwordHash: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await loginUser(form)
            const token = typeof res.data === 'string' ? res.data : res.data.token
            login(token)
            // Grab userId from the response or local store — Spring Boot returns a plain JWT string
            // We'll prompt via dashboard if userId not known
            toast.success('Welcome back! 🎉')
            navigate('/')
        } catch (err) {
            toast.error(err.response?.data || 'Login failed. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg-glow" />
            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <Zap size={22} color="white" />
                    </div>
                    <span style={{
                        fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.6rem',
                        background: 'linear-gradient(135deg, #e2e8f0, #6366f1)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>
                        FileFlow
                    </span>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Welcome back</h2>
                <p style={{ textAlign: 'center', color: 'var(--color-text-sub)', fontSize: '0.9rem', marginBottom: 32 }}>
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{
                                position: 'absolute', left: 14, top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--color-text-muted)'
                            }} />
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: 42 }}
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{
                                position: 'absolute', left: 14, top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--color-text-muted)'
                            }} />
                            <input
                                id="login-password"
                                name="passwordHash"
                                type={showPass ? 'text' : 'password'}
                                className="form-input"
                                style={{ paddingLeft: 42, paddingRight: 42 }}
                                placeholder="••••••••"
                                value={form.passwordHash}
                                onChange={handleChange}
                                required
                            />
                            <button type="button" onClick={() => setShowPass(s => !s)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)'
                                }}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button id="login-submit" type="submit" className="btn btn-primary w-full" disabled={loading}
                        style={{ marginTop: 8, padding: '13px' }}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <hr className="divider" />

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-sub)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}
