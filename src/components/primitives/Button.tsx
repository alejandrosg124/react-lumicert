import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: 'primary' | 'secondary'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ 
  intent = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed'
  const intentStyles = {
    primary: 'bg-gradient-to-r from-cyan-400 to-teal-500 text-white hover:from-cyan-500 hover:to-teal-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-[#1a2936] text-white hover:bg-[#273b48] border border-[#273b48]'
  }

  return (
    <button 
      className={`${baseStyles} ${intentStyles[intent]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
