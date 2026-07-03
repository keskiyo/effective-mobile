import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { deleteMe, updateMe } from '../api/users'
import { useAuth, useLogoutAndRedirect } from '../auth/AuthContext'
import { FormField } from '../components/FormField'
import { PermissionList } from '../components/PermissionList'
import { profileSchema, type ProfileFormValues } from '../schemas/authSchemas'

export function ProfilePage() {
	const { user, refreshUser } = useAuth()
	const logout = useLogoutAndRedirect()
	const [message, setMessage] = useState('')
	const [serverError, setServerError] = useState('')
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: '',
			email: '',
			new_password: '',
			confirm_password: '',
		},
	})

	useEffect(() => {
		if (user) {
			reset({
				name: user.name,
				email: user.email,
				new_password: '',
				confirm_password: '',
			})
		}
	}, [reset, user])

	if (!user) {
		return null
	}

	const onSubmit = handleSubmit(async values => {
		setMessage('')
		setServerError('')
		try {
			await updateMe({
				name: values.name,
				email: values.email,
				new_password: values.new_password?.trim() || undefined,
				confirm_password: values.confirm_password?.trim() || undefined,
			})
			await refreshUser()
			reset({
				name: values.name,
				email: values.email,
				new_password: '',
				confirm_password: '',
			})
			setMessage('Профиль обновлен')
		} catch {
			setServerError(
				'Не удалось обновить профиль. Возможно, email уже занят.',
			)
		}
	})

	const handleDelete = async () => {
		if (
			!window.confirm(
				'Удалить аккаунт? После этого вход будет недоступен.',
			)
		) {
			return
		}
		await deleteMe()
		await logout()
	}

	const handleDeleteClick = () => {
		void handleDelete()
	}

	return (
		<section className='grid gap-6 lg:grid-cols-[1fr_420px]'>
			<div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm h-fit'>
				<h1 className='text-2xl font-semibold text-slate-950'>
					Профиль
				</h1>
				<dl className='mt-6 grid gap-4 text-sm'>
					<div>
						<dt className='font-medium text-slate-500'>Email</dt>
						<dd className='mt-1 text-slate-950'>{user.email}</dd>
					</div>
					<div>
						<dt className='font-medium text-slate-500'>Имя</dt>
						<dd className='mt-1 text-slate-950'>{user.name}</dd>
					</div>
					<div>
						<dt className='font-medium text-slate-500'>Роль</dt>
						<dd className='mt-1 text-slate-950'>{user.role}</dd>
					</div>
					<div>
						<dt className='font-medium text-slate-500'>
							Permissions
						</dt>
						<dd className='mt-2'>
							<PermissionList permissions={user.permissions} />
						</dd>
					</div>
				</dl>
			</div>
			<div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
				<h2 className='text-lg font-semibold text-slate-950'>
					Редактирование
				</h2>
				<form className='mt-4 grid gap-4' onSubmit={onSubmit}>
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
					<FormField label='Новый пароль' error={errors.new_password}>
						<input
							className='rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
							type='password'
							autoComplete='new-password'
							{...register('new_password')}
						/>
					</FormField>
					<FormField
						label='Повторить пароль'
						error={errors.confirm_password}
					>
						<input
							className='rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
							type='password'
							autoComplete='new-password'
							{...register('confirm_password')}
						/>
					</FormField>
					{message && (
						<p className='text-sm text-emerald-700'>{message}</p>
					)}
					{serverError && (
						<p className='text-sm text-red-600'>{serverError}</p>
					)}
					<button
						disabled={isSubmitting}
						className='rounded-md bg-slate-950 px-4 py-2 font-medium text-white disabled:opacity-60'
					>
						{isSubmitting ? 'Сохраняем...' : 'Сохранить'}
					</button>
				</form>
				<button
					onClick={handleDeleteClick}
					className='mt-6 w-full rounded-md border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50'
				>
					Удалить аккаунт
				</button>
			</div>
		</section>
	)
}
