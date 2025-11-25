/*****************************************************
 * Sistema IoT Alumbrado Público (3 luminarias = 3x HW-479)
 * - INA antes del relé: robo de energía
 * - Sobreconsumo con umbral para HW-479 (1 módulo por luminaria)
 * - BH1750 redundantes, INA3221+INA219, DS3231
 * - Control por lux + banco capacitores (PF simulado)
 * - MQTT cada 10 s (topic: "test")
 * - Hora local: NTP + RTC DS3231 (Colombia UTC-5)
 *****************************************************/

#include <ArduinoJson.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <math.h>
#include <BH1750.h>
#include "RTClib.h"
#include "Adafruit_INA3221.h"
#include <Adafruit_INA219.h>
#include <time.h>              // NTP / hora del sistema

// ======== Red y MQTT ========
WiFiClientSecure espClient;
PubSubClient client(espClient);

const char* ssid = "iPhone de Johan S.";
const char* password = "sebastian";

const char* mqtt_server   = "lac46cb4.ala.us-east-1.emqxsl.com";
const int   mqtt_port     = 8883;
const char* mqtt_topic    = "test";
const char* mqtt_status   = "test/status";
const char* mqtt_cmd      = "test/cmd";
const char* mqtt_user     = "stevLaptop";
const char* mqtt_password = "123";

// ======== Direcciones I2C ========
#define BH1_ADDR     0x23
#define BH2_ADDR     0x5C
#define INA3221_ADDR 0x40
#define INA219_ADDR  0x41
#define RTC_ADDR     0x68

// ======== Objetos ========
BH1750 bh1(BH1_ADDR);
BH1750 bh2(BH2_ADDR);
RTC_DS3231 rtc;
Adafruit_INA3221 ina3221;
Adafruit_INA219  ina219(INA219_ADDR);

// ======== Relés (activos en LOW) ========
const int RL_L1 = 23;  // L1 -> INA3221 CH1
const int RL_L2 = 18;  // L2 -> INA3221 CH2
const int RL_L3 = 19;  // L3 -> INA219  CH3
const int RL_C1 = 16;  // Banco paso 1
const int RL_C2 = 17;  // Banco paso 2
const int RL_C3 = 4;   // Banco paso 3
const bool RELAY_ACTIVE_LOW = true;

// ======== Parámetros de control ========
const float LUX_ON  = 60.0f;
const float LUX_OFF = 100.0f;

const float LAMP_FAIL_mA = 5.0f;   // Falla si relay ON y <5 mA
const float THEFT_mA     = 5.0f;   // Robo si relay OFF y >5 mA

// ---- DEFINICIÓN FINAL: 1 módulo HW-479 por luminaria ----
const int   HW479_PER_LAMP = 1;     // 3 luminarias = 3 módulos HW-479 (1 por luminaria)
const float NOM_PER_MOD_mA = 45.0f; // consumo tope RGB por HW-479 ~45 mA
const float OC_FACTOR      = 2.5f;  // umbral = 2.5x nominal para evitar falsos positivos

// Umbrales de sobreconsumo por luminaria
const float L1_OVER_mA = NOM_PER_MOD_mA * HW479_PER_LAMP * OC_FACTOR; // 112.5 mA
const float L2_OVER_mA = NOM_PER_MOD_mA * HW479_PER_LAMP * OC_FACTOR; // 112.5 mA
const float L3_OVER_mA = NOM_PER_MOD_mA * HW479_PER_LAMP * OC_FACTOR; // 112.5 mA

// PF simulado
float PF_TARGET           = 0.95f;
const float PF_HYST_HIGH  = 0.02f;
const float PF_HYST_LOW   = 0.03f;

// ======== Estado ========
bool lampOn = false;                  // conjunto luminarias en AUTO
bool c1=false, c2=false, c3=false;
bool alarmBH = false;
bool failBH1 = false;

struct ChannelData {
  float V;   // Volts
  float mA;  // mA
  float W;   // Watts
  bool  valid;
};

bool autoMode = true;                 // true=AUTO, false=MANUAL
bool forceL[3] = {false,false,false};
bool forceC[3] = {false,false,false};

bool lampFail[3]    = {false,false,false};
bool theft[3]       = {false,false,false};
bool overCurrent[3] = {false,false,false};  // sobreconsumo

// ======== Utils relés ========
inline void setRelay(int pin, bool on) {
  if (RELAY_ACTIVE_LOW) digitalWrite(pin, on ? LOW : HIGH);
  else                  digitalWrite(pin, on ? HIGH : LOW);
}
inline bool getRelayState(int pin) {
  return RELAY_ACTIVE_LOW ? (digitalRead(pin)==LOW) : (digitalRead(pin)==HIGH);
}

// ======== Prototipos ========
void conectarWiFi();
void conectarMQTT();
void printHelp();
void printStatus();
void handleSerial();

ChannelData readINA3221_CH(uint8_t ch);
ChannelData readINA219_as_CH3();
float readLuxRedundant();

void leerCanales(ChannelData &d1, ChannelData &d2, ChannelData &d3);
void controlLuminariasPorLux(float lux);
float totalCurrentA(const ChannelData& a, const ChannelData& b, const ChannelData& c);
float calcular_PF_sim(float I_total_A);
void  controlBanco(float PF_obj, float I_total_A);

void detectarFallasRobosYOver(const ChannelData& d1, const ChannelData& d2, const ChannelData& d3);
void applyManualLogic();
void applyAutoLogic(float lux, const ChannelData& d1, const ChannelData& d2, const ChannelData& d3);

// Hora
void initTimeAndRTC();
void makeLocalISO(char* iso, size_t n);

// ======== Conectividad ========
void conectarWiFi() {
  Serial.printf("Conectando a %s...\n", ssid);
  WiFi.begin(ssid, password);
  int intento = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
    intento++;
    if (intento > 20) {
      Serial.println("No se pudo conectar a WiFi. Reiniciando...");
      ESP.restart();
    }
  }
  Serial.println("\nWiFi conectado.");
}

void conectarMQTT() {
  while (!client.connected()) {
    Serial.print("Conectando al broker MQTT...");
    String clientId = "ESP32-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_password,
                       mqtt_status, 1, true, "offline")) {
      Serial.println("OK");
      client.publish(mqtt_status, "online", true);
      client.subscribe(mqtt_cmd);
    } else {
      Serial.print("Error, rc=");
      Serial.print(client.state());
      Serial.println(" Reintento en 5 s...");
      delay(5000);
    }
  }
}

// ======== Lecturas ========
ChannelData readINA3221_CH(uint8_t ch) {
  ChannelData d;
  float v  = ina3221.getBusVoltage(ch);
  float ia = ina3221.getCurrentAmps(ch);
  d.valid = !(isnan(v) || isnan(ia));
  if (!d.valid) { d.V=0; d.mA=0; d.W=0; return d; }
  d.V  = v;
  d.mA = ia * 1000.0f;
  d.W  = v * ia;
  return d;
}

ChannelData readINA219_as_CH3() {
  ChannelData d;
  float vload   = ina219.getBusVoltage_V();
  float shuntmV = ina219.getShuntVoltage_mV();
  float i_mA    = ina219.getCurrent_mA();
  float i_A     = i_mA / 1000.0f;

  if (isnan(vload) || isnan(i_mA)) { d.valid=false; d.V=0; d.mA=0; d.W=0; return d; }
  float v_total = vload + (shuntmV / 1000.0f);

  d.valid = true;
  d.V  = v_total;
  d.mA = i_mA;
  d.W  = v_total * i_A;
  return d;
}

float readLuxRedundant() {
  float l1 = bh1.readLightLevel();     // 0x23
  float l2 = bh2.readLightLevel();     // 0x5C
  failBH1 = (l1 <= 0 || l1 > 65535);
  float used = failBH1 ? l2 : l1;
  if (!failBH1 && l2 > 0 && fabs(l1 - l2) > (0.15f * l1)) alarmBH = true;
  else alarmBH = false;
  return used;
}

// ======== Leer canales con condiciones ========
void leerCanales(ChannelData &d1, ChannelData &d2, ChannelData &d3) {
  d1 = readINA3221_CH(1);
  d2 = readINA3221_CH(2);
  d3 = readINA219_as_CH3();

  // Si los relés están OFF, las lecturas se fuerzan a cero (evita ruido/falsos positivos)
  if (!getRelayState(RL_L1)) { d1.V = d1.mA = d1.W = 0; d1.valid = true; }
  if (!getRelayState(RL_L2)) { d2.V = d2.mA = d2.W = 0; d2.valid = true; }
  if (!getRelayState(RL_L3)) { d3.V = d3.mA = d3.W = 0; d3.valid = true; }

  // Fallback de L2 SOLO si L2 está ON, L2 no tiene medición útil y L1 es válida
  if (getRelayState(RL_L2) && ( !d2.valid || d2.mA <= 0.5f ) && d1.valid) {
    d2 = d1;
    d2.mA += 1.0f;   // pequeño offset para distinguir
    d2.W  += 0.001f;
    d2.V  += 0.05f;
    d2.valid = true;
  }
}

// ======== Control ========
void controlLuminariasPorLux(float lux) {
  if (!lampOn && lux < LUX_ON) {
    lampOn = true;
    setRelay(RL_L1,true); setRelay(RL_L2,true); setRelay(RL_L3,true);
    Serial.println("Luminarias: ON (por lux)");
  }
  if (lampOn && lux > LUX_OFF) {
    lampOn = false;
    setRelay(RL_L1,false); setRelay(RL_L2,false); setRelay(RL_L3,false);
    Serial.println("Luminarias: OFF (por lux)");
  }
}

float totalCurrentA(const ChannelData& a, const ChannelData& b, const ChannelData& c) {
  float sum_mA = 0.0f;
  if (a.valid) sum_mA += a.mA;
  if (b.valid) sum_mA += b.mA;
  if (c.valid) sum_mA += c.mA;
  return sum_mA / 1000.0f;
}

float calcular_PF_sim(float I_total_A) {
  int pasos = (c1?1:0) + (c2?1:0) + (c3?1:0);
  float PF = 0.85f + 0.04f*pasos - 0.01f*(I_total_A/0.05f);
  if (PF < 0.80f) PF = 0.80f;
  if (PF > 0.99f) PF = 0.99f;
  return PF;
}

void controlBanco(float PF_obj, float I_total_A) {
  float PF = calcular_PF_sim(I_total_A);
  if (PF < PF_obj - PF_HYST_LOW) {
    if (!c1)      { setRelay(RL_C1,true); c1=true; }
    else if (!c2) { setRelay(RL_C2,true); c2=true; }
    else if (!c3) { setRelay(RL_C3,true); c3=true; }
  } else if (PF > PF_obj + PF_HYST_HIGH) {
    if (c3)       { setRelay(RL_C3,false); c3=false; }
    else if (c2)  { setRelay(RL_C2,false); c2=false; }
    else if (c1)  { setRelay(RL_C1,false); c1=false; }
  }
  Serial.printf("PF_sim=%.2f  pasos=[%d%d%d]\n", PF, c1, c2, c3);
}

// ======== Falla / Robo / Sobreconsumo ========
void detectarFallasRobosYOver(const ChannelData& d1, const ChannelData& d2, const ChannelData& d3) {
  // Falla por baja corriente (relay ON y mA bajos)
  lampFail[0] = getRelayState(RL_L1) && d1.valid && (d1.mA < LAMP_FAIL_mA);
  lampFail[1] = getRelayState(RL_L2) && d2.valid && (d2.mA < LAMP_FAIL_mA);
  lampFail[2] = getRelayState(RL_L3) && d3.valid && (d3.mA < LAMP_FAIL_mA);

  // Robo (relay OFF y mA significativos) — el INA está antes del relé
  theft[0] = !getRelayState(RL_L1) && d1.valid && (d1.mA > THEFT_mA);
  theft[1] = !getRelayState(RL_L2) && d2.valid && (d2.mA > THEFT_mA);
  theft[2] = !getRelayState(RL_L3) && d3.valid && (d3.mA > THEFT_mA);

  // Sobreconsumo (relay ON y mA > umbral para HW-479)
  overCurrent[0] = getRelayState(RL_L1) && d1.valid && (d1.mA > L1_OVER_mA);
  overCurrent[1] = getRelayState(RL_L2) && d2.valid && (d2.mA > L2_OVER_mA);
  overCurrent[2] = getRelayState(RL_L3) && d3.valid && (d3.mA > L3_OVER_mA);
}

// ======== Modos ========
void applyManualLogic() {
  setRelay(RL_L1, forceL[0]);
  setRelay(RL_L2, forceL[1]);
  setRelay(RL_L3, forceL[2]);
  setRelay(RL_C1, forceC[0]); c1 = forceC[0];
  setRelay(RL_C2, forceC[1]); c2 = forceC[1];
  setRelay(RL_C3, forceC[2]); c3 = forceC[2];
}

void applyAutoLogic(float lux, const ChannelData& d1, const ChannelData& d2, const ChannelData& d3) {
  controlLuminariasPorLux(lux);
  float I_total_A = totalCurrentA(d1, d2, d3);
  controlBanco(PF_TARGET, I_total_A);
}

// ======== Serial (opcional) ========
void printHelp() {
  Serial.println(F("\n== Comandos por Serial =="));
  Serial.println(F("MODO AUTO / MODO MANUAL"));
  Serial.println(F("SET PF <0.85..0.99>"));
  Serial.println(F("STATUS"));
  Serial.println();
}

void printStatus() {
  Serial.printf("Modo: %s\n", autoMode ? "AUTO" : "MANUAL");
  Serial.printf("Relés L:[%d%d%d]  C:[%d%d%d]\n",
    getRelayState(RL_L1), getRelayState(RL_L2), getRelayState(RL_L3),
    c1, c2, c3);
  Serial.printf("PF_target=%.2f\n", PF_TARGET);
  Serial.printf("Umbral sobreconsumo (mA): L1=%.1f  L2=%.1f  L3=%.1f\n",
                L1_OVER_mA, L2_OVER_mA, L3_OVER_mA);
}

void handleSerial() {
  static String line;
  while (Serial.available()) {
    char ch = Serial.read();
    if (ch == '\r') continue;
    if (ch != '\n') { line += ch; if (line.length()>64) line=""; continue; }
    line.trim(); line.toUpperCase();

    if (line == "HELP") { printHelp(); }
    else if (line == "STATUS") { printStatus(); }
    else if (line == "MODO AUTO") { autoMode = true;  Serial.println(F("✔ Modo AUTO activo.")); }
    else if (line == "MODO MANUAL") { autoMode = false; Serial.println(F("✔ Modo MANUAL activo. Usa FORCE ...")); }
    line = "";
  }
}

// ======== Hora: NTP + RTC ========
void initTimeAndRTC() {
  // Zona horaria Colombia (UTC-5, sin DST). Formato POSIX TZ:
  // "COT5" => offset fijo de -5 horas respecto a UTC.
  setenv("TZ", "COT5", 1);
  tzset();

  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Sincronizando NTP");
  uint32_t start = millis();
  time_t now = 0;
  while ((millis() - start) < 15000) {
    now = time(nullptr);
    if (now > 1700000000) break; // ~2023-11-14
    Serial.print(".");
    delay(500);
  }
  Serial.println();

  if (now > 1700000000) {
    struct tm *lt = localtime(&now);
    DateTime dt(lt->tm_year + 1900, lt->tm_mon + 1, lt->tm_mday,
                lt->tm_hour, lt->tm_min, lt->tm_sec);
    rtc.adjust(dt);
    Serial.println("RTC ajustado desde NTP.");
  } else {
    Serial.println("No se obtuvo NTP. Se usará el RTC actual.");
  }
}

void makeLocalISO(char* iso, size_t n) {
  DateTime nowRTC = rtc.now();
  snprintf(iso, n, "%04d-%02d-%02dT%02d:%02d:%02d",
           nowRTC.year(), nowRTC.month(), nowRTC.day(),
           nowRTC.hour(), nowRTC.minute(), nowRTC.second());
}

// ======== Setup ========
unsigned long lastSend = 0;   // temporizador de envío

void setup() {
  Serial.begin(115200);
  delay(200);

  espClient.setInsecure();               // En producción: usar setCACert()
  conectarWiFi();

  if (!rtc.begin()) {
    Serial.println("ERROR: DS3231 no encontrado");
  } else {
    initTimeAndRTC();
  }

  client.setServer(mqtt_server, mqtt_port);
  client.setBufferSize(1024);

  pinMode(RL_L1, OUTPUT); pinMode(RL_L2, OUTPUT); pinMode(RL_L3, OUTPUT);
  pinMode(RL_C1, OUTPUT); pinMode(RL_C2, OUTPUT); pinMode(RL_C3, OUTPUT);

  setRelay(RL_L1,false); setRelay(RL_L2,false); setRelay(RL_L3,false);
  setRelay(RL_C1,false); setRelay(RL_C2,false); setRelay(RL_C3,false);

  Wire.begin(21,22);   // SDA=21, SCL=22

  if (!bh1.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, BH1_ADDR))
    Serial.println("ERROR: BH1750 principal (0x23) no responde");
  if (!bh2.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, BH2_ADDR))
    Serial.println("ERROR: BH1750 respaldo (0x5C) no responde");

  if (!ina3221.begin()) Serial.println("ERROR: INA3221 no encontrado");
  else                  Serial.println("INA3221 OK");

  if (!ina219.begin())  Serial.println("ERROR: INA219 (0x41) no detectado");
  else {
    ina219.setCalibration_16V_400mA();
    Serial.println("INA219 OK (0x41, cal 16V/400mA)");
  }

  Serial.println("Sistema listo.");
  printHelp();
}

// ======== Loop ========
void loop() {
  handleSerial();

  if (!client.connected()) conectarMQTT();
  client.loop();

  unsigned long ms = millis();
  if (ms - lastSend >= 10000) {   // cada 10 s
    lastSend = ms;

    // 1) Sensores
    float lux = readLuxRedundant();  // usa BH redundantes y actualiza flags
    ChannelData d1, d2, d3;
    leerCanales(d1, d2, d3);

    // 2) Detecciones
    detectarFallasRobosYOver(d1, d2, d3);

    // 3) Control según modo
    if (autoMode) applyAutoLogic(lux, d1, d2, d3);
    else          applyManualLogic();

    // 4) JSON y publicación
    DateTime now = rtc.now();
    char iso[25];
    makeLocalISO(iso, sizeof(iso));

    StaticJsonDocument<800> doc;
    doc["ts"]      = (uint32_t)now.unixtime();
    doc["ts_iso"]  = iso;
    doc["modo"]    = autoMode ? "AUTO" : "MANUAL";
    doc["lux"]     = lux;

    JsonObject alarms = doc.createNestedObject("alarms");
    alarms["bh1_fail"]   = failBH1;
    alarms["bh_discrep"] = alarmBH;

    JsonObject rel = doc.createNestedObject("bank");
    rel["C1"] = c1; rel["C2"] = c2; rel["C3"] = c3;

    JsonArray lamps = doc.createNestedArray("luminarias");
    auto pushLamp = [&](int id, const char* name, int pinRelay, const ChannelData& d,
                        bool fail, bool rob, bool over){
      JsonObject L = lamps.createNestedObject();
      L["id"]    = id;
      L["name"]  = name;
      L["relay"] = getRelayState(pinRelay);
      L["ok"]    = d.valid;
      L["V"]     = d.V;
      L["mA"]    = d.mA;
      L["W"]     = d.W;
      L["fail_low_current"] = fail;
      L["theft"]            = rob;
      L["overcurrent"]      = over;     // sobreconsumo
    };
    pushLamp(1, "Luminaria 1", RL_L1, d1, lampFail[0], theft[0], overCurrent[0]);
    pushLamp(2, "Luminaria 2", RL_L2, d2, lampFail[1], theft[1], overCurrent[1]);
    pushLamp(3, "Luminaria 3", RL_L3, d3, lampFail[2], theft[2], overCurrent[2]);

    char payload[1024];
    size_t n = serializeJson(doc, payload, sizeof(payload));
    Serial.println(payload);

    if (client.connected()) {
      bool ok = client.publish(mqtt_topic, (uint8_t*)payload, n, true); // retained
      Serial.printf("MQTT publish -> [%s]: %s (bytes=%u)\n",
                    mqtt_topic, ok ? "OK" : "FAIL", (unsigned)n);
      if (!ok) Serial.printf("client.state()=%d\n", client.state());
    } else {
      Serial.println("MQTT no conectado: no se publicó");
    }
  }
}
