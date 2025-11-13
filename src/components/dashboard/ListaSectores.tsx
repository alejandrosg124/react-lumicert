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

    cargarDatos()},
  [])
  if (loading) return <div>Cargando...</div>

  return (
    <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[28px] font-bold mb-4">Sectores</h2>

          <div className="bg-[#394d5c] rounded-[15px] p-4 mb-4 max-h-[200px] overflow-y-auto">
            {sectores.length > 0 ? (
              sectores.map((sector, index) => (
                <div key={sector.id_sector} className={`flex items-center justify-between ${index > 0 ? 'mt-3' : ''}`}>
                  <span className="text-white text-[20px] font-medium">{sector.nombre_sector}</span>
                  <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-b from-[#ef0000] to-[#8d375f]"></div>
                </div>
              ))
            ) : (
              <div className="text-white text-center text-sm">No hay sectores</div>
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
