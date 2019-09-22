<?php

// Credenciales de la BD
define('DB_USUARIO', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');

// Justo en ese orden (Host, usuario, password, nombreBD)
$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

// Forma de revisar si conectó a la BD
//echo $conn->ping();