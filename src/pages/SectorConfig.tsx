import { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { fetchSectores, fetchLuminarias, createSector, updateSector, deleteSector, linkLuminariasToSector, type Sector, type Luminaria } from '../lib/api'
import { SectorForm } from '../components/sectores/SectorForm'
import { LuminariasAssignment } from '../components/sectores/LuminariasAssignment'

export const SectorConfig = () => {
    const [sectores, setSectores] = useState<Sector[]>([])
    const [luminarias, setLuminarias] = useState<Luminaria[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingSector, setEditingSector] = useState<Sector | null>(null)
    const [assigningSector, setAssigningSector] = useState<Sector | null>(null)

    const loadData = async () => {
        try {
            const [sectoresData, luminariasData] = await Promise.all([
                fetchSectores(),
                fetchLuminarias()
            ])
            setSectores(sectoresData.data)
            setLuminarias(luminariasData.data)
        } catch (error) {
            console.error('Error al cargar datos:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleCreateSector = async (nombre: string, zona: string) => {
        try {
            await createSector({ nombre, zona })
            setShowCreateForm(false)
            await loadData()
        } catch (error) {
            console.error('Error al crear sector:', error)
            toast.error('Error al crear el sector')
        }
    }

    const handleUpdateSector = async (id: string, nombre: string, zona: string) => {
        try {
            await updateSector(id, { nombre, zona })
            setEditingSector(null)
            await loadData()
        } catch (error) {
            console.error('Error al actualizar sector:', error)
            toast.error('Error al actualizar el sector')
        }
    }

    const handleDeleteSector = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este sector?')) return

        try {
            await deleteSector(id)
            await loadData()
        } catch (error) {
            console.error('Error al eliminar sector:', error)
            toast.error('Error al eliminar el sector')
        }
    }

    const handleAssignLuminarias = async (sectorId: string, luminariaIds: string[]) => {
        if (!sectorId) {
            toast.error('Error: ID del sector no válido')
            return
        }

        try {
            console.log('Enviando asignación al servidor:', {
                url: `/api/sectores/${sectorId}/luminarias`,
                method: 'PUT',
                body: { luminarias: luminariaIds }
            })

            const response = await linkLuminariasToSector(sectorId, { luminarias: luminariaIds })

            if (response.success) {
                console.log('✅ Asignación exitosa:', response)
                // Primero recargamos los datos para actualizar la UI
                await loadData()
                // Luego cerramos el modal para que el usuario vea los cambios
                setAssigningSector(null)
            } else {
                throw new Error(response.message || 'Error en la respuesta del servidor')
            }
        } catch (error) {
            console.error('❌ Error detallado al asignar:', error)
            toast.error(`No se pudo asignar las luminarias: ${error instanceof Error ? error.message : 'Error de conexión'}`)
        }
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen relative bg-[#0a1219] flex items-center justify-center">
                <div className="text-white text-2xl">Cargando...</div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen relative">
            {/* Background image - full screen */}
            <div className="fixed inset-0 w-full h-full z-0">
                <img
                    src="/LumiCertLogin.jpg"
                    alt="Fondo sectores"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Overlay oscuro */}
            <div className="fixed inset-0 bg-black/30 z-0"></div>

            <div className="relative z-10 p-6 max-w-6xl mx-auto">
                <Toaster position="top-right" />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-white text-[32px] font-bold">Configuración de Sectores</h1>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-[#2a3d4d] hover:bg-[#394d5c] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg backdrop-blur-sm"
                    >
                        + Crear Nuevo Sector
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectores.map((sector) => {
                        const sectorLuminarias = luminarias.filter(l => l.id_sector === sector._id)

                        return (
                            <div key={sector._id} className="bg-[#1a2936]/70 backdrop-blur-sm rounded-[20px] p-6 shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white text-[20px] font-bold">{sector.nombre}</h3>
                                        <p className="text-gray-300 text-[14px]">Zona: {sector.zona}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingSector(sector)}
                                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium transition-colors border border-blue-500/30"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSector(sector._id!)}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-full text-xs font-medium transition-colors border border-red-500/30"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-300 text-[14px] mb-2">
                                        Luminarias: {sectorLuminarias.length}
                                    </p>
                                    {sectorLuminarias.length > 0 && (
                                        <div className="bg-[#2a3d4d]/60 rounded-lg p-3 max-h-[100px] overflow-y-auto border border-white/5">
                                            {sectorLuminarias.map(lum => (
                                                <div key={lum._id} className="text-gray-300 text-[12px]">
                                                    • {lum.id_lum}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setAssigningSector(sector)}
                                    className="w-full bg-[#2a3d4d] hover:bg-[#394d5c] text-white px-4 py-2 rounded-lg text-[14px] font-semibold transition-colors shadow-md border border-white/5"
                                >
                                    Asignar Luminarias
                                </button>
                            </div>
                        )
                    })}
                </div>

                {sectores.length === 0 && (
                    <div className="text-center text-gray-400 py-12 bg-[#1a2936]/50 backdrop-blur-sm rounded-[20px]">
                        <p className="text-[18px]">No hay sectores creados</p>
                        <p className="text-[14px] mt-2">Crea tu primer sector para comenzar</p>
                    </div>
                )}
            </div>

            {/* Modal Crear Sector */}
            {showCreateForm && (
                <SectorForm
                    onSave={handleCreateSector}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            {/* Modal Editar Sector */}
            {editingSector && (
                <SectorForm
                    sector={editingSector}
                    onSave={(nombre: string, zona: string) => handleUpdateSector(editingSector._id!, nombre, zona)}
                    onCancel={() => setEditingSector(null)}
                />
            )}

            {/* Modal Asignar Luminarias */}
            {assigningSector && (
                <LuminariasAssignment
                    sector={assigningSector}
                    allLuminarias={luminarias}
                    onSave={(luminariaIds: string[]) => handleAssignLuminarias(assigningSector._id!, luminariaIds)}
                    onCancel={() => setAssigningSector(null)}
                />
            )}
        </div>
    )
}
