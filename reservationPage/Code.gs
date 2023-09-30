function doGet(e) {
  if (!e.parameter.page)
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('reservationForm');
    htmlOutput.message = '';
    return htmlOutput.evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }
  else if(e.parameter['page'] == 'personalInfo')
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('personalInfo');
    htmlOutput.date = e.parameter['date'];
    htmlOutput.time = e.parameter['time'];
    htmlOutput.seats = e.parameter['seats'];
    htmlOutput.isTable = e.parameter['isTable'];
    return htmlOutput.evaluate();
  }
  else if(e.parameter['page'] == 'formSubmitted')
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('formSubmitted');
    return htmlOutput.evaluate();
  }
  else if(e.parameter['page'] == 'cancelReservation')
  {
    var htmlOutput =  HtmlService.createTemplateFromFile('cancelReservation');
    htmlOutput.uuid = e.parameter['uuid'];
    return htmlOutput.evaluate();
  }
}

function getUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}