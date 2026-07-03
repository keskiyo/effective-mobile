import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { registerUser } from '../api/auth'
import { FormField } from '../components/FormField'
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas'

export function RegisterPage() {
	const navigate = useNavigate()
	const [serverError, setServerError] = useState('')
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

	const onSubmit = handleSubmit(async values => {
		setServerError('')
		try {
			await registerUser(values)
			navigate('/login', { replace: true })
		} catch {
			setServerError(
				'Не удалось зарегистрироваться. Возможно, email уже занят.',
			)
		}
	})

	return (
		<section className='mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
			<h1 className='text-2xl font-semibold text-slate-950'>
				Регистрация
			</h1>
			<form className='mt-6 grid gap-4' onSubmit={onSubmit}>
				<FormField label='Имя' error={errors.name}>
					<input
						className='rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
						{...register('name')}
					/>
				</FormField>
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
						autoComplete='new-password'
						{...register('password')}
					/>
				</FormField>
				<FormField
					label='Повтор пароля'
					error={errors.confirm_password}
				>
					<input
						className='rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
						type='password'
						autoComplete='new-password'
						{...register('confirm_password')}
					/>
				</FormField>
				{serverError && (
					<p className='text-sm text-red-600'>{serverError}</p>
				)}
				<button
					disabled={isSubmitting}
					className='rounded-md bg-slate-950 px-4 py-2 font-medium text-white disabled:opacity-60'
				>
					{isSubmitting ? 'Создаем...' : 'Создать аккаунт'}
				</button>
			</form>
			<p className='mt-4 text-sm text-slate-600'>
				Уже есть аккаунт?{' '}
				<Link
					className='font-medium text-slate-950 underline'
					to='/login'
				>
					Войти
				</Link>
			</p>
		</section>
	)
}
