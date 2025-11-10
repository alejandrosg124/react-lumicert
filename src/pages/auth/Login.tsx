import { useState } from 'react'
import { LoginForm } from '../../components/auth/LoginForm'
import { Modal } from '../../components/primitives/Modal'
import { RegisterForm } from '../../components/auth/RegisterForm'

export const Login = () => {

  const [open, setOpen] = useState(false)

  // controls for modal
  const handleOpenModal = () => { setOpen(true) }
  const handleCloseModal = () => { setOpen(false) }

  return (
    <div className="flex h-screen bg-[#0a1219]">

      {/* image */}
      <div className="w-1/2 h-full">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834"
          alt="Fondo login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login lado derecho */}
      <div className="w-1/2 bg-[#0a1219] flex flex-col justify-center items-center">
        <section className="w-3/4 flex flex-col gap-10">

          {/* logo y título */}
          <div className="flex gap-4 justify-center items-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center">
              <img src="/lumicert-logo.png" alt="LumiCert Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-bold text-white text-6xl tracking-wide">LumiCert</h1>
          </div>

          <LoginForm />

          {/* create account */}
          <div className="flex flex-col gap-3">
            <hr className="border-[#273b48]" />
            <div className="flex justify-center gap-2 text-lg text-gray-300">
              <span>¿No tienes una cuenta?</span>
              <button
                onClick={handleOpenModal}
                className="hover:underline underline-offset-4 text-cyan-400 hover:text-cyan-300 transition"
              >
                Crear una cuenta
              </button>
            </div>
          </div>
        </section>

        {/* register modal */}
        {open && (
          <Modal title="¡Crea una cuenta!" isOpen={open} closeModal={handleCloseModal}>
            <RegisterForm closeModal={handleCloseModal} />
          </Modal>
        )}
      </div>
    </div>
  )
}
