import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../config'
import img from '../../public/images/news-1028793_960_720-1.jpg'
import { Button } from './ui/button'

interface accaunt {
	name: string
	email: string
}

function Profile() {
	const [accaunt, setAccaunt] = useState<accaunt | null>(null)
	const [role, setRole] = useState(false)
	const navigate = useNavigate()

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

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) profile(token)
		else navigate('/')
	}, [])

	return (
		<div className='w-full min-h-screen px-10 py-5 space-y-10 bg-white'>
			<div className='flex flex-col md:flex-row items-center justify-between gap-10 ml-10'>
				{/* Text section */}
				<div className='md:w-1/2 space-y-6'>
					<h1 className='text-3xl md:text-6xl font-bold leading-tight text-gray-800'>
						Welcome to <span className='text-blue-600'>news app</span>,{' '}
						{accaunt && <span className='text-pink-600'>{accaunt.name}</span>}
					</h1>
					<p className='text-gray-600 text-lg'>
					Welcome to Sevinch's news site, you can leave him a message. This site is very important to him!
					</p>
					<div className='flex justify-around'>
						<Link to={'/dashboard/news'}>
							<Button>News</Button>
						</Link>
						{role && (
							<Link to={'/dashboard/userAll'}>
								<Button>Users</Button>
							</Link>
						)}
					</div>
				</div>

				{/* Image section */}
				<div className='md:w-1/2 flex justify-center'>
					<img
						src={img}
						alt='news'
						className='w-[350px] md:w-[400px] rounded-2xl border shadow-lg object-contain'
					/>
				</div>
			</div>
		</div>
	)
}

export default Profile
