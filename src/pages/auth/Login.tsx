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
    <div className="relative flex h-screen w-full">

      {/* Background image - full screen */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/LumiCertLogin.jpg"
          alt="Fondo login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay oscuro para mejor legibilidad */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login form - centered with transparency */}
      <div className="relative z-10 w-full flex flex-col justify-center items-center">
        <section className="w-full max-w-md mx-auto flex flex-col gap-10 bg-[#15232c]/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl">

          {/* logo grande como título */}
          <div className="flex justify-center items-center">
            <div className="rounded-3xl">
              <img src="/lumicert-logo.png" alt="LumiCert Logo" className="w-full h-full object-contain rounded-3xl" />
            </div>
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
