import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { FormField } from '../components/FormField'
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas'

export function LoginPage() {
	const { login } = useAuth()
	const navigate = useNavigate()
	const [serverError, setServerError] = useState('')
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

	const onSubmit = handleSubmit(async values => {
		setServerError('')
		try {
			await login(values)
			navigate('/profile', { replace: true })
		} catch {
			setServerError('Неверный email или пароль')
		}
	})

	return (
		<section className='mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
			<h1 className='text-2xl font-semibold text-slate-950'>Вход</h1>
			<p className='mt-2 text-sm text-slate-600'>
				Используйте тестовые аккаунты из README или созданный профиль.
			</p>
			<form className='mt-6 grid gap-4' onSubmit={onSubmit}>
				<FormField label='Email' error={errors.email}>
					<input
						className='rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
						type='email'
						autoComplete='email'
						{...register('email')}
					/>
				</FormField>
				<FormField label='Пароль' error={errors.password}>
					<input
						className='rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
						type='password'
						autoComplete='current-password'
						{...register('password')}
					/>
				</FormField>
				{serverError && (
					<p className='text-sm text-red-600'>{serverError}</p>
				)}
				<button
					disabled={isSubmitting}
					className='rounded-md bg-slate-950 px-4 py-2 font-medium text-white disabled:opacity-60'
				>
					{isSubmitting ? 'Входим...' : 'Войти'}
				</button>
			</form>
			<p className='mt-4 text-sm text-slate-600'>
				Нет аккаунта?{' '}
				<Link
					className='font-medium text-slate-950 underline'
					to='/register'
				>
					Зарегистрироваться
				</Link>
			</p>
		</section>
	)
}
