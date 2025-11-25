#!/usr/bin/env python3
"""
Simulador MQTT para LumiCert
Simula el envío de datos de 3 luminarias cada 5 segundos
Basado en el sketch_LumiCert.ino
"""

import json
import time
import random
from datetime import datetime
import paho.mqtt.client as mqtt

# ======== Configuración MQTT ========
MQTT_BROKER = "lac46cb4.ala.us-east-1.emqxsl.com"
MQTT_PORT = 8883
MQTT_TOPIC = "test"
MQTT_USER = "stevLaptop"
MQTT_PASSWORD = "123"
MQTT_USE_TLS = True

# ======== Parámetros de simulación ========
SEND_INTERVAL = 5  # segundos

# Rangos de valores para simulación
LUX_RANGE = (0, 300)  # lux
VOLTAGE_RANGE = (11.5, 12.5)  # Volts
CURRENT_RANGE = (40, 100)  # mA (normal operation)
POWER_RANGE = (0.5, 1.2)  # Watts

# Probabilidades de eventos (%)
PROB_OVERCURRENT = 5  # probabilidad de sobreconsumo
PROB_FAIL = 3  # probabilidad de falla
PROB_THEFT = 2  # probabilidad de robo
PROB_DAY_CONSUMPTION = 10  # probabilidad de consumo de día


class LumiCertSimulator:
    def __init__(self):
        self.client = mqtt.Client()
        self.client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
        
        if MQTT_USE_TLS:
            import ssl
            self.client.tls_set(cert_reqs=ssl.CERT_NONE)
            self.client.tls_insecure_set(True)  # Para desarrollo
        
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        
        # Estado de las luminarias
        self.relay_states = [False, False, False]
        self.bank_states = [False, False, False]
        self.auto_mode = True
        
        # Contadores para simular eventos consecutivos
        self.overcurrent_count = [0, 0, 0]
        self.fail_count = [0, 0, 0]
        self.day_consumption_count = [0, 0, 0]
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("✅ Conectado al broker MQTT")
            client.publish(f"{MQTT_TOPIC}/status", "online", retain=True)
        else:
            print(f"❌ Error de conexión: {rc}")
    
    def on_disconnect(self, client, userdata, rc):
        print(f"⚠️  Desconectado del broker (rc={rc})")
    
    def connect(self):
        """Conectar al broker MQTT"""
        print(f"Conectando a {MQTT_BROKER}:{MQTT_PORT}...")
        try:
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()
            time.sleep(2)  # Esperar conexión
            return True
        except Exception as e:
            print(f"❌ Error al conectar: {e}")
            return False
    
    def generate_luminaria_data(self, lum_id, lux):
        """Generar datos para una luminaria"""
        # Mapear ID de luminaria (4,5,6) a índice de array (0,1,2)
        array_idx = lum_id - 4
        
        # Decidir si el relé está encendido basado en lux
        if self.auto_mode:
            self.relay_states[array_idx] = lux < 60  # ON si lux < 60
        
        relay_on = self.relay_states[array_idx]
        
        # Generar valores base
        if relay_on:
            voltage = random.uniform(*VOLTAGE_RANGE)
            current = random.uniform(*CURRENT_RANGE)
            power = voltage * (current / 1000)
        else:
            voltage = 0
            current = 0
            power = 0
        
        # Simular eventos
        fail_low_current = False
        theft = False
        overcurrent = False
        
        if relay_on:
            # Falla: relay ON pero corriente muy baja
            if random.random() < (PROB_FAIL / 100):
                current = random.uniform(0, 4)
                fail_low_current = True
                self.fail_count[array_idx] += 1
            else:
                self.fail_count[array_idx] = 0
            
            # Sobreconsumo: corriente > 112.5 mA
            if random.random() < (PROB_OVERCURRENT / 100):
                current = random.uniform(115, 150)
                overcurrent = True
                self.overcurrent_count[array_idx] += 1
            else:
                self.overcurrent_count[array_idx] = 0
        else:
            # Robo: relay OFF pero hay corriente
            if random.random() < (PROB_THEFT / 100):
                current = random.uniform(10, 30)
                theft = True
        
        # Consumo de día: relay ON con lux alto
        if relay_on and lux > 200:
            if random.random() < (PROB_DAY_CONSUMPTION / 100):
                self.day_consumption_count[array_idx] += 1
        else:
            self.day_consumption_count[array_idx] = 0
        
        # Recalcular power si hubo cambios
        if relay_on:
            power = voltage * (current / 1000)
        
        return {
            "id": lum_id,
            "name": f"Luminaria {lum_id}",
            "relay": relay_on,
            "ok": True,
            "V": round(voltage, 2),
            "mA": round(current, 1),
            "W": round(power, 3),
            "fail_low_current": fail_low_current,
            "theft": theft,
            "overcurrent": overcurrent
        }
    
    def generate_payload(self):
        """Generar payload completo como el sketch de Arduino"""
        now = datetime.now()
        
        # Generar lux (simular día/noche)
        hour = now.hour
        if 6 <= hour < 18:  # Día
            lux = random.uniform(200, 1000)
        else:  # Noche
            lux = random.uniform(0, 50)
        
        # Generar datos de luminarias 4, 5 y 6
        luminarias = [
            self.generate_luminaria_data(4, lux),
            self.generate_luminaria_data(5, lux),
            self.generate_luminaria_data(6, lux)
        ]
        
        # Construir payload
        payload = {
            "ts": int(now.timestamp()),
            "ts_iso": now.strftime("%Y-%m-%dT%H:%M:%S"),
            "modo": "AUTO" if self.auto_mode else "MANUAL",
            "lux": round(lux, 1),
            "alarms": {
                "bh1_fail": random.random() < 0.01,  # 1% probabilidad
                "bh_discrep": random.random() < 0.01
            },
            "bank": {
                "C1": self.bank_states[0],
                "C2": self.bank_states[1],
                "C3": self.bank_states[2]
            },
            "luminarias": luminarias
        }
        
        return payload
    
    def send_data(self):
        """Enviar datos por MQTT"""
        payload = self.generate_payload()
        payload_json = json.dumps(payload)
        
        result = self.client.publish(MQTT_TOPIC, payload_json, qos=1, retain=True)
        
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            print(f"📤 Datos enviados ({len(payload_json)} bytes)")
            print(f"   Lux: {payload['lux']:.1f}")
            print(f"   Luminarias: ", end="")
            for lum in payload['luminarias']:
                status = "ON" if lum['relay'] else "OFF"
                flags = []
                if lum['fail_low_current']:
                    flags.append("FALLA")
                if lum['overcurrent']:
                    flags.append("SOBRE")
                if lum['theft']:
                    flags.append("ROBO")
                
                flag_str = f" [{','.join(flags)}]" if flags else ""
                print(f"L{lum['id']}:{status}{flag_str} ", end="")
            print()
            
            # Mostrar contadores de eventos consecutivos
            for i in range(3):
                if self.overcurrent_count[i] >= 3:
                    print(f"   ⚠️  L{i+1}: 3+ sobreconsumos consecutivos!")
                if self.fail_count[i] >= 3:
                    print(f"   ❌ L{i+1}: 3+ fallas consecutivas!")
                if self.day_consumption_count[i] >= 3:
                    print(f"   ☀️  L{i+1}: 3+ consumos de día consecutivos!")
        else:
            print(f"❌ Error al enviar: {result.rc}")
    
    def run(self):
        """Ejecutar simulador"""
        if not self.connect():
            return
        
        print(f"\n🚀 Simulador iniciado - Enviando cada {SEND_INTERVAL}s")
        print(f"📍 Topic: {MQTT_TOPIC}")
        print(f"🔧 Presiona Ctrl+C para detener\n")
        
        try:
            while True:
                self.send_data()
                time.sleep(SEND_INTERVAL)
        except KeyboardInterrupt:
            print("\n\n⏹️  Deteniendo simulador...")
            self.client.publish(f"{MQTT_TOPIC}/status", "offline", retain=True)
            self.client.loop_stop()
            self.client.disconnect()
            print("✅ Simulador detenido")


if __name__ == "__main__":
    print("=" * 60)
    print("  LumiCert MQTT Simulator")
    print("  Simula 3 luminarias con datos realistas")
    print("=" * 60)
    print()
    
    simulator = LumiCertSimulator()
    simulator.run()
