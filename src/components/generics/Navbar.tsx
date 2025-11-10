import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { clearUser } from '../../store/slices/userSlice'
import { fetchLogout } from '../../lib/api'
import { toast } from 'sonner'

export const Navbar = () => {

  const { profilepic } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const defaultProfilePic = '/profile-placeholder.png'

  const handleLogout = async () => {
    dispatch(logout({}))
    dispatch(clearUser())
    await fetchLogout()
    toast.success('Se ha cerrado la sesion con exito')
    navigate('/login')
  }

  return (
    <nav className="bg-[#15232c] relative w-full h-[70px]">
      {/* Logo absoluto en la izquierda */}
      <div className="absolute h-[70px] left-0 top-0 w-[200px]">
        <img 
          alt="LumiCert Logo" 
          className="absolute inset-0 max-w-none object-cover object-center pointer-events-none size-full" 
          src="/lumicert-logo.png" 
        />
      </div>

      {/* Botón de login/perfil absoluto en la derecha */}
      <div className="absolute right-6 top-[12px]">
        { profilepic ? (
          <div className="relative group">
            <div className="bg-[#273b48] flex gap-3 h-[46px] items-center overflow-clip px-4 py-2 rounded-[25px] w-auto">
              <p className="font-medium leading-normal text-[16px] text-white">
                Perfil
              </p>
              <div className="flex h-[30px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[30px]">
                    <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
                      <img alt="" className="block max-w-none size-full" src="/divider.svg" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[34px] relative shrink-0 w-[34px]">
                <img 
                  alt="Perfil" 
                  className="block max-w-none size-full rounded-full object-cover" 
                  src={profilepic && profilepic.trim() !== '' ? profilepic : defaultProfilePic} 
                />
              </div>
            </div>
            <div className="absolute right-0 top-full mt-2 opacity-0 bg-[#273b48] group-hover:opacity-100 transition-opacity duration-200 hidden group-hover:block rounded-[15px] overflow-hidden min-w-[150px] z-50">
              <span 
                onClick={handleLogout} 
                className="block px-4 py-2 text-white hover:bg-[#1a2830] cursor-pointer text-sm"
              >
                Cerrar sesión
              </span>
            </div>
          </div>
        ) : (
          <Link to='/login'>
            <div className="bg-[#273b48] flex gap-3 h-[46px] items-center overflow-clip px-4 py-2 rounded-[25px] w-auto hover:bg-[#1a2830] transition">
              <p className="font-medium leading-normal text-[16px] text-white">
                Iniciar Sesión
              </p>
              <div className="flex h-[30px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[30px]">
                    <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
                      <img alt="" className="block max-w-none size-full" src="/divider.svg" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[34px] relative shrink-0 w-[34px]">
                <img 
                  alt="" 
                  className="block max-w-none size-full rounded-full object-cover" 
                  src={defaultProfilePic} 
                />
              </div>
            </div>
          </Link>
        )}
      </div>
    </nav>
  )
}

