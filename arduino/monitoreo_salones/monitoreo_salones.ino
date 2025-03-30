#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Configuración del WiFi
#define WIFI_SSID "" // Importante
#define WIFI_PASSWORD "" // Importante

// Configuración de Firebase
#define FIREBASE_HOST "" // Importante
#define FIREBASE_API_KEY "" // Importante

// Configuración del sensor
#define FOTOSENSOR_PIN A0
#define DEVICE_NAME "Sensor_1"
#define DEVICE_LOCATION "Sala"

// Objetos de Firebase
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson json;

// Configuración NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

String deviceID = "";

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
  
  // ID único basado en MAC
  deviceID = WiFi.macAddress();
  deviceID.replace(":", "");

  // Inicializar NTP
  timeClient.begin();
  timeClient.setTimeOffset(0);

  // Configurar Firebase
  config.database_url = FIREBASE_HOST;
  config.api_key = FIREBASE_API_KEY;
  Firebase.begin(&config, &auth);

  // Autenticación anónima
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Autenticación anónima exitosa");
  } else {
    Serial.print("Error en autenticación: ");
    Serial.println(firebaseData.errorReason());
  }

  Firebase.reconnectWiFi(true);

  // Registrar dispositivo en Firebase
  registrarDispositivo();
}

void loop() {
  timeClient.update();
  
  int valorLuz = analogRead(FOTOSENSOR_PIN);
  Serial.print("Valor del fotosensor: ");
  Serial.println(valorLuz);

  // Llamar a la función para actualizar Firebase
  enviarDatosFirebase(valorLuz);

  delay(60000); // Enviar datos cada minuto
}

void registrarDispositivo() {
  json.clear();
  json.add("id", deviceID);
  json.add("nombre", DEVICE_NAME);
  json.add("ubicacion", DEVICE_LOCATION);
  json.add("mac", WiFi.macAddress());
  json.add("ip", WiFi.localIP().toString());

  String path = "/sensores/" + deviceID;

  if (Firebase.updateNode(firebaseData, path, json)) {
    Serial.println("Dispositivo registrado correctamente en Firebase");
  } else {
    Serial.print("Error al registrar dispositivo: ");
    Serial.println(firebaseData.errorReason());
  }
}

void enviarDatosFirebase(int valorLuz) {
  // Obtener timestamp actual
  unsigned long timestamp = timeClient.getEpochTime();
  
  json.clear();
  json.add("valor", valorLuz);
  json.add("timestamp", timestamp);
  
  // Ruta donde se actualizarán los datos del sensor
  String path = "/sensores/" + deviceID;

  if (Firebase.updateNode(firebaseData, path, json)) {
    Serial.println("Datos actualizados en Firebase correctamente");
  } else {
    Serial.print("Error al actualizar datos: ");
    Serial.println(firebaseData.errorReason());
  }
}
