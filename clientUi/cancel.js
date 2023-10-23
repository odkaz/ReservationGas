function cancelByUuid(uuid) {
	let ss = SpreadsheetApp.getActiveSpreadsheet();
	let sheet = ss.getSheetByName("history");
	let range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
	let values = range.getValues();
	let cancelPos = COLUMNS.findIndex((x) => x == "Cancel");
	let uuidPos = COLUMNS.findIndex((x) => x == "Uuid");

	for(let i = 2; i <= values.length; i++) {
	  if(values[i][uuidPos] == uuid) {
		values[i][cancelPos] = true;
		range.setValues(values);
		console.log('success');
		return;
	  }
	}
	//not found, err
	throw new Error("The slot was not found");
  }
  