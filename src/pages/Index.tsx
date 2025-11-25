import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast, Toaster } from 'sonner'
import {
  fetchConsumoTotalMes,
  fetchConsumoMesAnterior,
  fetchSectores,
  fetchNotificaciones,
  fetchReportes,
  createReporte,
  fetchEstadisticas,
  fetchConsumoDiario,
  fetchConsumoPorHora,
  fetchUltimaMedicion,
  fetchUltimaLux,
  type ConsumoTotalMesResponse,
  type ConsumoMesAnteriorResponse,
  type NotificacionesResponse,
  type ReportesResponse,
  type EstadisticasResponse,
  type ConsumoDiarioResponse,
  type ConsumoHoraResponse,
  type UltimaMedicionResponse,
  type UltimaLuxResponse
} from '../lib/api'
import { ListaSectores } from '../components/dashboard/ListaSectores'
import { LuxGauge } from '../components/primitives/LuxGauge'

export const Index = () => {
  const [consumoMes, setConsumoMes] = useState<ConsumoTotalMesResponse['data'] | null>(null)
  const [consumoAnterior, setConsumoAnterior] = useState<ConsumoMesAnteriorResponse['data'] | null>(null)
  const [notificaciones, setNotificaciones] = useState<NotificacionesResponse['data']>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasResponse['data'] | null>(null)
  const [consumoDiario, setConsumoDiario] = useState<ConsumoDiarioResponse['data']>([])
  const [consumoPorHora, setConsumoPorHora] = useState<ConsumoHoraResponse['data']>([])
  const [ultimaMedicion, setUltimaMedicion] = useState<UltimaMedicionResponse['data']>(null)
  const [ultimaLux, setUltimaLux] = useState<UltimaLuxResponse['data'] | null>(null)
  const [reportes, setReportes] = useState<ReportesResponse['data']>([])
  const [showReporteModal, setShowReporteModal] = useState(false)
  const [nuevoReporte, setNuevoReporte] = useState({ titulo: '', descripcion: '', id_luminaria: '' })
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
          reportesData,
          estadisticasData,
          consumoDiarioData,
          consumoPorHoraData,
          ultimaMedicionData,
          luxData
        ] = await Promise.all([
          fetchConsumoTotalMes(),
          fetchConsumoMesAnterior(),
          fetchSectores(),
          fetchNotificaciones(),
          fetchReportes(),
          fetchEstadisticas(),
          fetchConsumoDiario(),
          fetchConsumoPorHora(),
          fetchUltimaMedicion(),
          fetchUltimaLux()
        ])

        console.log('Datos recibidos:', {
          consumoMes: consumoMesData,
          consumoAnterior: consumoAnteriorData,
          sectores: sectoresData,
          notificaciones: notificacionesData,
          reportes: reportesData,
          estadisticas: estadisticasData,
          consumoDiario: consumoDiarioData,
          consumoPorHora: consumoPorHoraData,
          ultimaMedicion: ultimaMedicionData
        })

        // Completar horas faltantes con 0
        const horasCompletas = Array.from({ length: 24 }, (_, i) => {
          const horaData = consumoPorHoraData.data.find(h => h.hora === i)
          return {
            hora: i,
            consumoPromedio: horaData ? horaData.consumoPromedio : 0
          }
        })

        setConsumoMes(consumoMesData.data)
        setConsumoAnterior(consumoAnteriorData.data)
        setNotificaciones(notificacionesData.data)
        setReportes(reportesData.data)
        setEstadisticas(estadisticasData.data)
        setConsumoDiario(consumoDiarioData.data)
        setConsumoPorHora(horasCompletas)
        setUltimaMedicion(ultimaMedicionData.data)
        setUltimaLux(luxData.data)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()

    // Actualizar última medición cada 3 segundos
    const intervalId = setInterval(async () => {
      try {
        const ultimaMedicionData = await fetchUltimaMedicion()
        setUltimaMedicion(ultimaMedicionData.data)
      } catch (error) {
        console.error('Error al actualizar última medición:', error)
      }
    }, 3000)

    // Actualizar lux cada 3 segundos
    const intervalLuxId = setInterval(async () => {
      try {
        const luxData = await fetchUltimaLux()
        setUltimaLux(luxData.data)
      } catch (error) {
        console.error('Error al actualizar lux:', error)
      }
    }, 3000)

    // Limpiar intervalos al desmontar el componente
    return () => {
      clearInterval(intervalId)
      clearInterval(intervalLuxId)
    }
  }, [])

  // Auto-refresh notificaciones y reportes cada 3 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [notificacionesData, reportesData] = await Promise.all([
          fetchNotificaciones(),
          fetchReportes()
        ])
        setNotificaciones(notificacionesData.data)
        setReportes(reportesData.data)
      } catch (error) {
        console.error('Error al actualizar notificaciones/reportes:', error)
      }
    }, 3000) // 3 segundos

    return () => clearInterval(interval)
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
    <div className="w-full min-h-screen relative">
      <Toaster position="top-right" />
      {/* Background image - full screen */}
      <div className="fixed inset-0 w-full h-full z-0">
        <img
          src="/LumiCertLogin.jpg"
          alt="Fondo dashboard"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay oscuro para mejor legibilidad */}
      <div className="fixed inset-0 bg-black/30 z-0"></div>

      {/* Content with transparency */}
      <div className="relative z-10 p-2 flex gap-2">
        {/* Panel izquierdo - Sectores y Daños */}
        <div className="w-[290px] flex flex-col gap-2">
          {/* Sectores */}
          <ListaSectores />

          {/* Última Medición */}
          <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
            <h2 className="text-white text-[24px] font-bold text-center mb-4">Última Medición</h2>

            {ultimaMedicion ? (
              <div className="space-y-3">
                <div className="bg-[#2a3d4d]/60 rounded-[15px] p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400 text-[12px] mb-1">Luminaria</p>
                      <p className="text-white text-[16px] font-semibold">#{ultimaMedicion.id_luminaria}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[12px] mb-1">Fecha/Hora</p>
                      <p className="text-white text-[12px]">
                        {new Date(ultimaMedicion.fecha).toLocaleString('es-CO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a3d4d]/60 rounded-[15px] p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400 text-[12px] mb-1">Consumo</p>
                      <p className="text-white text-[16px] font-semibold">
                        {ultimaMedicion.consumo != null ? ultimaMedicion.consumo.toFixed(3) : '0.000'} kWh
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[12px] mb-1">Corriente</p>
                      <p className="text-white text-[16px] font-semibold">
                        {ultimaMedicion.corriente != null ? ultimaMedicion.corriente.toFixed(2) : '0.00'} A
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[12px] mb-1">Voltaje</p>
                      <p className="text-white text-[16px] font-semibold">
                        {ultimaMedicion.voltaje != null ? ultimaMedicion.voltaje.toFixed(2) : '0.00'} V
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[12px] mb-1">Estado</p>
                      <div className="flex gap-1 flex-wrap">
                        {ultimaMedicion.falla && (
                          <span className="text-[10px] bg-red-500 text-white px-2 py-1 rounded">Falla</span>
                        )}
                        {ultimaMedicion.sobreconsumo && (
                          <span className="text-[10px] bg-yellow-500 text-white px-2 py-1 rounded">Sobreconsumo</span>
                        )}
                        {ultimaMedicion.perdida_energia && (
                          <span className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded">Pérdida</span>
                        )}
                        {!ultimaMedicion.falla && !ultimaMedicion.sobreconsumo && !ultimaMedicion.perdida_energia && (
                          <span className="text-[10px] bg-green-500 text-white px-2 py-1 rounded">Normal</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white text-center text-sm py-8">
                No hay mediciones disponibles
              </div>
            )}
          </div>

          {/* Medidor de Lux */}
          <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
            <h2 className="text-white text-[24px] font-bold text-center mb-4">Luminosidad</h2>
            <LuxGauge value={ultimaLux?.lux || 0} maxValue={1000} />
          </div>
        </div>

        {/* Panel central - Gráficos y estadísticas */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Cards superiores */}
          <div className="flex gap-2">
            <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-4 flex-1">
              <h3 className="text-white text-[13px] font-bold text-center mb-2">Consumo Total del Mes (kWh)</h3>
              <p className="text-white text-[24px] font-bold text-center">
                {consumoMes ? consumoMes.consumoTotalMes.toFixed(2) : '0.00'} kWh
              </p>
              <p className="text-gray-400 text-[11px] text-center mt-1">
                {consumoMes ? `${consumoMes.diasTranscurridos} de ${consumoMes.totalDiasMes} días` : 'Cargando...'}
              </p>
            </div>
            <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-4 flex-1">
              <h3 className="text-white text-[13px] font-bold text-center mb-2">Consumo Promedio Diario (kWh/día)</h3>
              <p className="text-white text-[24px] font-bold text-center">
                {consumoMes ? consumoMes.consumoPromedioDiario.toFixed(2) : '0.00'} kWh/día
              </p>
              <p className="text-gray-400 text-[11px] text-center mt-1">
                {consumoMes ? `Basado en ${consumoMes.mediciones} mediciones` : 'Cargando...'}
              </p>
            </div>
            <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-4 flex-1">
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
          <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
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
          <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6 flex-1">
            <h3 className="text-white text-[20px] font-bold text-center mb-4">Consumo promedio/hora último mes</h3>
            <div className="bg-white rounded-[15px] p-4">
              <p className="text-gray-800 text-sm font-medium mb-2 text-center">Consumo diario promedio por hora</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={consumoPorHora} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis
                    dataKey="hora"
                    label={{ value: 'Hora del día', position: 'insideBottom', offset: -10 }}
                    stroke="#666"
                    tick={{ fontSize: 11 }}
                    type="number"
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]}
                  />
                  <YAxis
                    label={{ value: 'Consumo promedio (kWh)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    stroke="#666"
                    tick={{ fontSize: 11 }}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', fontSize: 12 }}
                    labelFormatter={(value) => `Hora ${value}:00`}
                    formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumo Promedio']}
                  />
                  <Bar
                    dataKey="consumoPromedio"
                    fill="#60a5fa"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Panel derecho - Notificaciones y Precios */}
        <div className="w-[290px] flex flex-col gap-2">
          {/* Notificaciones Recientes - Liquid Glass Design */}
          <div className="rounded-[20px] bg-[#2a3d4d]/40 backdrop-blur-xl p-4 border border-white/10">
            <h2 className="text-white text-[20px] font-bold mb-3">Notificaciones Recientes</h2>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3"></div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {notificaciones.slice(0, 5).map((notif) => {
                // Determinar el icono y color según el tipo de notificación
                const getNotificationStyle = (titulo: string, descripcion: string) => {
                  const text = (titulo + ' ' + descripcion).toLowerCase()
                  if (text.includes('falla') || text.includes('crítico') || text.includes('daño')) {
                    return {
                      icon: '!',
                      bgColor: 'bg-red-500',
                      borderColor: 'border-red-500/30'
                    }
                  } else if (text.includes('sobreconsumo') || text.includes('advertencia') || text.includes('alerta')) {
                    return {
                      icon: '!',
                      bgColor: 'bg-yellow-500',
                      borderColor: 'border-yellow-500/30'
                    }
                  } else {
                    return {
                      icon: '!',
                      bgColor: 'bg-blue-500',
                      borderColor: 'border-blue-500/30'
                    }
                  }
                }

                const style = getNotificationStyle(notif.titulo || '', notif.descripcion)
                const fecha = new Date(notif.fecha)
                const hora = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })

                return (
                  <div
                    key={notif._id}
                    className={`bg-[#3d4f5e]/50 backdrop-blur-md rounded-[16px] p-3 border ${style.borderColor} hover:bg-[#3d4f5e]/70 transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icono de alerta */}
                      <div className={`w-[40px] h-[40px] ${style.bgColor} rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-white text-[22px] font-bold">{style.icon}</span>
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h3 className="text-white text-[14px] font-semibold">
                            {notif.titulo || 'Alerta'}
                          </h3>
                          <span className="text-gray-400 text-[11px] whitespace-nowrap">
                            {hora}
                          </span>
                        </div>
                        <p className="text-white/90 text-[12px] leading-snug">
                          {notif.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {notificaciones.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-white/60 text-[13px]">No hay notificaciones recientes</p>
                </div>
              )}
            </div>
          </div>

          {/* Reportes - Liquid Glass Design */}
          <div className="rounded-[20px] bg-[#2a3d4d]/40 backdrop-blur-xl p-4 border border-white/10">
            <h2 className="text-white text-[20px] font-bold mb-3">Reportes</h2>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3"></div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto mb-3 pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {reportes.slice(0, 3).map((reporte) => {
                const fecha = new Date(reporte.fecha)
                const hora = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })

                return (
                  <div
                    key={reporte._id}
                    className="bg-[#3d4f5e]/50 backdrop-blur-md rounded-[16px] p-3 border border-blue-500/30 hover:bg-[#3d4f5e]/70 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icono de reporte */}
                      <div className="w-[40px] h-[40px] bg-blue-500 rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-[22px]">📋</span>
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h3 className="text-white text-[14px] font-semibold">
                            {reporte.titulo}
                          </h3>
                          <span className="text-gray-400 text-[11px] whitespace-nowrap">
                            {hora}
                          </span>
                        </div>
                        <p className="text-white/90 text-[12px] leading-snug max-h-[60px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                          {reporte.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {reportes.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-white/60 text-[13px]">No hay reportes</p>
                </div>
              )}
            </div>

            {/* Botón Nuevo Reporte */}
            <button
              onClick={() => setShowReporteModal(true)}
              className="w-full bg-[#2a3d4d] hover:bg-[#394d5c] text-white px-4 py-2 rounded-[12px] text-[14px] font-semibold transition-colors shadow-md border border-white/5 backdrop-blur-sm"
            >
              + Nuevo Reporte
            </button>
          </div>

          {/* Precios */}
          <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
            <h2 className="text-white text-[24px] font-bold text-center mb-6">Precios</h2>

            <div className="space-y-4">
              {/* Precio Actual */}
              <div className="bg-[#394d5c]/60 border border-gray-600 rounded-lg p-6">
                <div className="flex items-end justify-center gap-2">
                  <div className="flex items-start">
                    <span className="text-white text-[20px] font-bold">$</span>
                    <span className="text-white text-[36px] font-bold">50</span>
                  </div>
                  <span className="text-white text-[14px] mb-1">/ <span className="text-[11px]">Actualmente</span></span>
                </div>
              </div>

              {/* Precio Mes Anterior */}
              <div className="bg-[#394d5c]/60 border border-[#394d5c] rounded-lg p-6">
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

      {/* Modal Nuevo Reporte */}
      {
        showReporteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a2936] rounded-[20px] p-6 max-w-md w-full border border-white/10 shadow-2xl">
              <h2 className="text-white text-[24px] font-bold mb-4">Nuevo Reporte</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-[14px] font-medium mb-2 block">Título</label>
                  <input
                    type="text"
                    value={nuevoReporte.titulo}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, titulo: e.target.value })}
                    className="w-full bg-[#2a3d4d]/60 border border-white/10 rounded-[12px] px-4 py-2 text-white text-[14px] focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ej: Falla en luminaria"
                  />
                </div>

                <div>
                  <label className="text-white text-[14px] font-medium mb-2 block">Descripción</label>
                  <textarea
                    value={nuevoReporte.descripcion}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, descripcion: e.target.value })}
                    className="w-full bg-[#2a3d4d]/60 border border-white/10 rounded-[12px] px-4 py-2 text-white text-[14px] focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Describe el problema..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-white text-[14px] font-medium mb-2 block">ID Luminaria (opcional)</label>
                  <input
                    type="text"
                    value={nuevoReporte.id_luminaria}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, id_luminaria: e.target.value })}
                    className="w-full bg-[#2a3d4d]/60 border border-white/10 rounded-[12px] px-4 py-2 text-white text-[14px] focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ej: 4"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowReporteModal(false)
                      setNuevoReporte({ titulo: '', descripcion: '', id_luminaria: '' })
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-[12px] transition-all duration-200 text-[14px]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      if (!nuevoReporte.titulo || !nuevoReporte.descripcion) {
                        toast.error('Por favor completa título y descripción')
                        return
                      }

                      try {
                        console.log('Creando reporte...', nuevoReporte)
                        const response = await createReporte({
                          titulo: nuevoReporte.titulo,
                          descripcion: nuevoReporte.descripcion,
                          id_luminaria: nuevoReporte.id_luminaria || undefined
                        })
                        console.log('Respuesta del servidor:', response)

                        // Cerrar modal y limpiar form primero
                        setShowReporteModal(false)
                        setNuevoReporte({ titulo: '', descripcion: '', id_luminaria: '' })

                        // Mostrar toast de éxito
                        toast.success('Reporte creado exitosamente')

                        // Recargar reportes en segundo plano
                        fetchReportes().then(reportesData => {
                          setReportes(reportesData.data)
                        }).catch(err => {
                          console.error('Error al recargar reportes:', err)
                        })
                      } catch (error) {
                        console.error('Error al crear reporte:', error)
                        toast.error('Error al crear el reporte')
                        // Cerrar modal incluso si hay error
                        setShowReporteModal(false)
                        setNuevoReporte({ titulo: '', descripcion: '', id_luminaria: '' })
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-[12px] transition-all duration-200 shadow-lg hover:shadow-xl text-[14px]"
                  >
                    Crear Reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </div >
  )
}
