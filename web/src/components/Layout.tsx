import { NavLink, Outlet } from 'react-router-dom'

import { useAuth, useLogoutAndRedirect } from '../auth/AuthContext'
import { hasPermission } from '../auth/permissions'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
	`rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-white'}`

export function Layout() {
	const { user } = useAuth()
	const logout = useLogoutAndRedirect()

	const handleLogoutClick = () => {
		void logout()
	}

	return (
		<div className='min-h-screen bg-[#f6f7fb]'>
			<header className='border-b border-slate-200 bg-white/90 backdrop-blur'>
				<div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4'>
					<p className='text-lg font-semibold text-slate-950'>Auth</p>
					<nav className='flex flex-wrap items-center gap-2'>
						{user ? (
							<>
								<NavLink to='/profile' className={navLinkClass}>
									Профиль
								</NavLink>
								<NavLink
									to='/projects'
									className={navLinkClass}
								>
									Проекты
								</NavLink>
								{(user.role === 'admin' ||
									hasPermission(user, 'admin', 'manage')) && (
									<NavLink
										to='/admin'
										className={navLinkClass}
									>
										Админка
									</NavLink>
								)}
								<button
									onClick={handleLogoutClick}
									className='rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
								>
									Выйти
								</button>
							</>
						) : (
							<>
								<NavLink to='/login' className={navLinkClass}>
									Войти
								</NavLink>
								<NavLink
									to='/register'
									className={navLinkClass}
								>
									Регистрация
								</NavLink>
							</>
						)}
					</nav>
				</div>
			</header>
			<main className='mx-auto max-w-6xl px-4 py-8'>
				<Outlet />
			</main>
		</div>
	)
}
