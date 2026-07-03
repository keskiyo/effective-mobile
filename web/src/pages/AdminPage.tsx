import type { MouseEvent } from 'react'
import { useEffect, useState } from 'react'

import { getAdminUsers, updateAdminUser } from '../api/admin'
import { PermissionList } from '../components/PermissionList'
import type { Permissions, User } from '../types/user'

const PRESETS: Record<'admin' | 'user', Permissions> = {
	admin: {
		projects: ['read', 'write', 'delete'],
		users: ['read', 'update'],
		admin: ['manage'],
	},
	user: {
		projects: ['read'],
	},
}

export function AdminPage() {
	const [users, setUsers] = useState<User[]>([])
	const [error, setError] = useState('')

	const loadUsers = async () => {
		setUsers(await getAdminUsers())
	}

	useEffect(() => {
		loadUsers().catch(() => setError('Не удалось загрузить пользователей'))
	}, [])

	const patchUser = async (user: User, patch: Partial<User>) => {
		setError('')
		try {
			const updated = await updateAdminUser(user.id, patch)
			setUsers(current =>
				current.map(item => (item.id === updated.id ? updated : item)),
			)
		} catch {
			setError('Не удалось обновить пользователя')
		}
	}

	const handlePresetClick = (event: MouseEvent<HTMLButtonElement>) => {
		const { userId, preset } = event.currentTarget.dataset
		if (preset !== 'admin' && preset !== 'user') {
			return
		}
		const user = users.find(item => item.id === userId)
		if (!user) {
			return
		}
		void patchUser(user, { permissions: PRESETS[preset], role: preset })
	}

	return (
		<section className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
			<h1 className='text-2xl font-semibold text-slate-950'>Админка</h1>
			<p className='mt-2 text-sm text-slate-600'>
				Управление ролью, permissions и активностью пользователей.
			</p>
			{error && (
				<p className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>
					{error}
				</p>
			)}
			<div className='mt-6 overflow-x-auto'>
				<table className='w-full min-w-[920px] border-collapse text-left text-sm'>
					<thead>
						<tr className='border-b border-slate-200 text-slate-500'>
							<th className='py-3 pr-4 font-medium'>Email</th>
							<th className='py-3 pr-4 font-medium'>Имя</th>
							<th className='py-3 pr-4 font-medium'>Роль</th>
							<th className='py-3 pr-4 font-medium'>Активен</th>
							<th className='py-3 pr-4 font-medium'>
								Permissions
							</th>
							<th className='py-3 pr-4 font-medium'>Действия</th>
						</tr>
					</thead>
					<tbody>
						{users.map(user => (
							<tr
								key={user.id}
								className='border-b border-slate-100 align-top'
							>
								<td className='py-4 pr-4 font-medium text-slate-950'>
									{user.email}
								</td>
								<td className='py-4 pr-4'>{user.name}</td>
								<td className='py-4 pr-4'>
									<select
										value={user.role}
										onChange={event => {
											const role = event.target.value as
												| 'admin'
												| 'user'
											void patchUser(user, {
												role,
												permissions: PRESETS[role],
											})
										}}
										className='rounded-md border border-slate-300 px-2 py-1'
									>
										<option value='user'>user</option>
										<option value='admin'>admin</option>
									</select>
								</td>
								<td className='py-4 pr-4'>
									<input
										type='checkbox'
										checked={user.is_active}
										onChange={event =>
											void patchUser(user, {
												is_active: event.target.checked,
											})
										}
										className='h-4 w-4'
										aria-label={`Активность ${user.email}`}
									/>
								</td>
								<td className='py-4 pr-4'>
									<PermissionList
										permissions={user.permissions}
									/>
								</td>
								<td className='py-4 pr-4'>
									<div className='flex flex-wrap gap-2'>
										<button
											data-preset='user'
											data-user-id={user.id}
											onClick={handlePresetClick}
											className='rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:bg-slate-50'
										>
											User preset
										</button>
										<button
											data-preset='admin'
											data-user-id={user.id}
											onClick={handlePresetClick}
											className='rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:bg-slate-50'
										>
											Admin preset
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}
