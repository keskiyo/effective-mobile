import type { User } from '../types/user'
import { api } from './axios'

export async function getMe(): Promise<User> {
	const { data } = await api.get<User>('/users/me')
	return data
}

export type UpdateMePayload = {
	name: string
	email: string
	new_password?: string
	confirm_password?: string
}

export async function updateMe(payload: UpdateMePayload): Promise<User> {
	const { data } = await api.put<User>('/users/me', payload)
	return data
}

export async function deleteMe(): Promise<void> {
	await api.delete('/users/me')
}
