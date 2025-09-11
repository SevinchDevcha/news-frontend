import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Dashboard from './components/Dashboard.tsx'
import Login from './components/Login.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import Register from './components/Register.tsx'
import Admin from './components/Admin.tsx'

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='/admin' element={<Admin />} />
				<Route
					path='/dashboard/*'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
			</Routes>
			<ToastContainer />
		</>
	)
}

export default App
