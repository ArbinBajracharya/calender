<?php
require_once 'connect.php';

$data = file_get_contents("php://input");
$event = json_decode($data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit();
}

if (isset($event['id']) && isset($event['title']) && isset($event['start'])) {
    $id = $conn->real_escape_string($event['id']);
    $title = $conn->real_escape_string($event['title']);
    $start = $conn->real_escape_string($event['start']);
    $end = isset($event['end']) ? $conn->real_escape_string($event['end']) : null;
    $description = $conn->real_escape_string($event['description']);
    $type = $conn->real_escape_string($event['type']);
    $status = $conn->real_escape_string($event['status']);

    $sql = "UPDATE events SET title='$title', start='$start', end='$end', description='$description', type='$type', status='$status' WHERE id='$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
}

$conn->close();
