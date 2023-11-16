function findReminderTarget() {
	const today = new Date();
	const nextThreeDays = new Date(today.setDate(today.getDate() + 3));
	console.log(formatDate(nextThreeDays));
}


function sendReminder() {
	let date = '2023-01-01';
	let time = '12:15';
	let isTable = 'true';
	let email = '112kazuma@gmail.com';
	let phone = '+769426915';
	let type = (isTable == 'true') ? 'Table' : 'Bar';
	let msg = getReminderMail(date, time, type);
	let msgSms = getReminderSms(date, time, type);

	sendMail(email, 'Reminder for your upcoming reservation', msg);
	sendSms(phone, msgSms);
}

function getReminderMail(date, time, type) {
	let message =
		`<div>

	Hello, this is a reminder for your upcoming reservation.<br>
  <br>
  Date: ${date}<br>
  Time: ${time}<br>
  Seat Type: ${type}<br>
  <br>
  If you would like to request any special arrangements or make any changes to your reservation, please do not hesitate to call us directly ((604) 779-8528). <b>This is an automated email so please do not reply to this email.</b><br>
  <br>
  We take great care to minimize food waste. If you need to cancel your reservation, please notify us at least 48 hours in advance.<br>
  <br>
  We hope to see you soon!<br>
  <br>
  <br>
  Itosugi Kappo Cuisine<br>
  <br>
  3648 W Broadway<br>
  Vancouver, BC.<br>
  <br>
  (604) 779-8528<br>
	</div>`;
	return message;
}

function getReminderSms(date, time, type) {
	let message =
		`
  Hello, this is a reminder for your upcoming reservation.

  Date: ${date}
  Time: ${time}
  Seat Type: ${type}

  If you would like to request any special arrangements or make any changes to your reservation, please do not hesitate to call us directly ((604) 779-8528). This is an automated email so please do not reply to this email.

  No-shows or cancellations less than 48 hours in advance may be subject to the following charges:
	  * Lunch reservations: $45 per guest.
	  * Dinner reservations: $78 per guest.
  Changes to the guest count made less than 48 hours in advance may be subject to the same charges stated above. To cancel or modify your reservation, please contact us at (604) 779-8528.

  We hope to see you soon!


  Itosugi Kappo Cuisine

  3648 W Broadway
  Vancouver, BC.

  (604) 779-8528`;
	return message;
}
