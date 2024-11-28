<?php
session_start();

if (isset($_POST['captcha'])) {
    $_SESSION['captcha'] = intval($_POST['captcha']);
}
?>
