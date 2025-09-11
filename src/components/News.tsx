import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import API_URL from '../config'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card'
import { Textarea } from './ui/textarea'

interface Users {
	_id: string
	title: string
	desc: string
	image: string
	created_at: string
}

function News() {
	const [title, setTitle] = useState('')
	const [desc, setDesc] = useState('')
	const [image, setImage] = useState('')
	const [news, setNews] = useState<Users[]>([])
	const [editId, setEditId] = useState('')
	const [editTitle, setEditTitle] = useState('')
	const [editDesc, setEditDesc] = useState('')
	const [editImage, setEditImage] = useState('')

	// ✅ Alohida upload statuslar
	const [isUploadingCreate, setIsUploadingCreate] = useState(false)
	const [uploadingEditId, setUploadingEditId] = useState<string | null>(null)

	const newsEndRef = useRef<HTMLDivElement>(null)
	const fileRef = useRef<HTMLInputElement | null>(null)

	// 🔹 GET ALL
	const getAll = async () => {
		try {
			const { data } = await axios.get(API_URL + '/news/get-all', {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			if (data.success) setNews(data.data)
		} catch {
			toast.error('Xatolik yuz berdi')
		}
	}

	// 🔹 ADD NEWS
	const addNews = async () => {
		try {
			const { data } = await axios.post(
				API_URL + '/news/add',
				{ title, desc, image },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			)
			if (data.success) {
				setTitle('')
				setDesc('')
				setImage('')
				if (fileRef.current) fileRef.current.value = ''
				getAll()
				toast.success(data.msg)
			}
			setTimeout(() => {
				newsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 300)
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error("Noma'lum xato yuz berdi")
			}
		}
		
	}

	// 🔹 DELETE NEWS
	const deleteNews = async (id: string) => {
    if (!window.confirm("Bu newsni o‘chirisni xohlaysizmi?")) return

		try {
			const { data } = await axios.delete(API_URL + `/news/delete/${id}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			if (data.success) {
				toast.success(data.msg)
				getAll()
			}
		} catch {
			toast.error('Xatolik yuz berdi')
		}
	}

	// 🔹 EDIT NEWS
	const editNews = async () => {
		try {
			const { data } = await axios.put(
				API_URL + `/news/update/${editId}`,
				{ title: editTitle, desc: editDesc, image: editImage },
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
				getAll()
			}
		} catch {
			toast.error('Xatolik yuz berdi')
		}
	}

	const saveEdit = (item: Users) => {
		setEditId(item._id)
		setEditTitle(item.title)
		setEditDesc(item.desc)
		setEditImage(item.image)
	}

	// 🔹 UPLOAD FILE
	const handleFile = async (
		file: File,
		isEdit = false,
		editItemId?: string
	) => {
		const formData = new FormData()
		formData.append('file', file)

		if (isEdit) {
			setUploadingEditId(editItemId || null)
		} else {
			setIsUploadingCreate(true)
		}

		try {
			const { data } = await axios.post(API_URL + '/upload/file', formData, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			if (data.success) {
				if (isEdit) setEditImage(data.file_path)
				else setImage(data.file_path)
			}
		} catch {
			toast.error('Xatolik yuz berdi')
		} finally {
			setIsUploadingCreate(false)
			setUploadingEditId(null)
		}
	}

	useEffect(() => {
		getAll()
	}, [])

	return (
		<div className='px-8 py-6'>
			{/* CREATE FORM */}
			<div className='w-full flex justify-center mb-10'>
				<Card className='w-full max-w-xl shadow-xl'>
					<CardHeader>
						<CardTitle className='text-3xl font-bold text-center text-pink-600'>
							Create News
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							className='space-y-4'
							onSubmit={e => {
								e.preventDefault()
								addNews()
							}}
						>
							<label>Title</label>
							<Input
								placeholder='Enter title...'
								value={title}
								onChange={e => setTitle(e.target.value)}
							/>
							<label>Description</label>
							<Textarea
								rows={3}
								placeholder='Enter description...'
								value={desc}
								onChange={e => setDesc(e.target.value)}
							/>
							<label>Image</label>
							<Input
								type='file'
								ref={fileRef}
								onChange={e => {
									const file = e.target.files?.[0]
									if (file) handleFile(file, false)
								}}
							/>
						</form>
					</CardContent>
					<CardFooter className='flex justify-end'>
						<Button
							onClick={addNews}
							disabled={isUploadingCreate}
							variant='pink'
						>
							{isUploadingCreate ? 'Uploading...' : 'Send'}
						</Button>
					</CardFooter>
				</Card>
			</div>

			{/* NEWS LIST */}
			<div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{news.map(item => (
					<Card key={item._id} className='shadow-md hover:shadow-lg transition'>
						{editId === item._id ? (
							<CardHeader className='space-y-3'>
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
										if (file) handleFile(file, true, item._id)
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
									className='w-full h-48 object-cover rounded-lg'
								/>
								<CardTitle>{item.title}</CardTitle>
								<CardDescription>{item.desc}</CardDescription>
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
						)}

						<CardFooter className='flex justify-between px-6 pb-4'>
							{editId === item._id ? (
								<>
									<Button
										variant='pink'
										onClick={editNews}
										disabled={uploadingEditId === item._id}
									>
										{uploadingEditId === item._id ? 'Uploading...' : 'Save'}
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

			<div ref={newsEndRef} />
		</div>
	)
}

export default News
