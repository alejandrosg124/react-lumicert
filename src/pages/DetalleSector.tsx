import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import {
    fetchDetalleSector,
    fetchLuminariasPorSector,
    fetchConsumoMensualSector,
    type DetalleSector as DetalleSectorType,
    type LuminariaConMedicion,
    type ConsumoNoviembre
} from '../lib/api'

export const DetalleSector = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [detalle, setDetalle] = useState<DetalleSectorType | null>(null)
    const [luminarias, setLuminarias] = useState<LuminariaConMedicion[]>([])
    const [consumoMensual, setConsumoMensual] = useState<ConsumoNoviembre[]>([])


    useEffect(() => {
        const cargarDatos = async () => {
            if (!id) {
                setError('No se proporcionó ID de sector')
                setLoading(false)
                return
            }

            try {
                console.log('Cargando datos del sector:', id)

                const [detalleData, luminariasData, consumoData] = await Promise.all([
                    fetchDetalleSector(id),
                    fetchLuminariasPorSector(id),
                    fetchConsumoMensualSector(id)
                ])

                console.log('Datos recibidos:', { detalleData, luminariasData, consumoData })

                setDetalle(detalleData.data)
                setLuminarias(luminariasData.data)
                setConsumoMensual(consumoData.data || [])
            } catch (error) {
                console.error('Error al cargar detalle del sector:', error)
                setError(error instanceof Error ? error.message : 'Error desconocido al cargar datos')
            } finally {
                setLoading(false)
            }
        }

        cargarDatos()
    }, [id])

    const getEstadoBadge = (estado: 'Bien' | 'Sobreconsumo' | 'Falla') => {
        const colors = {
            Bien: 'bg-green-500',
            Sobreconsumo: 'bg-yellow-500',
            Falla: 'bg-red-500'
        }
        return (
            <span className={`text - [12px] ${colors[estado]} text - white px - 3 py - 1 rounded - full font - semibold`}>
                {estado}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen relative bg-[#0a1219] flex items-center justify-center">
                <div className="text-white text-2xl">Cargando datos del sector...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full min-h-screen relative bg-[#0a1219] flex flex-col items-center justify-center gap-4">
                <div className="text-red-400 text-2xl">Error al cargar el sector</div>
                <div className="text-white text-lg">{error}</div>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Volver al Dashboard
                </button>
            </div>
        )
    }

    if (!detalle) {
        return (
            <div className="w-full min-h-screen relative bg-[#0a1219] flex items-center justify-center">
                <div className="text-white text-2xl">Sector no encontrado</div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen relative">
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
            <div className="relative z-10 p-6">
                {/* Botón de regreso */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-4 px-4 py-2 bg-[#1a2936]/70 backdrop-blur-sm text-white rounded-lg hover:bg-[#1a2936]/90 transition-colors"
                >
                    ← Volver al Dashboard
                </button>

                {/* Título del sector */}
                <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6 mb-6">
                    <h1 className="text-white text-[36px] font-bold">{detalle.nombre}</h1>
                    <p className="text-gray-300 text-[18px]">Zona: {detalle.zona}</p>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 mb-6">
                    {/* Información General del Sector */}
                    <div className="flex-1 rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
                        <h2 className="text-white text-[28px] font-bold mb-6 text-center">Información General</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Consumo Total del Mes */}
                            <div className="bg-[#394d5c]/60 rounded-[15px] p-4">
                                <h3 className="text-gray-400 text-[13px] font-bold text-center mb-2">Consumo Total del Mes (kWh)</h3>
                                <p className="text-white text-[28px] font-bold text-center">
                                    {detalle.consumoTotal.toFixed(2)} kWh
                                </p>
                            </div>

                            {/* Consumo Promedio Diario */}
                            <div className="bg-[#394d5c]/60 rounded-[15px] p-4">
                                <h3 className="text-gray-400 text-[13px] font-bold text-center mb-2">Consumo Promedio Diario (kWh/día)</h3>
                                <p className="text-white text-[28px] font-bold text-center">
                                    {detalle.consumoPromedio.toFixed(2)} kWh/día
                                </p>
                            </div>

                            {/* Total de Luminarias */}
                            <div className="bg-[#394d5c]/60 rounded-[15px] p-4">
                                <h3 className="text-gray-400 text-[13px] font-bold text-center mb-2">Total de Luminarias</h3>
                                <p className="text-white text-[28px] font-bold text-center">
                                    {detalle.totalLuminarias}
                                </p>
                            </div>

                            {/* Luminarias Funcionando */}
                            <div className="bg-[#394d5c]/60 rounded-[15px] p-4">
                                <h3 className="text-gray-400 text-[13px] font-bold text-center mb-2">Luminarias Funcionando</h3>
                                <p className="text-green-400 text-[28px] font-bold text-center">
                                    {detalle.luminariasFuncionando}
                                </p>
                            </div>

                            {/* Luminarias con Falla */}
                            <div className="bg-[#394d5c]/60 rounded-[15px] p-4">
                                <h3 className="text-gray-400 text-[13px] font-bold text-center mb-2">Luminarias con Falla</h3>
                                <p className="text-red-400 text-[28px] font-bold text-center">
                                    {detalle.luminariasConFalla}
                                </p>
                            </div>

                            {/* Luminarias con Sobreconsumo */}
                            <div className="bg-[#394d5c]/60 rounded-[15px] p-4">
                                <h3 className="text-gray-400 text-[13px] font-bold text-center mb-2">Luminarias con Sobreconsumo</h3>
                                <p className="text-yellow-400 text-[28px] font-bold text-center">
                                    {detalle.luminariasConSobreconsumo}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Gráfica de Consumo Mensual */}
                    <div className="flex-1 rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
                        <h2 className="text-white text-[28px] font-bold mb-6 text-center">Consumo Diario - Noviembre 2025 (kWh)</h2>

                        <div className="bg-[#394d5c]/60 rounded-[15px] p-6 h-[calc(100%-4rem)] flex items-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={consumoMensual}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#394d5c" />
                                    <XAxis
                                        dataKey="dia"
                                        stroke="#9ca3af"
                                        style={{ fontSize: '12px' }}
                                        label={{ value: 'Día del mes', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
                                        domain={[1, 30]}
                                        ticks={[1, 5, 10, 15, 20, 25, 30]}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        style={{ fontSize: '12px' }}
                                        label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a2936',
                                            border: '1px solid #394d5c',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        labelStyle={{ color: '#9ca3af' }}
                                    />
                                    <Legend
                                        wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="consumo"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', r: 5 }}
                                        activeDot={{ r: 7 }}
                                        name="Consumo (kWh)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Listado de Luminarias */}
                <div className="rounded-[20px] bg-[#1a2936]/70 backdrop-blur-sm p-6">
                    <h2 className="text-white text-[28px] font-bold mb-6 text-center">Luminarias del Sector</h2>

                    {luminarias.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {luminarias.map((luminaria) => (
                                <div key={luminaria._id} className="bg-[#394d5c]/60 rounded-[15px] p-5">
                                    {/* Header con número y estado */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-white text-[20px] font-bold">Luminaria #{luminaria.id_lum}</h3>
                                        {getEstadoBadge(luminaria.estado)}
                                    </div>

                                    {/* Información de la luminaria */}
                                    {luminaria.ultimaMedicion ? (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-gray-400 text-[11px] mb-1">Consumo</p>
                                                    <p className="text-white text-[15px] font-semibold">
                                                        {luminaria.ultimaMedicion.consumo.toFixed(3)} kWh
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[11px] mb-1">Corriente</p>
                                                    <p className="text-white text-[15px] font-semibold">
                                                        {luminaria.ultimaMedicion.corriente.toFixed(2)} A
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[11px] mb-1">Voltaje</p>
                                                    <p className="text-white text-[15px] font-semibold">
                                                        {luminaria.ultimaMedicion.voltaje.toFixed(2)} V
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[11px] mb-1">Modelo</p>
                                                    <p className="text-white text-[15px] font-semibold">
                                                        {luminaria.modelo}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-[11px] mb-1">Última Medición</p>
                                                <p className="text-white text-[12px]">
                                                    {new Date(luminaria.ultimaMedicion.fecha).toLocaleString('es-CO', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 text-center text-sm py-4">
                                            Sin mediciones disponibles
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-white text-center text-lg py-8">
                            No hay luminarias en este sector
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
