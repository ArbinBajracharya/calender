<?php
require_once 'connect.php';

// Get the event ID from the request
$data = json_decode(file_get_contents('php://input'), true);
$eventId = $data['id'];

// Simple update query to mark the event as deleted
$sql = "UPDATE events SET is_deleted = 1 WHERE id = $eventId";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $conn->error]);
}

// Close the database connection
$conn->close();
