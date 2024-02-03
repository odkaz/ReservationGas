function doGet(e) {
  if (!e.parameter.page) {
    if (!e.parameter.api) {
      var htmlOutput = HtmlService.createTemplateFromFile('reservationForm')
      htmlOutput.message = ''
      return htmlOutput
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
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
  } else if (e.parameter['page'] == 'personalInfo') {
    var htmlOutput = HtmlService.createTemplateFromFile('personalInfo')
    htmlOutput.date = e.parameter['date']
    htmlOutput.time = e.parameter['time']
    htmlOutput.seats = e.parameter['seats']
    htmlOutput.isTable = e.parameter['isTable']
    return htmlOutput
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  } else if (e.parameter['page'] == 'registerCard') {
    var htmlOutput = HtmlService.createTemplateFromFile('registerCard')
    return htmlOutput
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  } else if (e.parameter['page'] == 'formSubmitted') {
    var htmlOutput = HtmlService.createTemplateFromFile('formSubmitted')
    htmlOutput.error = e.parameter['error']
    return htmlOutput
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  } else if (e.parameter['page'] == 'cancelReservation') {
    var htmlOutput = HtmlService.createTemplateFromFile('cancelReservation')
    htmlOutput.uuid = e.parameter['uuid']
    return htmlOutput
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  }
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents)
  if (!e.parameter.api) {
    return ContentService.createTextOutput('no route found')
  }
  if (e.parameter['api'] == 'addReservation') {
    var result = addReservation(data)
    return ContentService.createTextOutput(result)
  }
  return ContentService.createTextOutput('error: in do post')
}

function getUrl() {
  var url = ScriptApp.getService().getUrl()
  return url
}
