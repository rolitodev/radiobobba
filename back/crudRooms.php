<?php

// Lista de orígenes permitidos
$allowed_origins = ["http://localhost:4200", "https://radiobobba.com", "https://www.radiobobba.com"];

// Obtener el origen de la solicitud
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    // Solo permitir los orígenes en la lista
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Si el origen no está permitido, no configurar la cabecera
    header("HTTP/1.1 403 Forbidden");
    exit; // Salir del script si el origen no está permitido
}

// Establecer las cabeceras permitidas
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Configurar métodos permitidos

// Incluir la conexión a la base de datos
$bd = include_once "bd.php"; // Asumiendo que "bd.php" contiene la conexión PDO

// Determinar el método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

// Manejar las solicitudes según el método
switch ($method) {
    case 'POST': // Insertar una nueva room por su ID
        // Obtener datos de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);

        // Validar datos esperados (en este caso, solo el idRoom y active)
        if (isset($data['idRoom'])) {
            $idRoom = $data['idRoom'];
            $active = isset($data['active']) ? $data['active'] : true; // Por defecto se asume activo si no se especifica

            // Realizar la inserción en la base de datos
            $query = $bd->prepare("INSERT INTO rooms (idRoom, active) VALUES (:idRoom, :active)");
            $query->bindParam(':idRoom', $idRoom, PDO::PARAM_INT);
            $query->bindParam(':active', $active, PDO::PARAM_BOOL);
            
            if ($query->execute()) {
                // Éxito en la inserción
                echo json_encode(array("message" => "Room inserted successfully"));
            } else {
                // Error en la inserción
                header("HTTP/1.1 500 Internal Server Error");
                echo json_encode(array("message" => "Failed to insert room"));
            }
        } else {
            // Datos incompletos en la solicitud
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(array("message" => "Incomplete data"));
        }
        break;

    case 'PUT': // Actualizar el estado active y idRoom de una room por su id
        // Obtener datos de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);

        // Validar datos esperados (en este caso, id y active)
        if (isset($data['id']) && isset($data['idRoom']) && isset($data['active'])) {
            $id = $data['id'];
            $idRoom = $data['idRoom'];
            $active = $data['active'];

            // Actualizar el estado y idRoom en la base de datos
            $query = $bd->prepare("UPDATE rooms SET idRoom = :idRoom, active = :active WHERE id = :id");
            $query->bindParam(':id', $id, PDO::PARAM_INT);
            $query->bindParam(':idRoom', $idRoom, PDO::PARAM_INT);
            $query->bindParam(':active', $active, PDO::PARAM_BOOL);
            
            if ($query->execute()) {
                // Éxito en la actualización
                echo json_encode(array("message" => "Room idRoom and active state updated successfully"));
            } else {
                // Error en la actualización
                header("HTTP/1.1 500 Internal Server Error");
                echo json_encode(array("message" => "Failed to update room idRoom and active state"));
            }
        } else {
            // Datos incompletos en la solicitud
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(array("message" => "Incomplete data"));
        }
        break;

    default:
        // Método no permitido
        header("HTTP/1.1 405 Method Not Allowed");
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

?>