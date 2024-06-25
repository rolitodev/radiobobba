<?php

// Lista de orígenes permitidos
$allowed_origins = [
    'http://localhost:4200',
    'https://radiobobba.com'
];

// Obtener el origen de la solicitud
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    // Permitir solo los orígenes en la lista
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Si el origen no está permitido, devolver un error
    header("HTTP/1.1 403 Forbidden");
    exit; // Salir del script si el origen no está permitido
}

// Establecer las cabeceras permitidas
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permitir solo métodos POST y OPTIONS

// Verificar el método de la solicitud
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respondemos solo con las cabeceras permitidas para preflight CORS
    exit;
}

// Incluir la conexión a la base de datos
$bd = include_once "bd.php";

// Obtener los datos de la solicitud (POST)
$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$password = $input['password'] ?? '';

// Verificar si el nombre de usuario existe y está activo
$stmt = $bd->prepare("SELECT * FROM users WHERE name = :name AND active = TRUE");
$stmt->bindParam(':name', $name);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    // Usuario no encontrado o no activo
    http_response_code(400);
    echo json_encode(['message' => 'El usuario no existe o está inactivo.']);
    exit;
}

// Verificar la contraseña
if (!password_verify($password, $user['password'])) {
    // Contraseña incorrecta
    http_response_code(401);
    echo json_encode(['message' => 'Contraseña incorrecta.']);
    exit;
}

// Responder con el token y la información del usuario
http_response_code(200);
echo json_encode([
    'message' => 'Inicio de sesión exitoso.',
    'user' => [
        'name' => $user['name'],
        'rank' => $user['rank']
    ]
]);

?>
