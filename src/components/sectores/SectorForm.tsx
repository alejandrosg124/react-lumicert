import { useState } from 'react'
import type { Sector } from '../../lib/api'

interface SectorFormProps {
    sector?: Sector
    onSave: (nombre: string, zona: string) => void
    onCancel: () => void
}

export const SectorForm = ({ sector, onSave, onCancel }: SectorFormProps) => {
    const [nombre, setNombre] = useState(sector?.nombre || '')
    const [zona, setZona] = useState(sector?.zona || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim() || !zona.trim()) {
            alert('Por favor completa todos los campos')
            return
        }
        onSave(nombre, zona)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a2936] rounded-[20px] p-8 max-w-md w-full mx-4">
                <h2 className="text-white text-[24px] font-bold mb-6">
                    {sector ? 'Editar Sector' : 'Crear Nuevo Sector'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-white text-[14px] font-semibold mb-2 block">
                            Nombre del Sector
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-[#2a3d4d] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            placeholder="Ej: Valle del Lili"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-white text-[14px] font-semibold mb-2 block">
                            Zona
                        </label>
                        <input
                            type="text"
                            value={zona}
                            onChange={(e) => setZona(e.target.value)}
                            className="w-full bg-[#2a3d4d] text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            placeholder="Ej: Norte"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            {sector ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
