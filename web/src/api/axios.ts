import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'auth_token'

export const api = axios.create({
	baseURL:
		import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	response => response,
	error => {
		const status = error.response?.status
		if (status === 401) {
			localStorage.removeItem(TOKEN_STORAGE_KEY)
			if (window.location.pathname !== '/login') {
				window.location.assign('/login')
			}
		}
		if (status === 403 && window.location.pathname !== '/forbidden') {
			window.location.assign('/forbidden')
		}
		return Promise.reject(error)
	},
)
