import type { Project } from '../types/project'
import { api } from './axios'

export async function getProjects(): Promise<Project[]> {
	const { data } = await api.get<Project[]>('/projects')
	return data
}

export async function createProject(
	payload: Pick<Project, 'name' | 'description'>,
): Promise<Project> {
	const { data } = await api.post<Project>('/projects', payload)
	return data
}
