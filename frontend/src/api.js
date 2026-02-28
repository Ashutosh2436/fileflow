import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: BASE })

// Attach JWT on every request
api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('ff_token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
})

/* ===== AUTH ===== */
export const registerUser = (data) =>
    api.post('/auth/register', data)

export const loginUser = (data) =>
    api.post('/auth/login', data)

/* ===== FILES ===== */
export const uploadFile = (userId, data) =>
    api.post(`/v1/files/upload/${userId}`, data)

export const getUserFiles = (userId) =>
    api.get(`/v1/files/user/${userId}`)

export const getGallery = (userId) =>
    api.get(`/v1/files/gallery/${userId}`)

export const shareFile = (fileId, userId) =>
    api.post(`/v1/files/share?fileId=${fileId}&userId=${userId}`)

export const revokeAccess = (fileId, userId) =>
    api.delete(`/v1/files/revoke?fileId=${fileId}&userId=${userId}`)

export const deleteFile = (fileId) =>
    api.delete(`/v1/files/delete/${fileId}`)

/* ===== USERS ===== */
export const createUser = (data) =>
    api.post('/v1/users', data)

export default api
