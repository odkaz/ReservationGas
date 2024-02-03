function doGet(e) {
  if (!e.parameter.api) {
    return
  }
  if (e.parameter['api'] == 'getAvailableSlots') {
    var date = e.parameter['date']
    var seats = e.parameter['seats']
    var data = {
      date,
      seats,
    }
    var res = getAvailableSlots(data)
    return ContentService.createTextOutput(res).setMimeType(
      ContentService.MimeType.JSON
    )
  }
  if (e.parameter['api'] == 'addReservation') {
    var data = {
      ...e.parameter,
    }
    var res = addReservation(data)
    return ContentService.createTextOutput(res).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

function getUrl() {
  var url = ScriptApp.getService().getUrl()
  return url
}
