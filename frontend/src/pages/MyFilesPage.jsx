import { useEffect, useState } from 'react'
import { Plus, Trash2, Share2, RefreshCw, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { getUserFiles, uploadFile, deleteFile, shareFile } from '../api'
import { getFileIcon, formatSize, timeAgo } from '../utils'

export default function MyFilesPage() {
    const userId = localStorage.getItem('ff_userId')
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [selFile, setSelFile] = useState(null)
    const [shareTarget, setShareTarget] = useState('')
    const [form, setForm] = useState({ fileName: '', fileType: '', fileSize: '', filePath: '' })

    const load = () => {
        if (!userId) return
        setLoading(true)
        getUserFiles(userId)
            .then(r => setFiles(r.data))
            .catch(() => toast.error('Failed to load files'))
            .finally(() => setLoading(false))
    }

    useEffect(load, [userId])

    const handleUpload = async (e) => {
        e.preventDefault()
        try {
            await uploadFile(userId, {
                fileName: form.fileName,
                fileType: form.fileType,
                fileSize: Number(form.fileSize),
                filePath: form.filePath || `/uploads/${form.fileName}`,
            })
            toast.success('File uploaded!')
            setShowUpload(false)
            setForm({ fileName: '', fileType: '', fileSize: '', filePath: '' })
            load()
        } catch { toast.error('Upload failed') }
    }

    const handleDelete = async (fileId) => {
        if (!window.confirm('Delete this file?')) return
        try {
            await deleteFile(fileId)
            toast.success('File deleted')
            load()
        } catch { toast.error('Delete failed') }
    }

    const handleShare = async (e) => {
        e.preventDefault()
        try {
            await shareFile(selFile.fileId, Number(shareTarget))
            toast.success(`Shared with user #${shareTarget}`)
            setShowShare(false)
            setShareTarget('')
        } catch (err) {
            toast.error(err.response?.data || 'Share failed')
        }
    }

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
                    <div className="page-title">My Files</div>
                    <div className="page-subtitle">Manage and share your uploaded files</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} /> Refresh</button>
                    <button id="open-upload" className="btn btn-primary" onClick={() => setShowUpload(true)}>
                        <Plus size={16} /> Upload File
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="file-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="file-card" style={{ height: 160 }}>
                            <div style={{
                                background: 'var(--color-surface-2)', borderRadius: 8, height: '100%',
                                animation: 'pulse 2s infinite'
                            }} />
                        </div>
                    ))}
                </div>
            ) : files.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><Upload size={28} color="var(--color-primary)" /></div>
                    <h3>No files yet</h3>
                    <p>Upload your first file to get started</p>
                    <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                        <Plus size={16} /> Upload File
                    </button>
                </div>
            ) : (
                <div className="file-grid">
                    {files.map(f => (
                        <div key={f.fileId} className="file-card">
                            <div className="file-card-icon">{getFileIcon(f.fileType)}</div>
                            <div className="file-card-name" title={f.fileName}>{f.fileName}</div>
                            <div className="file-card-meta">{f.fileType || 'unknown'} · {formatSize(f.fileSize)}</div>
                            <div className="file-card-meta" style={{ color: 'var(--color-text-muted)' }}>
                                {timeAgo(f.uploadedAt)}
                            </div>
                            <div className="file-card-actions">
                                <button className="btn btn-outline btn-sm" onClick={() => { setSelFile(f); setShowShare(true) }}>
                                    <Share2 size={13} /> Share
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.fileId)}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUpload && (
                <div className="modal-overlay" onClick={() => setShowUpload(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Upload File</h3>
                            <button className="btn btn-outline btn-sm" onClick={() => setShowUpload(false)}>✕</button>
                        </div>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">File Name *</label>
                                <input className="form-input" placeholder="resume.pdf" required
                                    value={form.fileName} onChange={e => setForm(f => ({ ...f, fileName: e.target.value }))} />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">File Type</label>
                                    <input className="form-input" placeholder="pdf"
                                        value={form.fileType} onChange={e => setForm(f => ({ ...f, fileType: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Size (bytes)</label>
                                    <input className="form-input" type="number" placeholder="2048"
                                        value={form.fileSize} onChange={e => setForm(f => ({ ...f, fileSize: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">File Path</label>
                                <input className="form-input" placeholder="/uploads/resume.pdf"
                                    value={form.filePath} onChange={e => setForm(f => ({ ...f, filePath: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowUpload(false)}>Cancel</button>
                                <button id="confirm-upload" type="submit" className="btn btn-primary">
                                    <Upload size={15} /> Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShare && selFile && (
                <div className="modal-overlay" onClick={() => setShowShare(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Share File</h3>
                            <button className="btn btn-outline btn-sm" onClick={() => setShowShare(false)}>✕</button>
                        </div>
                        <p className="text-muted text-sm" style={{ marginBottom: 20 }}>
                            Sharing: <strong style={{ color: 'var(--color-text)' }}>{selFile.fileName}</strong>
                        </p>
                        <form onSubmit={handleShare} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Recipient User ID</label>
                                <input id="share-user-id" className="form-input" type="number" placeholder="e.g. 2"
                                    value={shareTarget} onChange={e => setShareTarget(e.target.value)} required />
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowShare(false)}>Cancel</button>
                                <button id="confirm-share" type="submit" className="btn btn-primary">
                                    <Share2 size={15} /> Share
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
