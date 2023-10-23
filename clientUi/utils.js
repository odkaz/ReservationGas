function formatDate(date) {
  let currentDate = new Date(date);
  let currentDayOfMonth = currentDate.getDate();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let dateString = (currentMonth + 1) + "/" + currentDayOfMonth + "/" + currentYear;
  return dateString;
}

function isSameDate(a, b) {
  return formatDate(a) == formatDate(b);
}

function isSameTime(a, b) {
  return formatTime(a) == formatTime(b);
}

function formatTime(time) {
  let d = new Date(time);
  let hr = d.getUTCHours();
  let min = d.getUTCMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  return hr + ':' + min;
}
