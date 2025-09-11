import { Route, Routes } from 'react-router-dom'
import Navbar from './Navbar.tsx'
import News from './News'
import Profile from './Profile'
import UserAll from './UserAll.tsx'
import NewsAll from './NewsAll.tsx'

function Dashboard() {
	return (
		<>
			<Navbar />
			<main className='p-4'>
				<Routes>
					<Route path='/' element={<Profile />} />
					<Route path='/news' element={<News />} />
					<Route path='/userAll' element={<UserAll />} />
					<Route path='/newsAll' element={<NewsAll />} />
				</Routes>
			</main>
		</>
	)
}

export default Dashboard
