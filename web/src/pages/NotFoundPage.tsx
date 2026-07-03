import { Link } from 'react-router-dom'

export function NotFoundPage() {
	return (
		<section className='mx-auto max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm'>
			<p className='text-sm font-semibold uppercase tracking-wide text-slate-500'>
				404
			</p>
			<h1 className='mt-2 text-2xl font-semibold text-slate-950'>
				Страница не найдена
			</h1>
			<Link
				className='mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 font-medium text-white'
				to='/profile'
			>
				На главную
			</Link>
		</section>
	)
}
