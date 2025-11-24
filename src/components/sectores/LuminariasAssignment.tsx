import { useState, useEffect } from 'react'
import type { Sector, Luminaria } from '../../lib/api'

interface LuminariasAssignmentProps {
    sector: Sector
    allLuminarias: Luminaria[]
    onSave: (luminariaIds: string[]) => void
    onCancel: () => void
}

export const LuminariasAssignment = ({ sector, allLuminarias, onSave, onCancel }: LuminariasAssignmentProps) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    useEffect(() => {
        // Inicializar con las luminarias ya asignadas al sector
        // Usamos id_lum para la selección
        const assigned = allLuminarias
            .filter(l => l.id_sector === sector._id)
            .map(l => l.id_lum)
        setSelectedIds(assigned)
    }, [sector, allLuminarias])

    const handleToggle = (luminariaId: string) => {
        setSelectedIds(prev => {
            if (prev.includes(luminariaId)) {
                return prev.filter(id => id !== luminariaId)
            } else {
                return [...prev, luminariaId]
            }
        })
    }

    const handleSave = () => {
        onSave(selectedIds)
    }

    // Filtramos usando id_lum para consistencia
    const availableLuminarias = allLuminarias.filter(l => !l.id_sector || l.id_sector === sector._id)
    const assignedLuminarias = allLuminarias.filter(l => selectedIds.includes(l.id_lum))
    const unassignedLuminarias = availableLuminarias.filter(l => !selectedIds.includes(l.id_lum))

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a2936] rounded-[20px] p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-white text-[24px] font-bold mb-6">
                    Asignar Luminarias a {sector.nombre}
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Luminarias Disponibles */}
                    <div>
                        <h3 className="text-white text-[18px] font-semibold mb-3">
                            Disponibles ({unassignedLuminarias.length})
                        </h3>
                        <div className="bg-[#2a3d4d] rounded-lg p-4 max-h-[400px] overflow-y-auto">
                            {unassignedLuminarias.length === 0 ? (
                                <p className="text-gray-400 text-[14px] text-center py-4">
                                    No hay luminarias disponibles
                                </p>
                            ) : (
                                unassignedLuminarias.map(lum => (
                                    <div
                                        key={lum._id}
                                        onClick={() => handleToggle(lum.id_lum)}
                                        className="bg-[#3d5161] hover:bg-[#4d6171] rounded-lg p-3 mb-2 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-[14px]">{lum.id_lum}</span>
                                            <button className="text-green-400 text-[20px]">+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Luminarias Asignadas */}
                    <div>
                        <h3 className="text-white text-[18px] font-semibold mb-3">
                            Asignadas ({assignedLuminarias.length})
                        </h3>
                        <div className="bg-[#2a3d4d] rounded-lg p-4 max-h-[400px] overflow-y-auto">
                            {assignedLuminarias.length === 0 ? (
                                <p className="text-gray-400 text-[14px] text-center py-4">
                                    No hay luminarias asignadas
                                </p>
                            ) : (
                                assignedLuminarias.map(lum => (
                                    <div
                                        key={lum._id}
                                        onClick={() => handleToggle(lum.id_lum)}
                                        className="bg-[#3d5161] hover:bg-[#4d6171] rounded-lg p-3 mb-2 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-white text-[14px]">{lum.id_lum}</span>
                                            <button className="text-red-400 text-[20px]">−</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Guardar Asignación
                    </button>
                </div>
            </div>
        </div>
    )
}
