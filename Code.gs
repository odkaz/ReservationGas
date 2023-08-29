function doGet() {
  return HtmlService.createHtmlOutputFromFile('reservationForm');
}

function addReservation(data) {
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  // let data = {
  //   name: 'Kazuma',
  //   date: new Date('August 25, 2023 00:00:00 GMT+02:00'),
  //   time: '19:00:00',
  // };
  sheet.appendRow([data.name, data.date, data.time]);
}

function getAvailableSlots(data) {
  let shifts = getShifts(new Date(data));
  return JSON.stringify(shifts);
}

function getShifts(date) {
  let day = date.getDay();
  let shifts = SpreadsheetApp.getActive().getSheetByName('shifts');
  let columnValues = shifts.getRange(2, day + 2, shifts.getLastRow()).getValues();
  let lunch = [];
  let dinner = [];
  for (var i=0; i<columnValues.length; i++) {
    if (columnValues[i][0]) {
      if (i < 5) {
        lunch.push(columnValues[i][0]);
      } else {
        dinner.push(columnValues[i][0]);
      }
    }
  }
  let slots = {
    lunch,
    dinner,
  }
  return slots;
}

Array.prototype.findByDate = function(search){
  let res = [];
  if(search == "") return false;
  for (var i=0; i<this.length; i++) {
    if (!(this[i] > search) && !(this[i] < search)) {
      res.push(this[i]);
    }
  }
  return res;
} 
