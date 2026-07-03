import { useEffect, useState } from 'react'

import { createProject, getProjects } from '../api/projects'
import { useAuth } from '../auth/AuthContext'
import { hasPermission } from '../auth/permissions'
import type { Project } from '../types/project'

export function ProjectsPage() {
	const { user } = useAuth()
	const [projects, setProjects] = useState<Project[]>([])
	const [error, setError] = useState('')
	const canCreate = hasPermission(user, 'projects', 'write')

	useEffect(() => {
		getProjects()
			.then(setProjects)
			.catch(() => setError('Недостаточно прав'))
	}, [])

	const handleCreate = async () => {
		setError('')
		try {
			const project = await createProject({
				name: 'New Project',
				description: 'Mock created project',
			})
			setProjects(current => [project, ...current])
		} catch {
			setError('Недостаточно прав для создания проекта')
		}
	}

	const handleCreateClick = () => {
		void handleCreate()
	}

	return (
		<section className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
			<div className='flex flex-wrap items-start justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-slate-950'>
						Проекты
					</h1>
					<p className='mt-2 text-sm text-slate-600'>
						Mock-ресурс, защищенный реальными permissions из БД.
					</p>
				</div>
				{canCreate && (
					<button
						onClick={handleCreateClick}
						className='rounded-md bg-slate-950 px-4 py-2 font-medium text-white'
					>
						Создать mock-проект
					</button>
				)}
			</div>
			{error && (
				<p className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>
					{error}
				</p>
			)}
			<div className='mt-6 grid gap-4 md:grid-cols-2'>
				{projects.map(project => (
					<article
						key={project.id}
						className='rounded-lg border border-slate-200 p-4'
					>
						<h2 className='font-semibold text-slate-950'>
							{project.name}
						</h2>
						<p className='mt-2 text-sm text-slate-600'>
							{project.description}
						</p>
						<p className='mt-4 text-xs font-medium uppercase tracking-wide text-slate-400'>
							{project.id}
						</p>
					</article>
				))}
			</div>
		</section>
	)
}
