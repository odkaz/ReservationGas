function getDetailByUuid() {
  let uuid = "e20f80e5-e830-4b83-9654-fa0c08d4bea9";
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let histSheet = ss.getSheetByName("history");
  let uuidPos = COLUMNS.findIndex((x) => x == "Uuid");
  for(let i = 2; i <= histSheet.getLastRow(); i++) {
    if(histSheet.getRange(i, uuidPos + 1).getValue() == uuid) {
      let firstPos = COLUMNS.findIndex((x) => x == "First Name");
      let lastPos = COLUMNS.findIndex((x) => x == "Last Name");
      let datePos = COLUMNS.findIndex((x) => x == "Date");
      let timePos = COLUMNS.findIndex((x) => x == "Time");
      let seatsPos = COLUMNS.findIndex((x) => x == "Seats");
      let typePos = COLUMNS.findIndex((x) => x == "Counter/Table");
      let row = histSheet.getRange(i, 1, 1, histSheet.getLastColumn()).getValues()[0];
      let res = {
        first: row[firstPos],
        last: row[lastPos],
        date: row[datePos],
        time: row[timePos],
        seats: row[seatsPos],
        typePos: row[typePos],
      }
      console.log(res);
    }
  }
}

function cancelByUuid() {
  let uuid = "90aa1892-f70a-4daa-b011-4c58fdb53a10";
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let histSheet = ss.getSheetByName("history");
  let cancelSheet = ss.getSheetByName("cancels");
  let uuidPos = COLUMNS.findIndex((x) => x == "Uuid");

  for(let i = 2; i <= histSheet.getLastRow(); i++) {
    if(histSheet.getRange(i, uuidPos + 1).getValue() == uuid) {
      let row = histSheet.getRange(i, 1, 1, histSheet.getLastColumn()).getValues();
      let cancelPos = COLUMNS.findIndex((x) => x == "Cancel");
      row[0][cancelPos] = true;
      histSheet.deleteRow(i);
      cancelSheet.appendRow(row[0]);
      return;
    }
  }
  //not found, err
  return;
}
