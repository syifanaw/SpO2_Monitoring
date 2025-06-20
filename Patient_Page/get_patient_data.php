<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = '';
$username = '';
$password = '';
$database = ''; 
$port = ;

$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

$room = isset($_GET['room']) ? $conn->real_escape_string($_GET['room']) : '';

if (empty($room)) {
    echo json_encode(['error' => 'Room tidak ada']);
    $conn->close();
    exit;
}

$sql = "SELECT name, birth_place, birth_date, blood_type, gender, age, phone, address 
        FROM patients WHERE room = '$room' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $data = $result->fetch_assoc();
} else {
    $data = [
        'name' => '',
        'birth_place' => '',
        'birth_date' => '',
        'blood_type' => '',
        'gender' => '',
        'age' => '',
        'phone' => '',
        'address' => 'Data pasien tidak ditemukan untuk room ' . $room
    ];
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
