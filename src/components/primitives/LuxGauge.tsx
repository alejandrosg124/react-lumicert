import { useEffect, useRef } from 'react'

interface LuxGaugeProps {
  value: number
  maxValue?: number
}

export const LuxGauge = ({ value, maxValue = 1000 }: LuxGaugeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2 + 20
    const radius = 80

    // Dibujar arco de fondo
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false)
    ctx.strokeStyle = '#2a3d4d'
    ctx.lineWidth = 15
    ctx.stroke()

    // Calcular el ángulo según el valor
    const percentage = Math.min(value / maxValue, 1)
    const angle = Math.PI + (percentage * Math.PI)

    // Dibujar arco de progreso con gradiente
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
    gradient.addColorStop(0, '#10b981') // Verde
    gradient.addColorStop(0.5, '#f59e0b') // Amarillo
    gradient.addColorStop(1, '#ef4444') // Rojo

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, angle, false)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 15
    ctx.stroke()

    // Dibujar la aguja
    const needleLength = radius - 10
    const needleX = centerX + needleLength * Math.cos(angle)
    const needleY = centerY + needleLength * Math.sin(angle)

    // Sombra de la aguja
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(needleX, needleY)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()

    // Círculo central
    ctx.shadowColor = 'transparent'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    // Círculo interior
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = '#1a2936'
    ctx.fill()

    // Dibujar marcas
    for (let i = 0; i <= 10; i++) {
      const markAngle = Math.PI + (i / 10) * Math.PI
      const innerRadius = radius - 8
      const outerRadius = radius + 2
      const x1 = centerX + innerRadius * Math.cos(markAngle)
      const y1 = centerY + innerRadius * Math.sin(markAngle)
      const x2 = centerX + outerRadius * Math.cos(markAngle)
      const y2 = centerY + outerRadius * Math.sin(markAngle)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = '#9ca3af'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [value, maxValue])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={200}
        height={140}
        className="mb-2"
      />
      <div className="text-center">
        <p className="text-white text-[32px] font-bold leading-none">{value.toFixed(0)}</p>
        <p className="text-gray-400 text-[14px] mt-1">lux</p>
      </div>
    </div>
  )
}
