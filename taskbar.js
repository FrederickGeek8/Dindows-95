function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function updateTime() {
  var date = new Date();
  document.getElementById("time").innerText = formatAMPM(date);
  setTimeout(updateTime, 30000);
}

updateTime();

var start = document.getElementById("start");
var start_menu = document.getElementById("start-menu");
start.onclick = function() {
  if (start_menu.style.display == "block") {
    start_menu.style.display = "none";
  } else {
    start_menu.style.display = "block";
  }
};
