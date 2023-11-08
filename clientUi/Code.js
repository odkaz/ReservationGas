function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index.html')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSlots(date) {
  let calendarId = 'c0a137b28962e4972104cbcca5638e2eea25cee3a9642ce3d21341bafb7dead1@group.calendar.google.com';
  let cal = CalendarApp.getCalendarById(calendarId);
  let startTime = date;
  let endTime = new Date(startTime.getTime());
  endTime.setDate(startTime.getDate() + 1);
  let events = cal.getEvents(startTime, endTime);
  return events;
}

function getReserved(date, includeCancels) {
  //search for the reserved slots on a given date
  let datePos = COLUMNS.findIndex((x) => x == "Date");
  let cancelPos = COLUMNS.findIndex((x) => x == "Cancel");
  let search = new Date(date);
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  if (sheet.getLastRow() == 1) {
    return [];
  }
  let values = sheet.getRange('A2:M').getValues();
  let res = [];
  for (let i = 0; i < values.length; i++) {
    if (!includeCancels && values[i][cancelPos]) {
      continue;
    }
    let cmp = new Date(values[i][datePos]);
    if (isSameDate(cmp, search)) {
      res.push(values[i]);
    }
  }
  return res;
}

function getReservationsByDate(data) {
  // let date = new Date('November, 03 2023');
  let date = new Date(data);
  let slots = getSlots(date);
  let reserved = getReserved(date, true);
  let timePos = COLUMNS.findIndex((x) => x == "Time");
  let res = [];

  for (let i = 0; i < slots.length; i++) {
    let time = slots[i].getStartTime();
    let customers = [];
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
  let dinnerTime = new Date(date.getTime());
  dinnerTime.setHours(16);
  let reserved = getReserved(date, false);
  let slots = getSlots(date);
  let res = [];
  for (let i = 0; i < slots.length; i++) {
    let time = slots[i].getStartTime();
    let seatType = checkSeat(time, reserved, seats);
    if (!seatType) continue;
    if (time < dinnerTime && seatType == "table") continue; //No tables for lunch
    res.push({
      time,
      isTable: seatType == "table",
    });
  }
  return JSON.stringify(res);
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

function checkReservation(date, time, seats, isTable) {
  let shifts = JSON.parse(getAvailableSlots({ date, seats }));
  for (let i = 0; i < shifts.length; i++) {
    if (time == formatTime(shifts[i].time)
      && isTable == shifts[i].isTable) {
      return true;
    }
  }
  return false;
}

function addAdminReservation(data) {
  let uuid = Utilities.getUuid();
  let timeStamp = Date.now();
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  if (checkReservation(data.date, data.time, Number(data.seats), data.isTable == "true")) {
    sheet.appendRow([data.firstName, "(Added by Admin)", data.date, data.time, data.seats, data.isTable, data.notes, "admin@example.com", data.phone, timeStamp, uuid]);
    updateFilterView();
  } else {
    throw new Error("The slot is no longer available");
  }
}
