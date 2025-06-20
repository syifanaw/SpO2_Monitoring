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

if (!isset($data["room"], $data["name"], $data["birth_place"], $data["birth_date"], $data["gender"], $data["blood_type"], $data["age"], $data["phone"], $data["address"])) {
    echo json_encode(["message" => "Missing required fields"]);
    exit();
}

$query = "UPDATE patients SET 
            name = ?, 
            birth_place = ?, 
            birth_date = ?, 
            gender = ?, 
            blood_type = ?, 
            age = ?, 
            phone = ?, 
            address = ? 
          WHERE room = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["message" => "Error preparing statement", "error" => $conn->error]);
    exit();
}

$stmt->bind_param("sssssiiss", 
    $data["name"], 
    $data["birth_place"], 
    $data["birth_date"], 
    $data["gender"], 
    $data["blood_type"], 
    $data["age"], 
    $data["phone"], 
    $data["address"], 
    $data["room"]
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Patient data updated successfully"]);
} else {
    echo json_encode(["message" => "Error updating patient data", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
