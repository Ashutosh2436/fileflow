import { useEffect, useState } from 'react'
import { RefreshCw, Images } from 'lucide-react'
import toast from 'react-hot-toast'
import { getGallery } from '../api'
import { getFileIcon, formatSize, timeAgo } from '../utils'

export default function GalleryPage() {
    const userId = localStorage.getItem('ff_userId')
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const load = () => {
        if (!userId) return
        setLoading(true)
        getGallery(userId)
            .then(r => setFiles(r.data))
            .catch(() => toast.error('Failed to load gallery'))
            .finally(() => setLoading(false))
    }

    useEffect(load, [userId])

    const myFiles = files.filter(f => f.user?.userId === Number(userId))
    const sharedFiles = files.filter(f => f.user?.userId !== Number(userId))
    const displayed = filter === 'mine' ? myFiles : filter === 'shared' ? sharedFiles : files

    const types = [...new Set(files.map(f => f.fileType).filter(Boolean))]

    if (!userId) return (
        <div className="empty-state">
            <div className="empty-state-icon">🔑</div>
            <p>Set your User ID on the Dashboard first.</p>
        </div>
    )

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Gallery</div>
                    <div className="page-subtitle">All your files + files shared with you</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={load}>
                    <RefreshCw size={15} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {[['all', 'All Files'], ['mine', 'My Files'], ['shared', 'Shared With Me']].map(([val, label]) => (
                    <button key={val}
                        className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter(val)}>
                        {label}
                        <span style={{
                            background: 'rgba(255,255,255,0.15)', borderRadius: 99,
                            padding: '1px 8px', fontSize: '0.7rem', marginLeft: 4
                        }}>
                            {val === 'all' ? files.length : val === 'mine' ? myFiles.length : sharedFiles.length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="file-grid">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="file-card" style={{ height: 170 }}>
                            <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, height: '100%' }} />
                        </div>
                    ))}
                </div>
            ) : displayed.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><Images size={28} color="var(--color-primary)" /></div>
                    <h3>No files here</h3>
                    <p style={{ color: 'var(--color-text-sub)' }}>Upload files or receive shared files to see them here.</p>
                </div>
            ) : (
                <div className="file-grid">
                    {displayed.map(f => {
                        const isShared = f.user?.userId !== Number(userId)
                        return (
                            <div key={f.fileId} className="file-card">
                                {isShared && (
                                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                        <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>Shared</span>
                                    </div>
                                )}
                                <div className="file-card-icon">{getFileIcon(f.fileType)}</div>
                                <div className="file-card-name" title={f.fileName}>{f.fileName}</div>
                                <div className="file-card-meta">
                                    <span className={`badge ${isShared ? 'badge-violet' : 'badge-indigo'}`}
                                        style={{ fontSize: '0.7rem' }}>
                                        {f.fileType || 'file'}
                                    </span>
                                    {' '}· {formatSize(f.fileSize)}
                                </div>
                                {isShared && (
                                    <div className="file-card-meta" style={{ color: 'var(--color-text-muted)' }}>
                                        by {f.user?.firstName} {f.user?.lastName}
                                    </div>
                                )}
                                <div className="file-card-meta" style={{ color: 'var(--color-text-muted)' }}>
                                    {timeAgo(f.uploadedAt)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
