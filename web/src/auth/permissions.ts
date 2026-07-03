import type { User } from '../types/user'

export function hasPermission(
	user: User | null,
	resource: string,
	action: string,
): boolean {
	return Boolean(user?.permissions?.[resource]?.includes(action))
}
