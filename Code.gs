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

function getReservedTimeSlots() {
  let date = [new Date('August 25, 2023 00:00:00 GMT+02:00')];
  console.log(date);
  let sheet = SpreadsheetApp.getActive().getSheetByName('history');
  let column = 2; //column Index   
  let columnValues = sheet.getRange(2, column, sheet.getLastRow()).getValues(); //1st is header row
  let searchResult = columnValues.findIndex(date); //Row Index - 2
  console.log('fin');
  if(searchResult != -1)
  {
    console.log('success');
    console.log(searchResult);
    // SpreadsheetApp.getActiveSpreadsheet().setActiveRange(sheet.getRange(searchResult + 2, 1))
  }
}

Array.prototype.findIndex = function(search){
  if(search == "") return false;
  for (var i=0; i<this.length; i++) {
    console.log(this[i]);
    console.log(search);
    console.log(this[i] == search);
    if (this[i] == search) return i;
  }
  return -1;
} 
