import API_URL from '@/config'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Users {
  name: string
  email: string
  role: string
  created_at: string
  news: string[]
  _id?: string
}

function UserAll() {
  const [userAll, setUserAll] = useState<Users[]>([])
  const [total, setTotal] = useState('')

  const users = async () => {
    try {
      const { data } = await axios.get(API_URL + '/user/userAll', {
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

  const deleteUser = async (id: string) => {
    if (!window.confirm("Bu foydalanuvchini o‘chirishni xohlaysizmi?")) return

    try {
      const { data } = await axios.delete(API_URL + `/user/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (data.success) {
        users()
        toast.success(data.msg)
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

  useEffect(() => {
    users()
  }, [])

  return (
    <div className='relative min-h-scree px-4 sm:px-10 '>
      <h1 className='text-center text-2xl py-4 font-semibold'>
        Number of users : {total}
      </h1>

      <div className='flex justify-center py-4'>
        <div className='w-full max-w-2xl space-y-6'>
          {userAll.map((item, index) => (
            <Accordion
              key={index}
              type='single'
              collapsible
              className='w-full'
              defaultValue='item-1'
            >
              <AccordionItem
                value={`item-${index}`}
                className='flex items-center justify-between gap-4 p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition duration-200'
              >
                <div className='flex items-center gap-4 flex-1'>
                  <AccordionTrigger className='[&>svg]:w-5 [&>svg]:h-5 flex-1'>
                    <img
                      src={`https://ui-avatars.com/api/?name=${item.name}&background=random&color=fff`}
                      alt={item.name}
                      className='w-14 h-14 rounded-full object-cover'
                    />
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {item.name}
                      </h3>
                      <p className='text-sm text-gray-500'>{item.email}</p>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className='flex flex-col gap-3 text-sm mt-2'>
                    <p>Role : {item.role}</p>
                    <p>Number of news items : {item.news.length}</p>
                    <p>
                      {item.role} created date:{' '}
                      {(() => {
                        const d = new Date(item.created_at)
                        const day = String(d.getDate()).padStart(2, '0')
                        const month = String(d.getMonth() + 1).padStart(2, '0')
                        const year = d.getFullYear()
                        const hours = String(d.getHours()).padStart(2, '0')
                        const minutes = String(d.getMinutes()).padStart(2, '0')
                        return `${day}.${month}.${year} , ${hours}:${minutes}`
                      })()}
                    </p>
                  </AccordionContent>
                </div>
                <Button
                  variant='destructive'
                  size='icon'
                  className='rounded-full'
                  onClick={() => deleteUser(`${item._id}`)}
                >
                  <Trash className='w-5 h-5' />
                </Button>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserAll
