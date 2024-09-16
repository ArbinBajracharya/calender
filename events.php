<?php


// Array of events, you can fetch this from a database or define them directly
$events = [
  [
    "title" => "Event1",
    'start' => "2024-09-05",
    "end" => "0000-00-00"
  ],
  [
    "title" => "Event2",
    "start" => "2024-09-10"
  ],
  [
    "title" => "Event3",
    "start" => "2024-09-15"
  ],
  [
    "title" => "Event4",
    "start" => "2024-09-20"
  ],
  [
    "title" => "Event5",
    "start" => "2024-09-23"
  ],
  [
    "title" => "Event6",
    "start" => "2024-09-25",
    "end" => "2024-09-27"
  ],
  [
    "title" => "Event 7",
    "start" => "2024-09-28",
    "end" => "2024-09-30T12:30:00"
  ],
  [
    "title" => "Meeting",
    "start" => "2024-09-05T12:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ],

  [
    "title" => "Date",
    "start" => "2024-09-23T11:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ],

  [
    "title" => "Movies with friends",
    "start" => "2024-09-10T06:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ],

  [
    "title" => "shopping",
    "start" => "2024-09-15T18:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ],
  [
    "title" => "shopping",
    "start" => "2024-09-23T18:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ],

  [
    "title" => "New movie release",
    "start" => "2024-09-17T06:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ],
  [
    "title" => "shopping",
    "start" => "2024-09-18T07:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ],
  [
    "title" => "gaming",
    "start" => "2024-09-21T07:00:00",
    "constrant" => "available",
    "color" => "#257e4a"
  ]
];

// Convert array to JSON
echo json_encode($events);
