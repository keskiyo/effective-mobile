import type { Permissions, User } from '../types/user'
import { api } from './axios'

export type AdminUserUpdate = {
	name?: string
	role?: 'admin' | 'user'
	permissions?: Permissions
	is_active?: boolean
}

export async function getAdminUsers(): Promise<User[]> {
	const { data } = await api.get<User[]>('/admin/users')
	return data
}

export async function updateAdminUser(
	userId: string,
	payload: AdminUserUpdate,
): Promise<User> {
	const { data } = await api.patch<User>(`/admin/users/${userId}`, payload)
	return data
}
