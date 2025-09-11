import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API_URL from '../config'

interface accaunt {
	name: string
	email: string
	role: string
}

function Navbar() {
	const [accaunt, setAccaunt] = useState<accaunt | null>(null)
	const navigate = useNavigate()
	const location = useLocation()
	const [role, setRole] = useState(false)

	const profile = async (token: string) => {
		try {
			const { data } = await axios.get(API_URL + '/user/profile', {
				headers: { Authorization: `Bearer ${token}` },
			})
			if (data.success) {
				setAccaunt(data.data)
			}
			if (data.role === 'admin') {
				setRole(true)
			}
		} catch {
			localStorage.removeItem('token')
			navigate('/')
		}
	}

	const logout = () => {
		localStorage.removeItem('token')
		toast.success('You have successfully signed out of your account.')
		navigate('/')
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) profile(token)
		else navigate('/')
	}, [])

	const linkClass = (path: string) =>
		location.pathname === path
			? 'text-blue-600 font-semibold'
			: 'text-gray-600 hover:text-blue-600 transition'

	return (
		<div className='w-full px-10 py-5 space-y-10 bg-white'>
			<header className='w-full bg-white shadow-sm px-10 py-4 flex items-center justify-between'>
				<Link to={'/dashboard'}>
					<h1 className='text-2xl font-bold text-blue-600'>News App</h1>
				</Link>

				<div className='flex items-center gap-20'>
					<div className='flex items-center gap-6'>
						<Link
							to={'/dashboard/news'}
							className={linkClass('/dashboard/news')}
						>
							News
						</Link>
						{role && (
							<div className='flex items-center gap-6'>
								<Link
								to={'/dashboard/userAll'}
								className={linkClass('/dashboard/userAll')}
							>
								Users
							</Link>
							<Link
							to={'/dashboard/newsAll'}
							className={linkClass('/dashboard/newsAll')}
						>
							NewsAll
						</Link>
							</div>
						)}
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className='cursor-pointer hover:scale-105 transition duration-200'>
								<AvatarImage
									src='https://github.com/shadcn.png'
									alt='@shadcn'
								/>
								<AvatarFallback className='bg-blue-500 text-white'>
									S
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							align='end'
							className='w-64 shadow-lg border border-gray-200 rounded-xl p-2 bg-white'
						>
							<DropdownMenuLabel className='text-gray-500 text-sm'>
								My Account
							</DropdownMenuLabel>
							<DropdownMenuSeparator />

							<DropdownMenuItem className='text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-md px-3 py-2'>
								<span className='font-medium'>Name:</span> &nbsp;
								{accaunt?.name}
							</DropdownMenuItem>

							<DropdownMenuItem className='text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-md px-3 py-2'>
								<span className='font-medium'>Email:</span> &nbsp;
								{accaunt?.email}
							</DropdownMenuItem>

							<DropdownMenuItem className='text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-md px-3 py-2'>
								<span className='font-medium'>Role:</span> &nbsp;
								{accaunt?.role}
							</DropdownMenuItem>

							<DropdownMenuItem
								className='text-red-600 hover:bg-red-50 rounded-md px-3 py-2 font-semibold cursor-pointer'
								onClick={logout}
							>
								Log out
								<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>
		</div>
	)
}

export default Navbar
