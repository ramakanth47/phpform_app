<?php
session_start();


error_reporting(E_ALL);
ini_set('display_errors', 1);


$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "form"; 


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$fullName = $_POST['fullName'] ?? '';  
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$captchaAnswer = $_POST['captcha'] ?? ''; 

$errors = [];


if (empty($fullName)) {
    $errors[] = "Full name is required.";
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Valid email is required.";
}
if (strlen($password) < 8) {
    $errors[] = "Password must be at least 8 characters.";
}
if ($password !== $confirmPassword) {
    $errors[] = "Passwords do not match.";
}
if (!isset($_SESSION['captcha']) || intval($captchaAnswer) !== intval($_SESSION['captcha'])) { // Validate CAPTCHA from POST
    $errors[] = "CAPTCHA answer is incorrect.";
}


if (empty($errors)) {
    
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    if ($stmt === false) {
        die("Prepare failed: " . htmlspecialchars($conn->error));
    }
    
    $stmt->bind_param("sss", $fullName, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo "Registration successful!";
    } else {
        echo "Error: " . htmlspecialchars($stmt->error); 
    }

    $stmt->close();
} else {
    
    foreach ($errors as $error) {
        echo htmlspecialchars($error) . "<br>"; 
    }
}


$conn->close();
?>
