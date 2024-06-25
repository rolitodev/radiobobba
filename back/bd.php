<?php

$usuario = "366000";
$contraseña = "ayZykpQP23SvXyt";
$nombre_base_de_datos = "radiobobbaapi_bd";

try {
    return new PDO('mysql:host=mysql-radiobobbaapi.alwaysdata.net;dbname=' . $nombre_base_de_datos, $usuario, $contraseña);
} catch (Exception $e) {
    echo "Ocurrió algo con la base de datos: " . $e->getMessage();
}

?>