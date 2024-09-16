<?php


// Array of external events, you can fetch this from a database or define them directly
$externalEvents = [

  [
    "id" => 1,
    "title" => "My Event 1"
  ],
  [
    "id" => 2,
    "title" => "My Event 2"
  ],
  [
    "id" => 3,
    "title" => "My Event 3"
  ],
  [
    "id" => 4,
    "title" => "My Event 4"
  ],
  [
    "id" => 5,
    "title" => "My Event 5",
    "color" => "#257e4a"
  ]
];

// Convert array to JSON
echo json_encode($externalEvents);
