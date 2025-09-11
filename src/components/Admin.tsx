import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API_URL from '../config'

export default function Admin() {
	const navigate = useNavigate()
	const [reg_key, setRegKey] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const signup_admin = async () => {
		try {
			const { data } = await axios.post(API_URL + '/user/signup_admin', {
				reg_key,
				name,
				email,
				password,
			})
			if (data.success) {
				toast.success(data.msg)
				localStorage.setItem('token', data.data) // <-- to'g'rilandi
				navigate('/dashboard')
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message ||
					error.response?.data?.msg ||
					'Xatolik yuz berdi'
				toast.error(message)
			}
		}
	}

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-50'>
			<Card className='w-full max-w-md shadow-xl rounded-2xl'>
				<CardHeader>
					<CardTitle className='text-center text-2xl'>Sign up admin </CardTitle>
				</CardHeader>
				<CardContent>
					<form className='space-y-4' onSubmit={e => e.preventDefault()}>
						<label>Key</label>
						<Input
							type='password'
							placeholder='********'
							value={reg_key}
							onChange={e => setRegKey(e.target.value)}
						/>
						<label>Name</label>
						<Input
							type='text'
							placeholder='Enter your name'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
						<label>Email</label>
						<Input
							type='email'
							placeholder='you@example.com'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<label>Parol</label>
						<Input
							type='password'
							placeholder='********'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<div className='flex justify-around'>
							<Link to={'/login'} className='ml-6 text-blue-950 underline'>
								Sign in
							</Link>
							<Link to={'/'} className='ml-6 text-blue-950 underline'>
								Sign up
							</Link>
						</div>
						<Button className='w-full' onClick={signup_admin}>
							Confirm
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
