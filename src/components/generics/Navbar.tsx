import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { clearUser } from '../../store/slices/userSlice'
import { fetchLogout } from '../../lib/api'
import { toast } from 'sonner'

export const Navbar = () => {

  const { profilepic, name } = useSelector((state: RootState) => state.user)
  const { status } = useSelector((state: RootState) => state.auth)
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
    <nav className="bg-[#15232c] relative w-full h-[70px] flex items-center justify-center z-50">
      {/* Logo absoluto en la izquierda */}
      <div className="absolute left-0 h-[70px] w-[200px]">
        <img
          alt="LumiCert Logo"
          className="max-w-none object-cover object-center pointer-events-none size-full"
          src="/lumicert-logo.png"
        />
      </div>

      {/* Menú de navegación centrado */}
      <div className="flex gap-6">
        <Link
          to="/"
          className="text-white hover:text-blue-400 font-medium text-[16px] transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/sectores"
          className="text-white hover:text-blue-400 font-medium text-[16px] transition-colors"
        >
          Configuración de Sectores
        </Link>
      </div>

      {/* Botón de login/perfil absoluto en la derecha */}
      <div className="absolute right-6 top-[12px]">
        {status === 'authenticated' ? (
          <div
            onClick={handleLogout}
            className="bg-[#273b48] flex gap-3 h-[46px] items-center overflow-clip px-4 py-2 rounded-[25px] w-auto hover:bg-[#1a2830] transition-all duration-300 ease-in-out cursor-pointer group"
          >
            <p className="font-medium leading-normal text-[16px] text-white transition-all duration-300">
              <span className="group-hover:hidden">{name || 'Usuario'}</span>
              <span className="hidden group-hover:inline">Cerrar sesión</span>
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

