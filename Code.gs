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
  sheet.appendRow([data.firstName, data.lastName, data.date, data.time, data.seats, data.isTable, data.notes, data.email, data.phone, data.timeStamp]);
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
