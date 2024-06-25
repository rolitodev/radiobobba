<?php

// Lista de orígenes permitidos
$allowed_origins = [
    'http://localhost:4200',
    'https://radiobobba.com'
];

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

// Ejecutar la consulta
$sentencia = $bd->query("SELECT name, description, rank, active FROM users WHERE active = TRUE");

// Obtener los resultados como objetos
$tipo = $sentencia->fetchAll(PDO::FETCH_OBJ);

// Devolver los resultados en formato JSON
echo json_encode($tipo);

?>
