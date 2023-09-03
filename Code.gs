function doGet(e) {
  if (!e.parameter.page) 
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('reservationForm');
    htmlOutput.message = '';
    return htmlOutput.evaluate();
  }
  else if(e.parameter['page'] == 'personalInfo')
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('personalInfo');
    htmlOutput.date = e.parameter['date'];
    htmlOutput.time = e.parameter['time'];
    htmlOutput.seats = e.parameter['seats'];
    htmlOutput.isTable = e.parameter['isTable'];
    return htmlOutput.evaluate();  
  }
  else if(e.parameter['page'] == 'Link 2')
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('formSubmitted');
    htmlOutput.firstname = e.parameter['firstname'];
    htmlOutput.lastname = e.parameter['lastname'];
    return htmlOutput.evaluate();  
  } 
  else if(e.parameter['page'] == 'Index')
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('reservationForm');
    htmlOutput.message = e.parameter['message'];
    return htmlOutput.evaluate();  
  }   
}

function getUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}

function addReservation(data) {
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  sheet.appendRow([data.firstName, data.lastName, data.date, data.time, data.seats, data.isTable, data.notes, data.email, data.phone, data.timeStamp, false]);
}

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

const COLUMNS = ["First Name", "Last Name", "Date", "Time", "Seats", "Counter/Table", "Notes", "E-mail", "Phone", "TimeStamp", "Check-in"];

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
    console.log("counter available");
    return "counter"
  }
  if (table == 0 && MAX_TABLE >= seats) {
    console.log("table available");
    return "table"
  }
  console.log("seats are full");
  return null;
}

function getShifts(date, seats) {
  const DINNER_ROW = 5;
  let reserved = getReserved(date);
  let day = date.getDay();
  let shifts = SpreadsheetApp.getActive().getSheetByName('shifts');
  let columnValues = shifts.getRange(2, day + 2, shifts.getLastRow()).getValues();
  let lunch = [];
  let dinner = [];
  for (var i=0; i<columnValues.length; i++) {
    if (!columnValues[i][0]) {
      continue;
    }
    let seatType = checkSeat(columnValues[i][0], reserved, seats);
    if (!seatType) continue;
    if (i < DINNER_ROW) {
      lunch.push({
        time: columnValues[i][0],
        isTable: seatType == "table",
      });
    } else {
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
