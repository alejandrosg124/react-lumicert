import { useEffect, useState } from 'react'
import {
  fetchConsumoTotalMes,
  fetchConsumoMesAnterior,
  fetchSectores,
  fetchNotificaciones,
  fetchEstadisticas,
  fetchConsumoDiario,
  type ConsumoTotalMesResponse,
  type ConsumoMesAnteriorResponse,
  type NotificacionesResponse,
} from '../lib/api'
import { ListaSectores } from '../components/dashboard/ListaSectores'

export const Index = () => {
  const [consumoMes, setConsumoMes] = useState<ConsumoTotalMesResponse['data'] | null>(null)
  const [consumoAnterior, setConsumoAnterior] = useState<ConsumoMesAnteriorResponse['data'] | null>(null)
  const [notificaciones, setNotificaciones] = useState<NotificacionesResponse['data']>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('Iniciando carga de datos...')
        const [
          consumoMesData,
          consumoAnteriorData,
          sectoresData,
          notificacionesData,
          estadisticasData,
          consumoDiarioData
        ] = await Promise.all([
          fetchConsumoTotalMes(),
          fetchConsumoMesAnterior(),
          fetchSectores(),
          fetchNotificaciones(),
          fetchEstadisticas(),
          fetchConsumoDiario()
        ])

        console.log('Datos recibidos:', {
          consumoMes: consumoMesData,
          consumoAnterior: consumoAnteriorData,
          sectores: sectoresData,
          notificaciones: notificacionesData,
          estadisticas: estadisticasData,
          consumoDiario: consumoDiarioData
        })

        setConsumoMes(consumoMesData.data)
        setConsumoAnterior(consumoAnteriorData.data)
        setNotificaciones(notificacionesData.data)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  // Calcular variación porcentual
  const calcularVariacion = () => {
    if (!consumoMes || !consumoAnterior) return 0
    if (consumoAnterior.consumoMesAnterior === 0) return 0

    const variacion = ((consumoMes.consumoTotalMes - consumoAnterior.consumoMesAnterior) / consumoAnterior.consumoMesAnterior) * 100
    return variacion.toFixed(1)
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen relative bg-[#0a1219] flex items-center justify-center">
        <div className="text-white text-2xl">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen relative bg-[#0a1219] p-2 flex gap-2">
      {/* Panel izquierdo - Sectores y Daños */}
      <div className="w-[290px] flex flex-col gap-2">
        {/* Sectores */}
        <ListaSectores />

        {/* Daños reportados */}
        <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[24px] font-bold text-center mb-4">Daños reportados</h2>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {notificaciones.slice(0, 3).map((notif) => (
              <div key={notif._id} className="bg-[#2a3d4d] rounded-[20px] p-4 flex items-start gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-[#3d5161] flex items-center justify-center text-[24px] flex-shrink-0">
                  📋
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-[15px] font-semibold">Reporte</span>
                    <span className="text-gray-400 text-[14px]">{notif.hora}</span>
                  </div>
                  <p className="text-white text-[14px] truncate">{notif.descripcion}</p>
                </div>
              </div>
            ))}
            {notificaciones.length === 0 && (
              <div className="text-white text-center text-sm py-4">
                No hay reportes de daños
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel central - Gráficos y estadísticas */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Cards superiores */}
        <div className="flex gap-2">
          <div className="rounded-[20px] bg-[#1a2936] p-4 flex-1">
            <h3 className="text-white text-[13px] font-bold text-center mb-2">Consumo Total del Mes (kWh)</h3>
            <p className="text-white text-[24px] font-bold text-center">
              {consumoMes ? consumoMes.consumoTotalMes.toFixed(2) : '0.00'} kWh
            </p>
            <p className="text-gray-400 text-[11px] text-center mt-1">
              {consumoMes ? `${consumoMes.diasTranscurridos} de ${consumoMes.totalDiasMes} días` : 'Cargando...'}
            </p>
          </div>
          <div className="rounded-[20px] bg-[#1a2936] p-4 flex-1">
            <h3 className="text-white text-[13px] font-bold text-center mb-2">Consumo Promedio Diario (kWh/día)</h3>
            <p className="text-white text-[24px] font-bold text-center">
              {consumoMes ? consumoMes.consumoPromedioDiario.toFixed(2) : '0.00'} kWh/día
            </p>
            <p className="text-gray-400 text-[11px] text-center mt-1">
              {consumoMes ? `Basado en ${consumoMes.mediciones} mediciones` : 'Cargando...'}
            </p>
          </div>
          <div className="rounded-[20px] bg-[#1a2936] p-4 flex-1">
            <h3 className="text-white text-[13px] font-bold text-center mb-2">Variación vs Mes Anterior (%)</h3>
            <p className={`text-[24px] font-bold text-center ${Number(calcularVariacion()) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              {Number(calcularVariacion()) >= 0 ? '+' : ''}{calcularVariacion()}%
            </p>
            <p className="text-gray-400 text-[11px] text-center mt-1">
              {consumoAnterior ? `${consumoAnterior.consumoMesAnterior.toFixed(2)} kWh el mes pasado` : 'Cargando...'}
            </p>
          </div>
        </div>

        {/* Consumo mensual */}
        <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[28px] font-bold text-center mb-4">Consumo mensual</h2>
          <div className="bg-white rounded-[15px] p-4">
            <p className="text-gray-800 text-sm font-medium mb-2">Consumo de Energía Diario (kWh) - Mes de Prueba</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={consumoDiario} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="dia"
                  label={{ value: 'Día del mes', position: 'insideBottom', offset: -10 }}
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  domain={[1, 31]}
                  type="number"
                  ticks={[1, 5, 10, 15, 20, 25, 30]}
                />
                <YAxis
                  label={{ value: 'Consumo (kWh)', angle: -90, position: 'insideLeft' }}
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  labelFormatter={(value) => `Día ${value}`}
                  formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumo']}
                />
                <Line
                  type="monotone"
                  dataKey="consumo"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos inferiores */}
        <div className="flex gap-2">
          <div className="rounded-[20px] bg-[#1a2936] p-6 flex-1">
            <h3 className="text-white text-[20px] font-bold text-center mb-4">Consumo por sector</h3>
            <img src="/pie-chart-sectores.png" alt="Consumo por sector" className="w-full h-auto rounded-[15px]" />
          </div>
          <div className="rounded-[20px] bg-[#1a2936] p-6 flex-1">
            <h3 className="text-white text-[20px] font-bold text-center mb-4">Consumo promedio/hora</h3>
            <img src="/consumo-horas.png" alt="Consumo por hora" className="w-full h-auto rounded-[15px]" />
          </div>
        </div>
      </div>

      {/* Panel derecho - Notificaciones y Precios */}
      <div className="w-[290px] flex flex-col gap-2">
        {/* Notificaciones Recientes */}
        <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[24px] font-bold text-center mb-4">Notificaciones Recientes</h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {notificaciones.slice(0, 5).map((notif) => {
              // Determinar color basado en descripción
              const getColor = () => {
                const desc = notif.descripcion.toLowerCase()
                if (desc.includes('falla') || desc.includes('daño') || desc.includes('crítico')) {
                  return 'bg-red-500'
                } else if (desc.includes('alerta') || desc.includes('advertencia')) {
                  return 'bg-yellow-500'
                } else {
                  return 'bg-blue-500'
                }
              }

              return (
                <div key={notif._id} className="bg-[#2a3d4d] rounded-[20px] p-4 flex items-start gap-3">
                  <div className={`w-[40px] h-[40px] rounded-full ${getColor()} flex items-center justify-center text-[24px] flex-shrink-0`}>
                    ⚠️
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-[15px] font-semibold">Alerta</span>
                      <span className="text-gray-400 text-[14px]">{notif.hora}</span>
                    </div>
                    <p className="text-white text-[14px]">{notif.descripcion.substring(0, 50)}{notif.descripcion.length > 50 ? '..' : ''}</p>
                  </div>
                </div>
              )
            })}

            {notificaciones.length === 0 && (
              <div className="text-white text-center text-sm py-8">
                No hay notificaciones recientes
              </div>
            )}
          </div>
        </div>

        {/* Precios */}
        <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[24px] font-bold text-center mb-6">Precios</h2>

          <div className="space-y-4">
            {/* Precio Actual */}
            <div className="bg-[#394d5c] border border-gray-600 rounded-lg p-6">
              <div className="flex items-end justify-center gap-2">
                <div className="flex items-start">
                  <span className="text-white text-[20px] font-bold">$</span>
                  <span className="text-white text-[36px] font-bold">50</span>
                </div>
                <span className="text-white text-[14px] mb-1">/ <span className="text-[11px]">Actualmente</span></span>
              </div>
            </div>

            {/* Precio Mes Anterior */}
            <div className="bg-[#394d5c] border border-[#394d5c] rounded-lg p-6">
              <div className="flex items-end justify-center gap-2">
                <div className="flex items-start">
                  <span className="text-white text-[20px] font-bold">$</span>
                  <span className="text-white text-[36px] font-bold">40</span>
                </div>
                <span className="text-white text-[14px] mb-1">/ <span className="text-[11px]">Mes anterior</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
