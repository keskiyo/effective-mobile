import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '../auth/ProtectedRoute'
import { RequireAdmin } from '../auth/RequireAdmin'
import { Layout } from '../components/Layout'
import { AdminPage } from '../pages/AdminPage'
import { ForbiddenPage } from '../pages/ForbiddenPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { RegisterPage } from '../pages/RegisterPage'
import { App } from './App'

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{ index: true, element: <App /> },
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <RegisterPage /> },
			{ path: 'forbidden', element: <ForbiddenPage /> },
			{
				element: <ProtectedRoute />,
				children: [
					{ path: 'profile', element: <ProfilePage /> },
					{ path: 'projects', element: <ProjectsPage /> },
					{
						element: <RequireAdmin />,
						children: [{ path: 'admin', element: <AdminPage /> }],
					},
				],
			},
			{ path: '*', element: <NotFoundPage /> },
		],
	},
])
