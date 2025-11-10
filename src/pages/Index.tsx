export const Index = () => {
  return (
    <div className="w-full min-h-screen relative bg-[#0a1219] p-2 flex gap-2">
      {/* Panel izquierdo - Sectores y Daños */}
      <div className="w-[290px] flex flex-col gap-2">
        {/* Sectores */}
        <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[28px] font-bold mb-4">Sectores</h2>
          
          <div className="bg-[#394d5c] rounded-[15px] p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-[20px] font-medium">La Flora</span>
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-b from-[#ef0000] to-[#8d375f]"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-[20px] font-medium">El Caney</span>
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-b from-[#ef0000] to-[#8d375f]"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-white text-[22px] font-medium">Total:</div>
            <div className="text-white text-[22px] font-medium">Funcionando:</div>
          </div>
        </div>

        {/* Daños reportados */}
        <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[24px] font-bold text-center mb-4">Daños reportados</h2>
          
          <div className="bg-[#2a3d4d] rounded-[20px] p-4 flex items-start gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-[#3d5161] flex items-center justify-center text-[24px] flex-shrink-0">
              📋
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-[15px] font-semibold">Reporte</span>
                <span className="text-gray-400 text-[14px]">9:41 AM</span>
              </div>
              <p className="text-white text-[14px]">Luminaria apagada en La Flora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel central - Gráficos y estadísticas */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Cards superiores */}
        <div className="flex gap-2">
          <div className="rounded-[20px] bg-[#1a2936] p-4 flex-1">
            <h3 className="text-white text-[13px] font-bold text-center mb-2">Consumo Total del Mes (kWh)</h3>
            <p className="text-gray-400 text-[11px] text-center">350 kWh este mes</p>
          </div>
          <div className="rounded-[20px] bg-[#1a2936] p-4 flex-1">
            <h3 className="text-white text-[13px] font-bold text-center mb-2">Consumo Promedio Diario (kWh/día)</h3>
            <p className="text-gray-400 text-[11px] text-center">11.6 kWh/día</p>
          </div>
          <div className="rounded-[20px] bg-[#1a2936] p-4 flex-1">
            <h3 className="text-white text-[13px] font-bold text-center mb-2">Variación vs Mes Anterior (%)</h3>
            <p className="text-gray-400 text-[11px] text-center">+8% respecto al mes pasado</p>
          </div>
        </div>

        {/* Consumo mensual */}
        <div className="rounded-[20px] bg-[#1a2936] p-6">
          <h2 className="text-white text-[28px] font-bold text-center mb-4">Consumo mensual</h2>
          <div className="bg-white rounded-[15px] p-4">
            <img src="/consumo-diario.svg" alt="Consumo diario" className="w-full h-auto" />
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
          
          <div className="space-y-3">
            {/* Notificación 1 */}
            <div className="bg-[#2a3d4d] rounded-[20px] p-4 flex items-start gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-yellow-500 flex items-center justify-center text-[24px] flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-[15px] font-semibold">Alerta</span>
                  <span className="text-gray-400 text-[14px]">9:41 AM</span>
                </div>
                <p className="text-white text-[14px]">Luminaria 5 del sector 2 dañado..</p>
              </div>
            </div>

            {/* Notificación 2 */}
            <div className="bg-[#2a3d4d] rounded-[20px] p-4 flex items-start gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-red-500 flex items-center justify-center text-[24px] flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-[15px] font-semibold">Alerta</span>
                  <span className="text-gray-400 text-[14px]">9:25 AM</span>
                </div>
                <p className="text-white text-[14px]">Aumento acústico de consumo</p>
              </div>
            </div>

            {/* Notificación 3 */}
            <div className="bg-[#2a3d4d] rounded-[20px] p-4 flex items-start gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-yellow-500 flex items-center justify-center text-[24px] flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-[15px] font-semibold">Alerta</span>
                  <span className="text-gray-400 text-[14px]">9:01 AM</span>
                </div>
                <p className="text-white text-[14px]">Luminaria 2 del sector 3 prese..</p>
              </div>
            </div>
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
