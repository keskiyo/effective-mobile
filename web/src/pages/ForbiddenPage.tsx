import { Link } from 'react-router-dom'

export function ForbiddenPage() {
	return (
		<section className='mx-auto max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm'>
			<p className='text-sm font-semibold uppercase tracking-wide text-red-600'>
				403
			</p>
			<h1 className='mt-2 text-2xl font-semibold text-slate-950'>
				Доступ запрещен
			</h1>
			<p className='mt-3 text-sm text-slate-600'>
				Вы вошли в систему, но у пользователя нет нужного permission.
			</p>
			<Link
				className='mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 font-medium text-white'
				to='/profile'
			>
				Вернуться в профиль
			</Link>
		</section>
	)
}
