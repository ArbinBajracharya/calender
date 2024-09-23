<?php
// Connect to your database
include 'connect.php';

header('Content-Type: application/json');

// Get raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if data is valid
if (isset($data['title']) && isset($data['start']) && isset($data['type']) && isset($data['badge']) && isset($data['status'])) {

    $title = $data['title'];
    $start = $data['start'];
    $end = isset($data['end']) ? $data['end'] : null;
    $description = isset($data['description']) ? $data['description'] : null;
    $type = $data['type'];
    $badge = $data['badge'];
    $status = $data['status'];

    // SQL query
    $sql = "INSERT INTO events (title, start, end, description, type, badge, status) 
            VALUES ('$title', '$start', '$end', '$description', '$type', '$badge', '$status')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }

    $conn->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input data']);
}