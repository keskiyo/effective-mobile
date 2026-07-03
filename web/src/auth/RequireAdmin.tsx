import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './AuthContext'
import { hasPermission } from './permissions'

export function RequireAdmin() {
	const { user, loading } = useAuth()

	if (loading) {
		return (
			<div className='p-8 text-center text-sm text-slate-600'>
				Проверка доступа...
			</div>
		)
	}
	if (
		!user ||
		(user.role !== 'admin' && !hasPermission(user, 'admin', 'manage'))
	) {
		return <Navigate to='/forbidden' replace />
	}
	return <Outlet />
}
