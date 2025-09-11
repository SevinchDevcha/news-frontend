import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API_URL from '../config'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!email || !password) {
      toast.error("Email va parolni to'ldiring!")
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, { email, password })
      if (data.success) {
        localStorage.setItem('token', data.data)
        toast.success("Tizimga kirildi ✅")
        navigate('/dashboard')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login Error:", error.response?.data)
        const message =
          error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          "Xatolik yuz berdi"
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              login()
            }}
          >
            <div>
              <label>Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Parol</label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between text-sm">
              <Link to="/" className="text-blue-950 underline">Sign up</Link>
              <Link to="/admin" className="text-blue-950 underline">Are you an admin?</Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Confirm"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
