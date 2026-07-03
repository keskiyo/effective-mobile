export type Permissions = Record<string, string[]>

export type User = {
	id: string
	email: string
	name: string
	role: 'admin' | 'user'
	permissions: Permissions
	is_active: boolean
	created_at?: string
	updated_at?: string
}
