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

// Verificar si el método de la solicitud es POST (para insertar datos)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos del cuerpo de la solicitud (asumiendo que llegan en JSON)
    $data = json_decode(file_get_contents("php://input"), true);

    // Validar y obtener los datos necesarios para el INSERT
    $idRoom = $data['idRoom'] ?? null;
    $active = $data['active'] ?? null;

    // Verificar que se recibieron ambos valores requeridos
    if ($idRoom !== null && $active !== null) {
        // Preparar la consulta SQL
        $sql = "INSERT INTO rooms (idRoom, active, created_at) VALUES (:idRoom, :active, NOW())";

        // Preparar la declaración
        $stmt = $bd->prepare($sql);

        // Asignar los parámetros y ejecutar la consulta
        $stmt->bindParam(':idRoom', $idRoom);
        $stmt->bindParam(':active', $active);

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
        echo json_encode(array("message" => "Se requieren todos los campos (idRoom y active)."));
    }

    // Finalizar la ejecución del script
    exit;
}

// Si no es una solicitud POST, continuar con la obtención de datos de usuarios activos
$sentencia = $bd->query("SELECT name, description, rank, active FROM users WHERE active = TRUE");

// Obtener los resultados como objetos
$resultados = $sentencia->fetchAll(PDO::FETCH_OBJ);

// Devolver los resultados en formato JSON
echo json_encode($resultados);

?>
