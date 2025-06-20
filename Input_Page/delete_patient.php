<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$host = '';
$username = '';
$password = '';
$database = '';
$port = ;

$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
    echo json_encode(["message" => "Database connection failed", "error" => $conn->connect_error]);
    exit();
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["message" => "Invalid request", "error" => json_last_error_msg(), "raw" => $json]);
    exit();
}

if (!isset($data["room"])) {
    echo json_encode(["message" => "Room is required"]);
    exit();
}

$query = "DELETE FROM patients WHERE room = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["message" => "Error preparing statement", "error" => $conn->error]);
    exit();
}

$stmt->bind_param("s", $data["room"]);

if ($stmt->execute()) {
    echo json_encode(["message" => "Patient deleted successfully"]);
} else {
    echo json_encode(["message" => "Error deleting patient", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
