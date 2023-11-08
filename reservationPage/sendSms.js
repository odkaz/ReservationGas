function sendSms(number, message) {

	// var dstPhoneNumber = '+16047234573';
	// var message = 'Hello world!';
	var dstPhoneNumber = '+33769426915';
	sendTwilioSms(dstPhoneNumber, message);
	console.log('sent');
}

/**
 * An example of sending SMS messages from Google Ads Scripts using Twilio.
 * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#basic_authentication_samples
 * for full details on configuration.
 */

/**
 * Builds an SMS message for sending with Twilio and sends the message.
 * @param {string} dstPhoneNumber The destination number. This is a string as
 *     telephone numbers may contain '+'s or be prefixed with '00' etc.
 * @param {string} message The text message to send.
 */
function sendTwilioSms(dstPhoneNumber, message) {
	const request =
		buildTwilioMessageRequest(dstPhoneNumber, message);
	sendRequest(request);
}

/**
 * Send an SMS message
 * @param {!SmsRequest} request The request object to send
 */
function sendRequest(request) {
	const retriableErrors = [429, 500, 503];

	for (let attempts = 0; attempts < 3; attempts++) {
		var response = UrlFetchApp.fetch(request.url, request.options);
		var responseCode = response.getResponseCode();

		if (responseCode < 400 || retriableErrors.indexOf(responseCode) === -1) {
			break;
		}
		Utilities.sleep(2000 * Math.pow(2, attempts));

	}
	if (responseCode >= 400 && EMAIL_ADDRESS) {
		MailApp.sendEmail(
			EMAIL_ADDRESS, 'Error sending SMS Message from Google Ads Scripts',
			response.getContentText());
	}

}

/**
 * Builds a SMS request object specific for the Twilio service.
 * @param {string} recipientPhoneNumber Destination number including country
 *     code.
 * @param {string} textMessage The message to send.
 * @return {SmsRequest}
 */
function buildTwilioMessageRequest(recipientPhoneNumber, textMessage) {
	if (!recipientPhoneNumber) {
		throw Error('No "recipientPhoneNumber" specified in call to ' +
			'buildTwilioMessageRequest. "recipientPhoneNumber" cannot be empty');
	}
	if (!textMessage) {
		throw Error('No "textMessage" specified in call to ' +
			'buildTwilioMessageRequest. "textMessage" cannot be empty');
	}
	const twilioUri = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages`;
	const authHeader = 'Basic ' +
		Utilities.base64Encode(
			TWILIO_ACCOUNT_SID + ':' + TWILIO_ACCOUNT_AUTHTOKEN);
	const options = {
		muteHttpExceptions: true,
		method: 'POST',
		headers: { Authorization: authHeader },
		payload: {
			From: TWILIO_SRC_PHONE_NUMBER,
			To: recipientPhoneNumber,
			// Twilio only accepts up to 1600 characters
			Body: textMessage.substr(0, 1600)
		}
	};
	return { url: twilioUri, options: options };
}
