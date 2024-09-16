<?php
require_once 'connect.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $eventId = $input['id'];

    // SQL query to delete the event
    $sql = "DELETE FROM events WHERE id = $eventId";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    $conn->close();
}
