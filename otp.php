<?php
$sender = $_GET['sender'];
$otp = $_GET['otp'];
$fp = fopen('otp.json', 'w');
fwrite($fp, '{"sender":"'.$sender.'","otp":"'.$otp.'"}');
fclose($fp);
?>

