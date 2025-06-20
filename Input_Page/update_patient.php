<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

// Koneksi ke database
$host = '';
$username = '';
$password = '';
$database = '';
$port = ;

$conn = new mysqli($host, $username, $password, $database, $port);

// Periksa koneksi
if ($conn->connect_error) {
    echo json_encode(["message" => "Database connection failed", "error" => $conn->connect_error]);
    exit();
}

// Ambil JSON dari request body
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Debug JSON
if (!$data) {
    echo json_encode(["message" => "Invalid request", "error" => json_last_error_msg(), "raw" => $json]);
    exit();
}

// Validasi input
if (!isset($data["room"], $data["name"], $data["birth_place"], $data["birth_date"], $data["gender"], $data["blood_type"], $data["age"], $data["phone"], $data["address"])) {
    echo json_encode(["message" => "Missing required fields"]);
    exit();
}

// Persiapkan query UPDATE
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

// Bind parameter
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

// Eksekusi query
if ($stmt->execute()) {
    echo json_encode(["message" => "Patient data updated successfully"]);
} else {
    echo json_encode(["message" => "Error updating patient data", "error" => $stmt->error]);
}

// Tutup koneksi
$stmt->close();
$conn->close();
?>
