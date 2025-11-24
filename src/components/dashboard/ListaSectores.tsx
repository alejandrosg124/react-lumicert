import {
  type SectoresResponse,
  type EstadisticasResponse,
  fetchSectores,
  fetchEstadisticas
} from '../../lib/api'
import { useEffect, useState } from 'react'

export const ListaSectores = () => {

  const [loading, setLoading] = useState(true)
  const [sectores, setSectores] = useState<SectoresResponse['data']>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasResponse['data'] | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('Iniciando carga de datos...')
        const [
          sectoresData,
          estadisticasData
        ] = await Promise.all([
          fetchSectores(),
          fetchEstadisticas()
        ])

        console.log('Datos recibidos:', {
          sectores: sectoresData,
          estadisticas: estadisticasData
        })

        setSectores(sectoresData.data)
        setEstadisticas(estadisticasData.data)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  },
    [])
  if (loading) return <div>Cargando...</div>

  return (
    <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
      <h2 className="text-white text-[28px] font-bold mb-4">Sectores</h2>

      <div className="bg-[#394d5c]/60 rounded-[15px] p-4 mb-4 max-h-[200px] overflow-y-auto">
        {sectores.length > 0 ? (
          sectores.map((sector, index) => (
            <div
              key={sector._id || sector.id_sector || index}
              className={`flex items-center justify-between ${index !== sectores.length - 1 ? 'border-b border-white/10 pb-3 mb-3' : ''}`}
            >
              <span className="text-white text-[15px] font-medium tracking-wide">{sector.nombre}</span>
              <div className="w-[12px] h-[12px] rounded-full bg-gradient-to-b from-[#ef0000] to-[#8d375f] shadow-[0_0_8px_rgba(239,0,0,0.6)]"></div>
            </div>
          ))
        ) : (
          <div className="text-white text-center text-sm opacity-60">No hay sectores</div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-white text-[22px] font-medium">
          Total: {estadisticas?.totalLuminarias || 0}
        </div>
        <div className="text-white text-[22px] font-medium">
          Funcionando: {estadisticas?.luminariasFuncionando || 0}
        </div>
      </div>
    </div>
  )
}
