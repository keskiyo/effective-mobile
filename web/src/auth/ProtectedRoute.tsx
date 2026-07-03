import { Navigate, Outlet } from 'react-router-dom'

import { TOKEN_STORAGE_KEY } from '../api/axios'
import { useAuth } from './AuthContext'

export function ProtectedRoute() {
	const { user, loading } = useAuth()
	const hasToken = Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))

	if (!hasToken) {
		return <Navigate to='/login' replace />
	}
	if (loading) {
		return (
			<div className='p-8 text-center text-sm text-slate-600'>
				Загрузка профиля...
			</div>
		)
	}
	if (!user) {
		return <Navigate to='/login' replace />
	}
	return <Outlet />
}
