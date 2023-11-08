function addReservation(data) {
  let uuid = Utilities.getUuid();
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');

  if (checkReservation(data.date, data.time, Number(data.seats), data.isTable == `true`)) {
    sheet.appendRow([data.firstName, data.lastName, data.date, data.time, data.seats, data.isTable, data.notes, data.email, data.phone, data.timeStamp, uuid]);
    updateFilterView();
  } else {
    throw new Error(`The slot is no longer available`);
  }

  //sms and mail
  // let url = ScriptApp.getService().getUrl() + '?uuid=' + uuid + '&page=cancelReservation';
  let type = (data.isTable == 'true') ? 'Table' : 'Bar';
  let msg = getMessage(data.date, data.time, type);

  sendSms(data.phone, msg);
  sendMail(data.email, msg);
}

function checkReservation(date, time, seats, isTable) {
  let shifts = JSON.parse(getAvailableSlots({ date, seats }));
  console.log(shifts);
  for (let i = 0; i < shifts.lunch.length; i++) {
    if (time == formatTime(shifts.lunch[i].time)
      && isTable == shifts.lunch[i].isTable) {
      return true;
    }
  }
  for (let i = 0; i < shifts.dinner.length; i++) {
    if (time == formatTime(shifts.dinner[i].time)
      && isTable == shifts.dinner[i].isTable) {
      return true;
    }
  }
  return false;
}

function updateFilterView() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName('history');
  let filter = dataSheet.getFilter();
  if (filter) {
    filter.remove();
  }
  dataSheet.getRange('A1:M').createFilter();
}

function getMessage(date, time, type) {
  let message =
    `<div>

  Thank you for booking your reservation with us. Your reservation is as follows.<br>
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
