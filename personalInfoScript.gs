function addReservation(data) {
  let uuid = Utilities.getUuid();
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  sheet.appendRow([data.firstName, data.lastName, data.date, data.time, data.seats, data.isTable, data.notes, data.email, data.phone, data.timeStamp, uuid, false, false]);
}
