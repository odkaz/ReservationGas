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
  let datePos = COLUMNS.findIndex((x) => x == "Date");
  let cancelPos = COLUMNS.findIndex((x) => x == "Cancel");
  let search = new Date(date);
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  if(sheet.getLastRow() == 1) {
    return [];
  }
  let values = sheet.getRange('A2:M').getValues();
  let res = [];
  for (let i = 0; i < values.length; i++) {
    if (values[i][cancelPos]) {
      continue;
    }
    let cmp = new Date(values[i][datePos]);
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

function getSlots(date) {
  // let date = new Date("10/15/2023");
  let calendarId = '181ce60548b48c0a2c569686ecb4494111587de8b3889ad233094de1f49deeb9@group.calendar.google.com';
  let cal = CalendarApp.getCalendarById(calendarId);
  let startTime = date;
  let endTime = new Date(startTime.getTime());
  endTime.setDate(startTime.getDate() + 1);
  console.log(startTime);
  console.log(endTime);
  let events = cal.getEvents(startTime, endTime);
  return events;
}

function getAvailableSlots(data) {
  // let date = new Date("10/15/2023");
  let date = new Date(data.date);
  let seats = data.seats;
  let reserved = getReserved(date);
  let slots = getSlots(date);
  let dinnerTime = new Date(date.getTime());
  let now = Date.now();
  dinnerTime.setHours(16);
  let lunch = [];
  let dinner = [];
  for (let i = 0; i < slots.length; i++) {
    let startTime = slots[i].getStartTime();
    if (startTime < now) continue;
    let seatType = checkSeat(startTime, reserved, seats);
    if (!seatType) continue;
    if (startTime < dinnerTime) {
      lunch.push({
        time: startTime,
        isTable: seatType == "table",
      });
    } else if (startTime >= dinnerTime) {
      dinner.push({
        time: startTime,
        isTable: seatType == "table",
      });
    }
  }
  let availableSlots = {
    lunch,
    dinner,
  }
  return JSON.stringify(availableSlots);
}
