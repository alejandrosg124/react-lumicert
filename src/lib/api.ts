
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:1880'

export interface UserResponse {
  id: string
  name: string
  email: string
  phone: string
  profilepic: string
}

export const fetchRegister = async (_form: Record<string, unknown>) => {
  // Mock registration
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
  return { success: true, message: 'Mock registration successful' }
}

export const fetchLogin = async (credentials: { email: string; password: string }) => {
  // Mock login
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay

  // Extract username from email (part before @)
  const username = credentials.email.split('@')[0]

  return {
    success: true,
    user: {
      id: 'mock-user-id',
      name: username,
      email: credentials.email,
      phone: '1234567890',
      profilepic: null
    }
  }
}

export const fetchLogout = async () => {
  // Mock logout
  await new Promise(resolve => setTimeout(resolve, 100))
  return { success: true }
}

export const fetchUserInfo = async () => {
  // Mock user info
  return {
    id: 'mock-user-id',
    name: 'Administrador',
    email: 'demo@lumicert.com',
    phone: '1234567890',
    profilepic: null
  }
}

export const fetchVerifyCookie = async () => {
  // Mock verify
  await new Promise(resolve => setTimeout(resolve, 100))
  return {
    success: true,
    user: {
      id: 'mock-user-id',
      name: 'Administrador',
      email: 'demo@lumicert.com',
      phone: '1234567890',
      profilepic: null
    }
  }
}

export const fetchDeleteBooking = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Error al eliminar el reserva')
    }

    return true
  } catch (error) {
    if (error instanceof Error) return false
  }
}

export interface ConsumoTotalMesResponse {
  success: boolean
  data: {
    consumoTotalMes: number
    consumoPromedioDiario: number
    consumoPromedioMes: number
    mes: number
    año: number
    diasTranscurridos: number
    totalDiasMes: number
    mediciones: number
  }
}

export interface ConsumoMesAnteriorResponse {
  success: boolean
  data: {
    consumoMesAnterior: number
    mes: number
    año: number
  }
}

export interface Sector {
  _id?: string
  id_sector?: number
  nombre: string
  zona: string
  luminarias?: string[]
}

export interface SectoresResponse {
  success: boolean
  data: Sector[]
}

export interface Luminaria {
  _id: string
  id_lum: string
  id_sector?: string
  modelo: string
  ubicacion?: {
    latitud: number
    longitud: number
  }
}

export interface LuminariasResponse {
  success: boolean
  data: Luminaria[]
  total: number
}

export interface Notificacion {
  _id: string
  id_luminaria: string
  titulo?: string
  fecha: string
  hora: string
  descripcion: string
}

export interface NotificacionesResponse {
  success: boolean
  data: Notificacion[]
}

export interface Reporte {
  _id: string
  titulo: string
  descripcion: string
  id_luminaria?: string
  fecha: string
}

export interface ReportesResponse {
  success: boolean
  data: Reporte[]
}

export interface ConsumoDiario {
  dia: number
  mes: number
  año: number
  consumo: number
  fecha: string
}

export interface ConsumoDiarioResponse {
  success: boolean
  data: ConsumoDiario[]
}

export interface ConsumoSector {
  id_sector: string
  nombre_sector: string
  consumo: number
}

export interface ConsumoSectorResponse {
  success: boolean
  data: ConsumoSector[]
}

export interface ConsumoHora {
  hora: number
  consumoPromedio: number
}

export interface ConsumoHoraResponse {
  success: boolean
  data: ConsumoHora[]
}

export interface EstadisticasResponse {
  success: boolean
  data: {
    totalLuminarias: number
    luminariasFuncionando: number
    luminariasConProblemas: number
  }
}

export interface UltimaMedicion {
  fecha: string
  consumo: number
  estado_rele: boolean
  perdida_energia: boolean
  falla: boolean
  sobreconsumo: boolean
  corriente: number
  voltaje: number
  id_luminaria: number
}

export interface UltimaMedicionResponse {
  success: boolean
  data: UltimaMedicion | null
}

// Obtener consumo total del mes
export const fetchConsumoTotalMes = async (): Promise<ConsumoTotalMesResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/consumo/total-mes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener el consumo total del mes')
  }

  return await response.json()
}

// Obtener consumo del mes anterior
export const fetchConsumoMesAnterior = async (): Promise<ConsumoMesAnteriorResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/consumo/mes-anterior`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener el consumo del mes anterior')
  }

  return await response.json()
}

// Obtener sectores
export const fetchSectores = async (): Promise<SectoresResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener los sectores')
  }

  return await response.json()
}

// Obtener luminarias
export const fetchLuminarias = async (): Promise<LuminariasResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/luminarias`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener las luminarias')
  }

  return await response.json()
}

// Obtener notificaciones
export const fetchNotificaciones = async (): Promise<NotificacionesResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/notificaciones`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener las notificaciones')
  }

  return await response.json()
}

// Obtener consumo diario
export const fetchConsumoDiario = async (): Promise<ConsumoDiarioResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/consumo/diario`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener el consumo diario')
  }

  return await response.json()
}

// Obtener consumo por sector
export const fetchConsumoPorSector = async (): Promise<ConsumoSectorResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/consumo/por-sector`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener el consumo por sector')
  }

  return await response.json()
}

// Obtener consumo diario de noviembre por sector
export interface ConsumoNoviembre {
  dia: number
  consumo: number
}

export interface ConsumoNoviembreResponse {
  success: boolean
  data: ConsumoNoviembre[]
}

export const fetchConsumoMensualSector = async (sectorId: string): Promise<ConsumoNoviembreResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores/${sectorId}/consumo-mensual`)

  if (!response.ok) {
    throw new Error('Error al obtener el consumo mensual del sector')
  }

  return await response.json()
}

// Obtener reportes
export const fetchReportes = async (): Promise<ReportesResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/reportes`)

  if (!response.ok) {
    throw new Error('Error al obtener reportes')
  }

  return await response.json()
}

// Crear nuevo reporte
export const createReporte = async (data: { titulo: string; descripcion: string; id_luminaria?: string }) => {
  const response = await fetch(`${API_BASE_URL}/api/reportes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al crear reporte')
  }

  return await response.json()
}

// Obtener estadísticas generales
export const fetchEstadisticas = async (): Promise<EstadisticasResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/estadisticas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener las estadísticas')
  }

  return await response.json()
}

// Obtener consumo promedio por hora
export const fetchConsumoPorHora = async (): Promise<ConsumoHoraResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/consumo/por-hora`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener el consumo por hora')
  }

  return await response.json()
}

// Obtener última medición
export const fetchUltimaMedicion = async (): Promise<UltimaMedicionResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/ultima-medicion`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener la última medición')
  }

  return await response.json()
}

// ============== SECTOR STATUS AND DETAILS ==============

export interface SectorConMediciones {
  _id: string
  id_sector: number
  nombre: string
  zona: string
  ultimaMedicion: {
    falla: boolean
    sobreconsumo: boolean
  } | null
  estado: 'ok' | 'warning' | 'error'
}

export interface SectoresConMedicionesResponse {
  success: boolean
  data: SectorConMediciones[]
}

export interface LuminariaConMedicion {
  _id: string
  id_lum: number
  modelo: string
  id_sector?: string
  ubicacion?: {
    latitud: number
    longitud: number
  }
  ultimaMedicion: {
    fecha: string
    consumo: number
    corriente: number
    voltaje: number
    estado_rele: boolean
    falla: boolean
    sobreconsumo: boolean
    perdida_energia: boolean
  } | null
  estado: 'Bien' | 'Sobreconsumo' | 'Falla'
}

export interface LuminariasConMedicionResponse {
  success: boolean
  data: LuminariaConMedicion[]
}

export interface DetalleSector {
  _id: string
  id_sector: number
  nombre: string
  zona: string
  totalLuminarias: number
  luminariasFuncionando: number
  luminariasConFalla: number
  luminariasConSobreconsumo: number
  consumoTotal: number
  consumoPromedio: number
}

export interface DetalleSectorResponse {
  success: boolean
  data: DetalleSector
}

// Obtener sectores con sus últimas mediciones (para indicadores de estado)
export const fetchSectoresConMediciones = async (): Promise<SectoresConMedicionesResponse> => {
  // Obtener sectores y estados en paralelo
  const [sectoresResponse, estadosResponse] = await Promise.all([
    fetchSectores(),
    fetch(`${API_BASE_URL}/api/sectores/estado`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  ])

  if (!estadosResponse.ok) {
    throw new Error('Error al obtener estados de sectores')
  }

  const estadosData = await estadosResponse.json()
  const estadosPorSector: Record<string, { falla: boolean; sobreconsumo: boolean }> = estadosData.data || {}

  // Combinar sectores con sus estados
  const sectoresConEstado: SectorConMediciones[] = sectoresResponse.data.map(sector => {
    const sectorId = sector.id_sector?.toString() || sector._id || ''
    const estado = estadosPorSector[sectorId] || { falla: false, sobreconsumo: false }

    let estadoFinal: 'ok' | 'warning' | 'error' = 'ok'
    if (estado.falla) {
      estadoFinal = 'error'
    } else if (estado.sobreconsumo) {
      estadoFinal = 'warning'
    }

    return {
      _id: sector._id || '',
      id_sector: sector.id_sector || 0,
      nombre: sector.nombre,
      zona: sector.zona,
      ultimaMedicion: estado,
      estado: estadoFinal
    }
  })

  return {
    success: true,
    data: sectoresConEstado
  }
}

// Obtener luminarias de un sector con sus mediciones
export const fetchLuminariasPorSector = async (idSector: string): Promise<LuminariasConMedicionResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores/${idSector}/luminarias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener las luminarias del sector')
  }

  return await response.json()
}

// Obtener detalle completo de un sector
export const fetchDetalleSector = async (idSector: string): Promise<DetalleSectorResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores/${idSector}/detalle`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al obtener el detalle del sector')
  }

  return await response.json()
}

// ============== SECTOR MANAGEMENT API ==============

export interface CreateSectorData {
  nombre: string
  zona: string
}

export interface UpdateSectorData {
  nombre?: string
  zona?: string
}

export interface LinkLuminariasData {
  luminarias: string[]
}

export interface SectorResponse {
  success: boolean
  message?: string
  data?: Sector
}

// Crear nuevo sector
export const createSector = async (data: CreateSectorData): Promise<SectorResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al crear el sector')
  }

  return await response.json()
}

// Actualizar sector
export const updateSector = async (id: string, data: UpdateSectorData): Promise<SectorResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al actualizar el sector')
  }

  return await response.json()
}

// Enlazar luminarias a sector
export const linkLuminariasToSector = async (id: string, data: LinkLuminariasData): Promise<SectorResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores/${id}/luminarias`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al enlazar luminarias')
  }

  return await response.json()
}

// Eliminar sector
export const deleteSector = async (id: string): Promise<SectorResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/sectores/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al eliminar el sector')
  }

  return await response.json()
}
