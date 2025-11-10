import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/generics/Navbar'
import { Footer } from '../components/generics/Footer'

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#15232c]">
      <Navbar />

      <main className='flex-1 bg-[#15232c]'>
        <Outlet />
      </main>

      <Footer />
      
    </div>
  )
}
