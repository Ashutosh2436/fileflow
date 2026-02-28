import { Link } from 'react-router-dom'
import { Zap, Shield, Share2, Folders, ArrowRight, Cloud } from 'lucide-react'

const features = [
    { icon: Shield, title: 'Secure Auth', desc: 'JWT-protected login with Spring Security' },
    { icon: Cloud, title: 'File Upload', desc: 'Store metadata and track all your files' },
    { icon: Share2, title: 'Sharing', desc: 'Precisely share files with specific users' },
    { icon: Folders, title: 'Gallery View', desc: 'See your files + shared-with-you in one place' },
]

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
            {/* Gradient blobs */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `
          radial-gradient(ellipse at 15% 40%, rgba(99,102,241,0.15) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(139,92,246,0.12) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.06) 0%, transparent 55%)
        `,
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

                {/* Navbar */}
                <nav style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '24px 0', borderBottom: '1px solid var(--color-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(99,102,241,0.4)'
                        }}>
                            <Zap size={18} color="white" />
                        </div>
                        <span style={{
                            fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem',
                            background: 'linear-gradient(135deg, #e2e8f0, #6366f1)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            FileFlow
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                    </div>
                </nav>

                {/* Hero */}
                <div style={{ textAlign: 'center', padding: '96px 0 80px' }}>
                    <div className="badge badge-indigo" style={{ marginBottom: 20, display: 'inline-flex' }}>
                        <Zap size={12} /> Powered by Spring Boot + JWT
                    </div>
                    <h1 style={{ marginBottom: 20, lineHeight: 1.1 }}>
                        Your files,{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            secured & shared
                        </span>
                    </h1>
                    <p style={{
                        fontSize: '1.15rem', color: 'var(--color-text-sub)',
                        maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7
                    }}>
                        FileFlow is a next-gen file management platform built on Java Spring Boot
                        with role-based access, JWT auth, and precise file sharing controls.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                            Start for Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Features grid */}
                <div className="grid-4" style={{ marginBottom: 80 }}>
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="card" style={{ textAlign: 'center' }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(99,102,241,0.25)'
                            }}>
                                <Icon size={22} color="#a5b4fc" />
                            </div>
                            <h4 style={{ marginBottom: 8, color: 'var(--color-text)' }}>{title}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.6 }}>{desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="card-glass" style={{ textAlign: 'center', padding: '56px 32px', marginBottom: 64 }}>
                    <h2 style={{ marginBottom: 12 }}>Ready to take control?</h2>
                    <p style={{ color: 'var(--color-text-sub)', marginBottom: 32 }}>
                        Create your account in seconds. No credit card required.
                    </p>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                        Create Free Account <ArrowRight size={18} />
                    </Link>
                </div>

                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', paddingBottom: 32 }}>
                    © 2026 FileFlow · Built with Spring Boot + React
                </p>
            </div>
        </div>
    )
}
