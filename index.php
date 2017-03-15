<?php
$fan_token = $_COOKIE["fan_token"];
if ($fan_token != -1)
  header("Location: challenge/");

include_once "main.html";
?>
