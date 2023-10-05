function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index.html');  
}

function getSlots(date) {
  let calendarId = '181ce60548b48c0a2c569686ecb4494111587de8b3889ad233094de1f49deeb9@group.calendar.google.com';
  let cal = CalendarApp.getCalendarById(calendarId);
  let startTime = date;
  let endTime = new Date(startTime.getTime());
  endTime.setDate(startTime.getDate() + 1);
  let events = cal.getEvents(startTime, endTime);

  return events;
}

function getReserved(date) {
  //search for the reserved slots on a given date
  const DATE_POS = 2;
  let search = new Date(date);
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  if(sheet.getLastRow() == 1) {
    return [];
  }
  let values = sheet.getRange('A2:M').getValues();
  let res = [];
  for (let i = 0; i < values.length; i++) {
    let cmp = new Date(values[i][DATE_POS]);
    if (isSameDate(cmp, search)) {
      res.push(values[i]);
    }
  }
  return res;
}

function getReservationsByDate(data) {
  // let date = new Date('October, 04 2023');
  let date = new Date(data);
  let slots = getSlots(date);
  let reserved = getReserved(date);
  let timePos = COLUMNS.findIndex((x) => x == "Time");
  let res = [];

  for (let i = 0; i < slots.length; i++) {
    let time = slots[i].getStartTime();
    let customers = [];
    console.log(time);
    for (let j = 0; j < reserved.length; j++) {
      if (isSameTime(time, reserved[j][timePos])) {
        customers.push(reserved[j]);
      }
    }
    let d = {
      time: formatTime(time),
      info: customers,
    }
    res.push(d);
  }
  console.log(res);
  return JSON.stringify(res);
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

function getAvailableSlots(data) {
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