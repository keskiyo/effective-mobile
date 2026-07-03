import type { Permissions } from '../types/user'

export function PermissionList({ permissions }: { permissions: Permissions }) {
	return (
		<div className='flex flex-wrap gap-2'>
			{Object.entries(permissions).map(([resource, actions]) =>
				actions.map(action => (
					<span
						key={`${resource}:${action}`}
						className='rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'
					>
						{resource}:{action}
					</span>
				)),
			)}
		</div>
	)
}
