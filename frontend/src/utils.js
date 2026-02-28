// File type icons
export function getFileIcon(type) {
    if (!type) return '📄'
    const t = type.toLowerCase()
    if (['pdf'].includes(t)) return '📕'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(t)) return '🖼️'
    if (['mp4', 'avi', 'mov', 'mkv'].includes(t)) return '🎬'
    if (['mp3', 'wav', 'flac', 'ogg'].includes(t)) return '🎵'
    if (['zip', 'rar', 'tar', 'gz'].includes(t)) return '🗜️'
    if (['doc', 'docx'].includes(t)) return '📝'
    if (['xls', 'xlsx', 'csv'].includes(t)) return '📊'
    if (['ppt', 'pptx'].includes(t)) return '📊'
    if (['js', 'ts', 'jsx', 'tsx', 'java', 'py', 'go'].includes(t)) return '💻'
    if (['txt', 'md'].includes(t)) return '📃'
    return '📄'
}

// Format bytes
export function formatSize(bytes) {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`
    return `${(bytes / 1073741824).toFixed(1)} GB`
}

// Relative time
export function timeAgo(dateStr) {
    if (!dateStr) return '—'
    const diff = Date.now() - new Date(dateStr)
    const s = Math.floor(diff / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`
    return `${Math.floor(s / 86400)}d ago`
}
