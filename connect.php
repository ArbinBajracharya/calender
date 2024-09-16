<?php
$db = "localhost";
$user = "root";
$pass = "";
$name = "calender";

$conn = mysqli_connect($db, $user, $pass, $name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
