#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Configuración del WiFi
#define WIFI_SSID  "OnePlus Nord 3 5G"
#define WIFI_PASSWORD "123456789"

// Configuración de Firebase
#define FIREBASE_HOST "monitoreo-5a969-default-rtdb.firebaseio.com"
#define FIREBASE_API_KEY "AIzaSyA2ua_OCt1iEi3K3rh0PzqvbX483JmaoTA"

// Configuración del sensor
#define FOTOSENSOR_PIN A0
#define DEVICE_ID "SENSOR_001"
#define DEVICE_NAME "Sensor - 9102"
#define DEVICE_LOCATION "9101"
#define ALARMA_ACTIVA true

// Objetos de Firebase
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson json;

// Configuración NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void setup() {
  Serial.begin(115200);
  pinMode(FOTOSENSOR_PIN, INPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConectado con IP: " + WiFi.localIP().toString());

  timeClient.begin();
  timeClient.setTimeOffset(0); // UTC

  config.database_url = FIREBASE_HOST;
  config.api_key = FIREBASE_API_KEY;
  Firebase.begin(&config, &auth);

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Autenticación anónima exitosa");
  } else {
    Serial.print("Error en autenticación: ");
    Serial.println(firebaseData.errorReason());
  }

  Firebase.reconnectWiFi(true);

  registrarDispositivo();
}

void loop() {
  timeClient.update();

  int valorLuz = analogRead(FOTOSENSOR_PIN);
  Serial.print("Valor del fotosensor: ");
  Serial.println(valorLuz);

  enviarDatosFirebase(valorLuz);

  delay(1000);
}

void registrarDispositivo() {
  json.clear();
  json.add("id", DEVICE_ID);
  json.add("nombre", DEVICE_NAME);
  json.add("ubicacion", DEVICE_LOCATION);
  json.add("mac", WiFi.macAddress());
  json.add("ip", WiFi.localIP().toString());
  json.add("alarmaActiva", ALARMA_ACTIVA);
  json.add("valor", analogRead(FOTOSENSOR_PIN));
  
  String statusStr = analogRead(FOTOSENSOR_PIN) <= 200 ? "Cerrado" : "Abierto";
  json.add("status", statusStr);

  String path = "/sensores/" + String(DEVICE_ID);

  if (Firebase.set(firebaseData, path, json)) {
    Serial.println("Dispositivo registrado correctamente");
  } else {
    Serial.println("Error al registrar dispositivo: " + firebaseData.errorReason());
  }

  // Enviar timestamp por separado con serverTimestamp()
  Firebase.setTimestamp(firebaseData, path + "/timestamp");
}

void enviarDatosFirebase(int valorLuz) {
  json.clear();
  json.add("valor", valorLuz);
  json.add("status", valorLuz <= 200 ? "Cerrado" : "Abierto");

  String path = "/sensores/" + String(DEVICE_ID);

  if (Firebase.updateNode(firebaseData, path, json)) {
    Serial.println("Datos actualizados correctamente");
  } else {
    Serial.println("Error al actualizar datos: " + firebaseData.errorReason());
  }

  Firebase.setTimestamp(firebaseData, path + "/timestamp");
}
