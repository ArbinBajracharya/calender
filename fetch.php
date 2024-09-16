<?php

require_once 'connect.php';
header('Content-Type: application/json');

$sql = "SELECT id,title,start,end,description,type,status FROM events";
$result = $conn->query($sql);
$events = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
}
echo json_encode($events);
