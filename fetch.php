<?php

require_once 'connect.php';
header('Content-Type: application/json');

// SQL query to select the required fields
$sql = "SELECT id, title, start, end, description, type, badge, status FROM events";
$result = $conn->query($sql);
$events = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Build the event array
        $event = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'start' => $row['start'],
            'end' => $row['end'],
            'extendedProps' => array(
                'description' => $row['description'],
                'type' => $row['type'],
                'badge' => $row['badge'],
                'status' => $row['status']
            )
        );

        // Add event to the events array
        $events[] = $event;
    }
}

// Encode and output the events array as JSON
echo json_encode($events);
