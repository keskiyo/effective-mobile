import type { User } from '../types/user'
import { api } from './axios'

export type RegisterPayload = {
	name: string
	email: string
	password: string
	confirm_password: string
}

export type LoginPayload = {
	email: string
	password: string
}

export type TokenResponse = {
	access_token: string
	token_type: 'bearer'
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
	const { data } = await api.post<User>('/auth/register', payload)
	return data
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
	const { data } = await api.post<TokenResponse>('/auth/login', payload)
	return data
}

export async function logoutUser(): Promise<void> {
	await api.post('/auth/logout')
}
