import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser } from '../api'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '',
        phoneNumber: '', passwordHash: ''
    })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await registerUser(form)
            toast.success('Account created! Please sign in.')
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    const field = (id, name, label, type, icon, placeholder) => (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div style={{ position: 'relative' }}>
                <span style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex'
                }}>
                    {icon}
                </span>
                {name === 'passwordHash' ? (
                    <>
                        <input id={id} name={name} type={showPass ? 'text' : 'password'}
                            className="form-input" style={{ paddingLeft: 42, paddingRight: 42 }}
                            placeholder={placeholder} value={form[name]} onChange={handleChange} required />
                        <button type="button" onClick={() => setShowPass(s => !s)}
                            style={{
                                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)'
                            }}>
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </>
                ) : (
                    <input id={id} name={name} type={type} className="form-input"
                        style={{ paddingLeft: 42 }} placeholder={placeholder}
                        value={form[name]} onChange={handleChange} required={name !== 'phoneNumber'} />
                )}
            </div>
        </div>
    )

    return (
        <div className="auth-page">
            <div className="auth-bg-glow" />
            <div className="auth-card" style={{ maxWidth: 480 }}>
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

                <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Create your account</h2>
                <p style={{ textAlign: 'center', color: 'var(--color-text-sub)', fontSize: '0.9rem', marginBottom: 32 }}>
                    Join FileFlow — secure file management
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="grid-2">
                        {field('reg-fname', 'firstName', 'First Name', 'text', <User size={16} />, 'Ashutosh')}
                        {field('reg-lname', 'lastName', 'Last Name', 'text', <User size={16} />, 'Awasthi')}
                    </div>
                    {field('reg-email', 'email', 'Email Address', 'email', <Mail size={16} />, 'you@example.com')}
                    {field('reg-phone', 'phoneNumber', 'Phone (optional)', 'tel', <Phone size={16} />, '9999999999')}
                    {field('reg-pass', 'passwordHash', 'Password', 'password', <Lock size={16} />, '••••••••')}

                    <button id="register-submit" type="submit" className="btn btn-primary w-full"
                        disabled={loading} style={{ marginTop: 8, padding: '13px' }}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <hr className="divider" />

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-sub)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    )
}
