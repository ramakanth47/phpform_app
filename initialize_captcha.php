<?php
session_start();
$num1 = rand(1, 10);
$num2 = rand(1, 10);
$_SESSION['captcha'] = $num1 + $num2;
echo json_encode(['question' => "$num1 + $num2"]);
?>
