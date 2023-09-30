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

function getReservationsByDate() {
  let date = new Date('September 30, 2023');
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
  return res;
}