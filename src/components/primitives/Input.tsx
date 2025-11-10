import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ 
  text, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-1">
      {text && (
        <label className="text-sm font-medium text-gray-300">
          {text}
        </label>
      )}
      <input
        className={`px-4 py-3 bg-[#1a2936] border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ${
          error ? 'border-red-500' : 'border-[#273b48]'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  )
}
