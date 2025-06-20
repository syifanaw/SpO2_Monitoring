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

if (!isset($_GET['room'])) {
    echo json_encode(['error' => 'Room parameter is missing']);
    exit;
}

$room = $_GET['room'];

$sql = "SELECT room, spo2_value, waktu, recorded_at FROM sensor_history WHERE room = ? ORDER BY recorded_at";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'SQL Error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $room);
$stmt->execute();
$result = $stmt->get_result();

$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = $row;
}

// Jika data kosong, berikan pesan
if (empty($history)) {
    echo json_encode(['message' => 'No data found']);
} else {
    echo json_encode($history);
}

$stmt->close();
$conn->close();
?>
