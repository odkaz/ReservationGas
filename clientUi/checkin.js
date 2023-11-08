function checkinByUuid(uuid) {
	let ss = SpreadsheetApp.getActiveSpreadsheet();
	let sheet = ss.getSheetByName("history");
	let range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
	let values = range.getValues();
	let checkinPos = COLUMNS.findIndex((x) => x == "Check-in");
	let uuidPos = COLUMNS.findIndex((x) => x == "Uuid");

	for (let i = 0; i <= values.length; i++) {
		if (values[i][uuidPos] != uuid) {
			continue;
		}
		if (values[i][checkinPos] == true) {
			throw new Error("The slot is already checked-in");
		}
		values[i][checkinPos] = true;
		range.setValues(values);
		console.log('success');
		return;
	}
	throw new Error("The slot was not found");
}
