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

// Periksa koneksi database
if ($conn->connect_error) {
    die(json_encode(["message" => "Database connection failed", "error" => $conn->connect_error]));
}

// Ambil JSON dari request body
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Validasi input
if (!$data || !isset($data["room"], $data["name"], $data["birth_place"], $data["birth_date"], $data["gender"], $data["blood_type"], $data["age"], $data["phone"], $data["address"])) {
    echo json_encode(["message" => "Invalid request", "error" => "Missing required fields"]);
    exit();
}

// Persiapkan query
$query = "INSERT INTO patients (room, name, birth_place, birth_date, gender, blood_type, age, phone, address) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["message" => "Prepare statement failed", "error" => $conn->error]);
    exit();
}

// Bind parameter
$stmt->bind_param(
    "ssssssiss", // Semua diubah ke string kecuali "age" (i: integer)
    $data["room"],
    $data["name"],
    $data["birth_place"],
    $data["birth_date"],
    $data["gender"],
    $data["blood_type"],
    $data["age"], // Ini tetap integer
    $data["phone"],
    $data["address"]
);

// Eksekusi query
if ($stmt->execute()) {
    echo json_encode(["message" => "Patient added successfully"]);
} else {
    echo json_encode(["message" => "Error adding patient", "error" => $stmt->error]);
}

// Tutup statement dan koneksi
$stmt->close();
$conn->close();
?>
