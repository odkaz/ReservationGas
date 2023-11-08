function getDetailsByUuid(uuid) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let histSheet = ss.getSheetByName("history");
  let uuidPos = COLUMNS.findIndex((x) => x == "Uuid");
  for (let i = 2; i <= histSheet.getLastRow(); i++) {
    if (histSheet.getRange(i, uuidPos + 1).getValue() == uuid) {
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
        date: formatDate(row[datePos]),
        time: formatTime(row[timePos]),
        seats: row[seatsPos],
        type: row[typePos],
      }
      console.log(res);
      return res;
    }
  }
}

function cancelByUuid(uuid) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let histSheet = ss.getSheetByName("history");
  let cancelSheet = ss.getSheetByName("cancels");
  let uuidPos = COLUMNS.findIndex((x) => x == "Uuid");

  for (let i = 2; i <= histSheet.getLastRow(); i++) {
    if (histSheet.getRange(i, uuidPos + 1).getValue() == uuid) {
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
