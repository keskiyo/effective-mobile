import { z } from 'zod'

const passwordSchema = z
	.string()
	.min(8, 'Минимум 8 символов')
	.regex(/[A-Za-zА-Яа-я]/, 'Нужна хотя бы одна буква')
	.regex(/\d/, 'Нужна хотя бы одна цифра')

export const loginSchema = z.object({
	email: z.string().email('Введите корректный email'),
	password: z.string().min(1, 'Введите пароль'),
})

export const registerSchema = z
	.object({
		name: z.string().min(1, 'Введите имя'),
		email: z.string().email('Введите корректный email'),
		password: passwordSchema,
		confirm_password: z.string().min(1, 'Повторите пароль'),
	})
	.refine(data => data.password === data.confirm_password, {
		message: 'Пароли не совпадают',
		path: ['confirm_password'],
	})

export const profileSchema = z
	.object({
		name: z.string().min(1, 'Введите имя').max(255, 'Слишком длинное имя'),
		email: z.string().email('Введите корректный email'),
		new_password: z.string().optional(),
		confirm_password: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		const newPassword = data.new_password?.trim() ?? ''
		const confirmPassword = data.confirm_password?.trim() ?? ''

		if (!newPassword && !confirmPassword) {
			return
		}

		if (newPassword.length < 8) {
			ctx.addIssue({
				code: 'custom',
				message: 'Минимум 8 символов',
				path: ['new_password'],
			})
		}
		if (!/[A-Za-zА-Яа-я]/.test(newPassword)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Нужна хотя бы одна буква',
				path: ['new_password'],
			})
		}
		if (!/\d/.test(newPassword)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Нужна хотя бы одна цифра',
				path: ['new_password'],
			})
		}
		if (newPassword !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Пароли не совпадают',
				path: ['confirm_password'],
			})
		}
	})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>
