
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
  fecha: string
  hora: string
  descripcion: string
}

export interface NotificacionesResponse {
  success: boolean
  data: Notificacion[]
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
  id_lum: number
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
