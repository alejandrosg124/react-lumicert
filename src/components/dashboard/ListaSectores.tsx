import {
  type EstadisticasResponse,
  fetchSectoresConMediciones,
  fetchEstadisticas,
  type SectorConMediciones
} from '../../lib/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const ListaSectores = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [sectores, setSectores] = useState<SectorConMediciones[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasResponse['data'] | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('Iniciando carga de datos...')
        const [
          sectoresData,
          estadisticasData
        ] = await Promise.all([
          fetchSectoresConMediciones(),
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

  const getStatusColor = (falla: boolean, sobreconsumo: boolean) => {
    if (falla) {
      return 'bg-gradient-to-b from-[#ef0000] to-[#8d375f] shadow-[0_0_8px_rgba(239,0,0,0.6)]'
    }
    if (sobreconsumo) {
      return 'bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] shadow-[0_0_8px_rgba(251,191,36,0.6)]'
    }
    return 'bg-gradient-to-b from-[#10b981] to-[#059669] shadow-[0_0_8px_rgba(16,185,129,0.6)]'
  }

  const handleSectorClick = (sectorId: string | number | undefined) => {
    if (sectorId) {
      navigate(`/sector/${sectorId}`)
    }
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
      <h2 className="text-white text-[28px] font-bold mb-4">Sectores</h2>

      <div className="bg-[#394d5c]/60 rounded-[15px] p-4 mb-4 max-h-[200px] overflow-y-auto">
        {sectores.length > 0 ? (
          sectores.map((sector, index) => {
            const falla = sector.ultimaMedicion?.falla || false
            const sobreconsumo = sector.ultimaMedicion?.sobreconsumo || false

            return (
              <div
                key={sector._id || sector.id_sector || index}
                className={`flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg px-2 py-1 transition-colors ${index !== sectores.length - 1 ? 'border-b border-white/10 pb-3 mb-3' : ''}`}
                onClick={() => handleSectorClick(sector._id || sector.id_sector)}
              >
                <span className="text-white text-[15px] font-medium tracking-wide">{sector.nombre}</span>
                <div className={`w-[12px] h-[12px] rounded-full ${getStatusColor(falla, sobreconsumo)}`}></div>
              </div>
            )
          })
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
