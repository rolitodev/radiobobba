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
$bd = include_once "bd.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Obtener los datos del cuerpo de la solicitud (asumiendo que llegan en JSON)
    $data = json_decode(file_get_contents("php://input"), true);

    // Validar y obtener los datos necesarios para el INSERT
    $name = $data['name'] ?? null;
    $password = $data['password'] ?? null;
    $rank = $data['rank'] ?? null;
    $active = $data['active'] ?? null;
    $description = $data['description'] ?? null;

    // Verificar que se recibieron ambos valores requeridos
    if ($name !== null && $password !== null && $rank !== null && $active !== null) {
        // Preparar la consulta SQL
        $sql = "INSERT INTO users (name, password, rank, active, description, created_at) VALUES (:name, :password, :rank, :active, :description, NOW())";

        // Preparar la declaración
        $stmt = $bd->prepare($sql);

        // Asignar los parámetros y ejecutar la consulta
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':rank', $rank);
        $stmt->bindParam(':active', $active);
        $stmt->bindParam(':description', $description);

        // Ejecutar la consulta y verificar el resultado
        if ($stmt->execute()) {
            // Éxito: devolver una respuesta JSON indicando éxito
            echo json_encode(array("message" => "Registro insertado correctamente."));
        } else {
            // Error: devolver un mensaje de error en JSON
            echo json_encode(array("message" => "Error al insertar el registro."));
        }
    } else {
        // Si falta alguno de los datos requeridos, devolver un mensaje de error
        echo json_encode(array("message" => "Se requieren todos los campos (name, password, rank y active)."));
    }

    // Finalizar la ejecución del script
    exit;
}

?>