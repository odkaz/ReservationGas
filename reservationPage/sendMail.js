function sendMail(email, subject, body) {
	var recipient = email;
	MailApp.sendEmail(recipient, subject, '', { htmlBody: body });
}
