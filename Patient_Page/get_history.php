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

$sql = "SELECT spo2_value, waktu FROM sensor_history WHERE room = '$room' ORDER BY id DESC LIMIT 20";
$result = $conn->query($sql);

$dataPoints = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
        $dataPoints[] = $row;
    }
    $dataPoints = array_reverse($dataPoints);
}

header('Content-Type: application/json');
echo json_encode($dataPoints);
$conn->close();
?>
