import { useState } from 'react'
import { Share2, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { shareFile, revokeAccess } from '../api'

export default function SharePage() {
    const [mode, setMode] = useState('share') // 'share' | 'revoke'
    const [fileId, setFileId] = useState('')
    const [targetUserId, setTarget] = useState('')
    const [loading, setLoading] = useState(false)
    const [lastAction, setLastAction] = useState(null)

    const handleShare = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await shareFile(Number(fileId), Number(targetUserId))
            toast.success(`✅ File #${fileId} shared with User #${targetUserId}`)
            setLastAction({ type: 'share', fileId, targetUserId })
            setFileId(''); setTarget('')
        } catch (err) {
            toast.error(err.response?.data || 'Failed to share')
        } finally { setLoading(false) }
    }

    const handleRevoke = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await revokeAccess(Number(fileId), Number(targetUserId))
            toast.success(`🗑 Access revoked for User #${targetUserId} on File #${fileId}`)
            setLastAction({ type: 'revoke', fileId, targetUserId })
            setFileId(''); setTarget('')
        } catch (err) {
            toast.error(err.response?.data || 'Failed to revoke')
        } finally { setLoading(false) }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Share Files</div>
                    <div className="page-subtitle">Grant or revoke file access for other users</div>
                </div>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                <button id="tab-share" className={`btn btn-sm ${mode === 'share' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setMode('share')}>
                    <Share2 size={15} /> Share Access
                </button>
                <button id="tab-revoke" className={`btn btn-sm ${mode === 'revoke' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setMode('revoke')}>
                    <X size={15} /> Revoke Access
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Form card */}
                <div className="card">
                    <h3 style={{ marginBottom: 6 }}>
                        {mode === 'share' ? '🔗 Share a File' : '🚫 Revoke Access'}
                    </h3>
                    <p className="text-muted text-sm" style={{ marginBottom: 24 }}>
                        {mode === 'share'
                            ? 'Grant a specific user access to one of your files.'
                            : 'Remove a user\'s access to your file.'}
                    </p>

                    <form onSubmit={mode === 'share' ? handleShare : handleRevoke}
                        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div className="form-group">
                            <label className="form-label">File ID</label>
                            <input id="share-file-id" className="form-input" type="number" placeholder="e.g. 1"
                                value={fileId} onChange={e => setFileId(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {mode === 'share' ? 'Share With User ID' : 'Remove User ID'}
                            </label>
                            <input id="share-target-user" className="form-input" type="number" placeholder="e.g. 2"
                                value={targetUserId} onChange={e => setTarget(e.target.value)} required />
                        </div>
                        <button id="share-submit" type="submit"
                            className={`btn ${mode === 'share' ? 'btn-primary' : 'btn-danger'} w-full`}
                            disabled={loading}>
                            {loading ? 'Processing…' : mode === 'share' ? 'Share File' : 'Revoke Access'}
                        </button>
                    </form>
                </div>

                {/* Info / last action panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {lastAction && (
                        <div className="card" style={{ borderColor: 'var(--color-success)' }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <CheckCircle size={20} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                        {lastAction.type === 'share' ? 'File Shared!' : 'Access Revoked!'}
                                    </div>
                                    <p className="text-muted text-sm">
                                        File <strong>#{lastAction.fileId}</strong>{' '}
                                        {lastAction.type === 'share' ? 'shared with' : 'access removed from'}{' '}
                                        User <strong>#{lastAction.targetUserId}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card" style={{ background: 'var(--color-surface-2)' }}>
                        <h4 style={{ marginBottom: 16, color: 'var(--color-text-sub)' }}>How it works</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { step: '1', text: 'Go to My Files and note the File ID you want to share' },
                                { step: '2', text: "Enter the recipient's User ID (ask them to check their Dashboard)" },
                                { step: '3', text: 'Click Share — they can now see it in their Gallery' },
                                { step: '4', text: 'Use Revoke to remove their access at any time' },
                            ].map(({ step, text }) => (
                                <div key={step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem', fontWeight: 700, color: 'white'
                                    }}>{step}</div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.5 }}>{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
