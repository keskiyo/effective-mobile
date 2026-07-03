import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { LoginPayload, loginUser, logoutUser } from '../api/auth'
import { TOKEN_STORAGE_KEY } from '../api/axios'
import { getMe } from '../api/users'
import type { User } from '../types/user'

type AuthContextValue = {
	token: string | null
	user: User | null
	loading: boolean
	login: (payload: LoginPayload) => Promise<void>
	logout: () => Promise<void>
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(() =>
		localStorage.getItem(TOKEN_STORAGE_KEY),
	)
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	const refreshUser = useCallback(async () => {
		if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
			setUser(null)
			setLoading(false)
			return
		}
		setLoading(true)
		try {
			setUser(await getMe())
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		void refreshUser()
	}, [refreshUser])

	const login = useCallback(
		async (payload: LoginPayload) => {
			const response = await loginUser(payload)
			localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token)
			setToken(response.access_token)
			await refreshUser()
		},
		[refreshUser],
	)

	const logout = useCallback(async () => {
		try {
			await logoutUser()
		} catch {
			// Stateless JWT logout is completed locally even if the network request fails.
		}
		localStorage.removeItem(TOKEN_STORAGE_KEY)
		setToken(null)
		setUser(null)
	}, [])

	const value = useMemo(
		() => ({ token, user, loading, login, logout, refreshUser }),
		[token, user, loading, login, logout, refreshUser],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used inside AuthProvider')
	}
	return context
}

export function useLogoutAndRedirect() {
	const auth = useAuth()
	const navigate = useNavigate()
	return useCallback(async () => {
		await auth.logout()
		navigate('/login', { replace: true })
	}, [auth, navigate])
}
