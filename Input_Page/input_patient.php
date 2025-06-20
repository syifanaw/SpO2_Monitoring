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
    die(json_encode(["message" => "Database connection failed", "error" => $conn->connect_error]));
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data || !isset($data["room"], $data["name"], $data["birth_place"], $data["birth_date"], $data["gender"], $data["blood_type"], $data["age"], $data["phone"], $data["address"])) {
    echo json_encode(["message" => "Invalid request", "error" => "Missing required fields"]);
    exit();
}

$query = "INSERT INTO patients (room, name, birth_place, birth_date, gender, blood_type, age, phone, address) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["message" => "Prepare statement failed", "error" => $conn->error]);
    exit();
}

$stmt->bind_param(
    "ssssssiss", 
    $data["room"],
    $data["name"],
    $data["birth_place"],
    $data["birth_date"],
    $data["gender"],
    $data["blood_type"],
    $data["age"], 
    $data["phone"],
    $data["address"]
);

if ($stmt->execute()) {
    echo json_encode(["message" => "Patient added successfully"]);
} else {
    echo json_encode(["message" => "Error adding patient", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
