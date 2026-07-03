import type { FieldError } from 'react-hook-form'

type Props = {
	label: string
	error?: FieldError
	children: React.ReactNode
}

export function FormField({ label, error, children }: Props) {
	return (
		<label className='grid gap-2 text-sm font-medium text-slate-700'>
			{label}
			{children}
			{error && (
				<span className='text-sm font-normal text-red-600'>
					{error.message}
				</span>
			)}
		</label>
	)
}
