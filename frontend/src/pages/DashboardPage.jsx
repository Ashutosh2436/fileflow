import { useEffect, useState } from 'react'
import { Files, Share2, Images, TrendingUp, Clock, Zap } from 'lucide-react'
import { getUserFiles, getGallery } from '../api'
import { useAuth } from '../context/AuthContext'
import { getFileIcon, formatSize, timeAgo } from '../utils'

export default function DashboardPage() {
    const { userId } = useAuth()
    const [files, setFiles] = useState([])
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [localId, setLocalId] = useState(userId || localStorage.getItem('ff_userId') || '')

    useEffect(() => {
        if (!localId) { setLoading(false); return }
        Promise.all([
            getUserFiles(localId).then(r => setFiles(r.data)),
            getGallery(localId).then(r => setGallery(r.data)),
        ]).catch(() => { }).finally(() => setLoading(false))
    }, [localId])

    const sharedWithMe = gallery.filter(f => f.user?.userId !== Number(localId))
    const recentFiles = [...files].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 5)

    const handleSetId = (e) => {
        e.preventDefault()
        const v = e.target.uid.value.trim()
        if (!v) return
        localStorage.setItem('ff_userId', v)
        setLocalId(v)
        setLoading(true)
    }

    if (!localId) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
                <h3 style={{ marginBottom: 8 }}>Enter your User ID</h3>
                <p className="text-muted text-sm" style={{ marginBottom: 24 }}>
                    Your user ID is assigned by the backend after registration. Check the DB or API response.
                </p>
                <form onSubmit={handleSetId} style={{ display: 'flex', gap: 10 }}>
                    <input id="uid" name="uid" className="form-input" placeholder="e.g. 1" type="number" required />
                    <button type="submit" className="btn btn-primary">Go</button>
                </form>
            </div>
        </div>
    )

    const stats = [
        { label: 'My Files', value: files.length, icon: Files, color: '#6366f1' },
        { label: 'Shared with Me', value: sharedWithMe.length, icon: Share2, color: '#8b5cf6' },
        { label: 'Gallery Items', value: gallery.length, icon: Images, color: '#06b6d4' },
        {
            label: 'Total File Size', value: `${(files.reduce((s, f) => s + (f.fileSize || 0), 0) / 1024).toFixed(1)} KB`,
            icon: TrendingUp, color: '#10b981'
        },
    ]

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Dashboard</div>
                    <div className="page-subtitle">Welcome back! Here's your file overview.</div>
                </div>
                <div className="badge badge-indigo"><Zap size={12} /> User #{localId}</div>
            </div>

            {/* Stats */}
            {loading ? (
                <div className="grid-4" style={{ marginBottom: 32 }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="stat-card" style={{ height: 110 }}>
                            <div style={{ height: '100%', background: 'var(--color-surface-2)', borderRadius: 8, animation: 'pulse 2s infinite' }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid-4" style={{ marginBottom: 32 }}>
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className="stat-value">{value}</div>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `1px solid ${color}44`
                                }}>
                                    <Icon size={20} color={color} />
                                </div>
                            </div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Recent Files */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <Clock size={18} color="var(--color-primary)" />
                    <h3>Recent Files</h3>
                </div>
                {recentFiles.length === 0 ? (
                    <div className="empty-state" style={{ padding: '40px 0' }}>
                        <div className="empty-state-icon">📁</div>
                        <p>You haven't uploaded any files yet.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Uploaded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFiles.map(f => (
                                    <tr key={f.fileId}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: '1.2rem' }}>{getFileIcon(f.fileType)}</span>
                                            {f.fileName}
                                        </td>
                                        <td><span className="badge badge-indigo">{f.fileType || 'unknown'}</span></td>
                                        <td>{formatSize(f.fileSize)}</td>
                                        <td style={{ color: 'var(--color-text-sub)' }}>{timeAgo(f.uploadedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Shared with me */}
            {sharedWithMe.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Share2 size={18} color="var(--color-secondary)" />
                        <h3>Shared With Me</h3>
                    </div>
                    <div className="file-grid">
                        {sharedWithMe.slice(0, 6).map(f => (
                            <div key={f.fileId} className="file-card">
                                <div className="file-card-icon">{getFileIcon(f.fileType)}</div>
                                <div className="file-card-name">{f.fileName}</div>
                                <div className="file-card-meta">
                                    {f.fileType} · {formatSize(f.fileSize)}
                                </div>
                                <div className="file-card-meta" style={{ color: 'var(--color-text-muted)' }}>
                                    by {f.user?.firstName} {f.user?.lastName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
