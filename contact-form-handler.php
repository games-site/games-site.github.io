<?php
	$suggest = $_POST['suggest'];
	
	$email_from = 'joshxd70+noreply@gmail.com';
	
	$email_subject = "New Suggestion";
	
	$email_body = "$message.\n";
	
	$to = 'joshxd70@gmail.com';
	
	$headers = "From: $email_from \r\n";
	
	mail($to,$email_subject,$email_body,$headers);
	
	header("Location: feedback.html");
?>