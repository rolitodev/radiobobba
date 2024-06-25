<?php

// Lista de orígenes permitidos
$allowed_origins = ["http://localhost:4200", "https://radiobobba.com"];

// Obtener el origen de la solicitud
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowed_origins)) {
    // Solo permitir los orígenes en la lista
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Si el origen no está permitido, no configurar la cabecera
    header("HTTP/1.1 403 Forbidden");
    exit(); // Salir del script si el origen no está permitido
}

// Establecer las cabeceras permitidas
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Configurar métodos permitidos

$bd = include_once "bd.php";

// Ejecutar la consulta para obtener las salas activas
$sentencia = $bd->query("SELECT * FROM rooms WHERE active = TRUE");

$rooms = $sentencia->fetchAll(PDO::FETCH_OBJ);

// Función para hacer una solicitud HTTP con cURL y añadir un encabezado User-Agent
function fetchRoomData($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Establecer un timeout de 10 segundos
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Permitir seguir redirecciones
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"); // Encabezado User-Agent común

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        // Si hay un error en cURL
        $error_msg = curl_error($ch);
    }

    curl_close($ch);

    if (isset($error_msg)) {
        // Retornar el error para manejarlo fuera de la función
        return ['error' => $error_msg];
    }

    // Verificar el código HTTP de la respuesta
    if ($http_code == 200) {
        return json_decode($response);
    } else {
        return null; // Manejo de error en caso de código HTTP no exitoso
    }
}

foreach ($rooms as $room) {
    $idRoom = $room->idRoom;
    // Construir la URL de la API externa usando el idRoom
    $api_url = "https://www.habbo.es/api/public/rooms/$idRoom";

    // Obtener la respuesta de la API externa
    $externalData = fetchRoomData($api_url);
    
    // Verificar si hubo un error en la solicitud
    if (is_array($externalData) && isset($externalData['error'])) {
        // Manejar el error, aquí simplemente asignamos null y puedes agregar más lógica según sea necesario
        $room->externalData = null;
    } else {
        $room->externalData = $externalData;
    }
}

// Devolver la respuesta como JSON
echo json_encode($rooms);

?>
