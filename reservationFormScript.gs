function getAvailableSlots(data) {
  // let data = 'September, 01 2023';
  // let seats = 2;
  let date = new Date(data.date);
  let shifts = getShifts(date, data.seats);
  return JSON.stringify(shifts);
}

function formatDate(date) {
  let currentDate = new Date(date);
  let currentDayOfMonth = currentDate.getDate();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let dateString = (currentMonth + 1) + "/" + currentDayOfMonth + "/" + currentYear;
  return dateString;
}

function isSameDate(a, b) {
  return formatDate(a) == formatDate(b);
}

function getReserved(date) {
  //search for the reserved slots on a given date
  const DATE_POS = 2;
  let search = new Date(date);
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  if(sheet.getLastRow() == 1) {
    return [];
  }
  let values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  let res = [];
  for (let i = 0; i < values.length; i++) {
    let cmp = new Date(values[i][DATE_POS]);
    if (isSameDate(cmp, search)) {
      res.push(values[i]);
    }
  }
  return res;
}

function formatTime(time) {
  let d = new Date(time);
  let hr = d.getUTCHours();
  let min = d.getUTCMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  return hr + ':' + min;
}

function isSameTime(a, b) {
  return formatTime(a) == formatTime(b);
}

function checkSeat(time, reserved, seats) {
  const MAX_COUNTER = 7;
  const MAX_TABLE = 4;
  const timePos = COLUMNS.findIndex((x) => x == "Time");
  const seatsPos = COLUMNS.findIndex((x) => x == "Seats");
  const typePos = COLUMNS.findIndex((x) => x == "Counter/Table");
  let counter = 0;
  let table = 0;

  for (let i = 0; i < reserved.length; i++) {
    if (isSameTime(time, reserved[i][timePos])) {
      if (reserved[i][typePos]) {
        // is table
        table += reserved[i][seatsPos];
      } else {
        // is counter
        counter += reserved[i][seatsPos];
      }
    }
  }
  if (MAX_COUNTER - counter >= seats) {
    return "counter"
  }
  if (table == 0 && MAX_TABLE >= seats) {
    return "table"
  }
  return null;
}

function getDaysOffOption(date) {
  let shifts = SpreadsheetApp.getActive().getSheetByName('Operational Schedule');
  let values = shifts.getRange("A2:B").getValues();
  for (let i = 0; i < values.length; i++) {
    if (!values[i][0]) {
      break;
    }
    if (isSameDate(date, values[i][0])) {
      if (!values[i][1]) {
        return "Day off";
      } else {
        return values[i][1]; //"Lunch only", "Dinner only"
      }
    }
  }
  return "Open";
}

function getShifts(date, seats) {
  const DINNER_ROW = 5;
  let reserved = getReserved(date);
  let day = date.getDay();
  let shifts = SpreadsheetApp.getActive().getSheetByName('Seating Schedule');
  let columnValues = shifts.getRange(2, day + 2, shifts.getLastRow()).getValues();
  let option = getDaysOffOption(date);
  let lunch = [];
  let dinner = [];
  for (var i=0; i<columnValues.length; i++) {
    if (!columnValues[i][0]) {
      continue;
    }
    let seatType = checkSeat(columnValues[i][0], reserved, seats);
    if (!seatType) continue;
    if (i < DINNER_ROW && (option == "Open" || option == "Lunch only")) {
      lunch.push({
        time: columnValues[i][0],
        isTable: seatType == "table",
      });
    } else if (i >= DINNER_ROW && (option == "Open" || option == "Dinner only")) {
      dinner.push({
        time: columnValues[i][0],
        isTable: seatType == "table",
      });
    }
  }
  let slots = {
    lunch,
    dinner,
  }
  return slots;
}
