function addReservation(data) {
  let uuid = Utilities.getUuid();
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');

  if (checkReservation(data.date, data.time, Number(data.seats), data.isTable == "true")) {
    sheet.appendRow([data.firstName, data.lastName, data.date, data.time, data.seats, data.isTable, data.notes, data.email, data.phone, data.timeStamp, uuid]);
    updateFilterView();
  } else {
    throw new Error( "The slot is no longer available");
  }

  //sms and mail
  // let url = ScriptApp.getService().getUrl() + '?uuid=' + uuid + '&page=cancelReservation';
  // let msg = getMessage(data.date, data.time, url);
  // sendSms(data.phone, msg);
  // sendMail(data.email, msg);
}

function checkReservation(date, time, seats, isTable) {
  let shifts = JSON.parse(getAvailableSlots({date, seats}));
  console.log(shifts);
  for (let i = 0; i < shifts.lunch.length; i++) {
    if (time == formatTime(shifts.lunch[i].time)
      &&isTable == shifts.lunch[i].isTable) {
        return true;
    }
  }
  for (let i = 0; i < shifts.dinner.length; i++) {
    if (time == formatTime(shifts.dinner[i].time)
      &&isTable == shifts.dinner[i].isTable) {
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

function getMessage(date, time, url) {
    let message =
      `Thank you for making a reservation with Itosugi. Your reservation is as follows.\n\nDate: ${date}\nTime: ${time}\n\nIf you wish to cancel your reservation, you can do it from the link below\n\n${url}\n\nWe take great care about our food loss and our environment, so if you wish to cancel the reservation, please notify us at least 24h ahead of your reservation.\n\nLate cancelation or no show might affect your reservation credentials`;
    return message;
}
