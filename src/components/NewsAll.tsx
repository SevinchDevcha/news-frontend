import API_URL from '@/config'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface Users {
	_id: string
	title: string
	desc: string
	image: string
	created_at: string
	user: {
		name: string
		email: string
		role: string
	}
}

function NewsAll() {
	const [userAll, setUserAll] = useState<Users[]>([])
	const [total, setTotal] = useState('')
	const [editId, setEditId] = useState('')
	const [editTitle, setEditTitle] = useState('')
	const [editDesc, setEditDesc] = useState('')
	const [editImage, setEditImage] = useState('')
	const [isUploading, setIsUploading] = useState(false)

	const news = async () => {
		try {
			const { data } = await axios.get(API_URL + '/news/newsAll', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			if (data.success) {
				setUserAll(data.data)
				setTotal(data.pagination.total)
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

	const handleFile = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)
		setIsUploading(true)
		try {
			const { data } = await axios.post(API_URL + '/upload/file', formData, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			if (data.success) {
				setEditImage(data.file_path)
				toast.success('Rasm yuklandi ✅')
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message ||
					error.response?.data?.msg ||
					'Xatolik yuz berdi'
				toast.error(message)
			}
		} finally {
			setIsUploading(false)
		}
	}

	const deleteNews = async (id: string) => {
    if (!window.confirm("Bu newsni o‘chirishni xohlaysizmi?")) return
		try {
			const { data } = await axios.delete(API_URL + `/news/delete/${id}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			if (data.success) {
				toast.success(data.msg)
				news()
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

	const editNews = async () => {
		try {
			const { data } = await axios.put(
				API_URL + `/news/update/${editId}`,
				{
					title: editTitle,
					desc: editDesc,
					image: editImage,
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			)
			if (data.success) {
				toast.success(data.msg)
				setEditId('')
				setEditTitle('')
				setEditDesc('')
				setEditImage('')
				news()
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

	const saveEdit = (item: Users) => {
		setEditId(item._id)
		setEditTitle(item.title)
		setEditDesc(item.desc)
		setEditImage(item.image) // eski rasmni ham saqlaymiz
	}

	useEffect(() => {
		news()
	}, [])

	return (
		<div className='relative min-h-scree px-4 sm:px-10'>
			<h1 className='text-center text-2xl py-4'>Number of news : {total}</h1>

			<div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{userAll.map(item => (
					<Card key={item._id} className='shadow-md hover:shadow-lg transition'>
						{editId === item._id ? (
							<CardHeader className='space-y-2'>
								<Input
									defaultValue={item.title}
									onChange={e => setEditTitle(e.target.value)}
								/>
								<Textarea
									defaultValue={item.desc}
									rows={3}
									onChange={e => setEditDesc(e.target.value)}
								/>
								<Input
									type='file'
									onChange={e => {
										const file = e.target.files?.[0]
										if (file) handleFile(file)
									}}
								/>
								{editImage && (
									<img
										src={editImage}
										alt='preview'
										className='w-full h-32 object-cover rounded-lg'
									/>
								)}
							</CardHeader>
						) : (
							<CardHeader className='space-y-2'>
								<img
									src={item.image}
									alt={item.title}
									className='w-full h-48 object-cover rounded-lg shadow-sm hover:scale-105 transition'
								/>
								<CardTitle className='text-lg'>Title : {item.title}</CardTitle>
								<CardDescription>Desc : {item.desc}</CardDescription>
								<CardHeader className='border-1 p-3 rounded-lg hover:shadow-lg transition'>
									<CardTitle>{`${item.user?.role}`.toUpperCase()}</CardTitle>
									<CardDescription>Name : {item.user?.name}</CardDescription>
									<CardDescription>Email : {item.user?.email}</CardDescription>
									<CardDescription>
										news created date : {' '}
										{(() => {
											const d = new Date(item.created_at)

											const day = String(d.getDate()).padStart(2, '0')
											const month = String(d.getMonth() + 1).padStart(2, '0')
											const year = d.getFullYear()

											const hours = String(d.getHours()).padStart(2, '0')
											const minutes = String(d.getMinutes()).padStart(2, '0')

											return `${day}.${month}.${year} , ${hours}:${minutes}`
										})()}
									</CardDescription>
								</CardHeader>
							</CardHeader>
						)}

						<CardFooter className='flex justify-between px-6 pb-4'>
							{editId === item._id ? (
								<>
									<Button
										variant='pink'
										onClick={editNews}
										disabled={isUploading}
									>
										{isUploading ? 'Uploading...' : 'Save'}
									</Button>
									<Button variant='outline' onClick={() => setEditId('')}>
										Cancel
									</Button>
								</>
							) : (
								<>
									<Button variant='outline' onClick={() => saveEdit(item)}>
										Edit
									</Button>
									<Button
										variant='destructive'
										onClick={() => deleteNews(item._id)}
									>
										Delete
									</Button>
								</>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}

export default NewsAll
