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

function getAvailableSlots() {
  let data = 'September, 01 2023';
  let date = new Date(data);
  let shifts = getShifts(date);
  return JSON.stringify(shifts);
}

function getDateString(date) {
  const currentDate = new Date(date);
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const dateString = (currentMonth + 1) + "/" + currentDayOfMonth + "/" + currentYear;
  return dateString;
}

function isSameDate(a, b) {
  if (getDateString(a) == getDateString(b)) {
    return true;
  }
  return false;
}

function getReserved(date) {
  let search = new Date(date);
  let shifts = SpreadsheetApp.getActive().getSheetByName('history');
  let column = 2;
  let columnValues = shifts.getRange(2, column, shifts.getLastRow()).getValues();
  for (var i=0; i<columnValues.length; i++) {
    let cmp = new Date(columnValues[i][0]);
    if (isSameDate(cmp, search)) {
      console.log('match');
    }
  }
}

function getShifts(date) {
  getReserved(date);
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
