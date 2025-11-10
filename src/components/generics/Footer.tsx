export const Footer = () => {
  return (
    <footer className="bg-[#15232c] relative w-full h-[200px]">
      {/* Logo absoluto en la izquierda */}
      <div className="absolute h-[70px] left-0 top-[65px] w-[200px]">
        <img 
          alt="LumiCert Logo" 
          className="absolute inset-0 max-w-none object-cover object-center pointer-events-none size-full" 
          src="/lumicert-logo.png" 
        />
      </div>

      {/* Frame Creadores absoluto en la derecha */}
      <div className="absolute bg-[#273b48] box-border flex flex-col h-auto items-start justify-center leading-[0] right-6 overflow-clip px-6 py-4 rounded-[20px] text-white top-[30px] min-w-[280px]">
        <div className="flex flex-col font-semibold justify-center relative text-[16px] mb-2">
          <p className="leading-normal">Creadores</p>
        </div>
        <div className="flex flex-col font-medium justify-center leading-tight relative text-[13px]">
          <p className="mb-1">Daniel Sanchez Collazos</p>
          <p className="mb-1">Alejandro Solarte Gaitán</p>
          <p className="mb-1">Natalia Paredes Cambindo</p>
          <p className="mb-1">Dilan Steven Molina Castro</p>
          <p>Johan Sebastián Hernandez</p>
        </div>
      </div>
    </footer>
  )
}
