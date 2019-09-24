let timeInterval = null;
let endingTime = 0;

// Update lables
const timeLabel = document.getElementById('timer');
const stopLabel = document.getElementById('stop');
const goBackLabel = document.getElementById('goBack');
const comeBackLabel = document.getElementById('comeBack');
const youBlockedLabel = document.getElementById('youBlocked');

timeLabel.textContent = chrome.i18n.getMessage("calculating");
stopLabel.textContent = chrome.i18n.getMessage("stop");
goBackLabel.textContent = chrome.i18n.getMessage("goBack");
comeBackLabel.textContent = chrome.i18n.getMessage("comeBack");
youBlockedLabel.textContent = chrome.i18n.getMessage("youBlocked");

function updateTableWithList(siteList) {
  var table = document.createElement("TABLE");
  for (var i = 0; i < siteList.length; i++) {
    row = table.insertRow(-1);
    var cell = row.insertCell(-1);

    cell.innerHTML = siteList[i];
  }
  var dvTable = document.getElementById("sitesList");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
}

function updateTimeWithDelta(delta) {
  var hours = Math.floor(
    (delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((delta % (1000 * 60)) / 1000);

  timeLabel.textContent = hours + "h " + minutes + "m " + seconds + "s ";
}

function countDownTimer() {
  var delta = endingTime - Date.now();
  updateTimeWithDelta(delta);
  if (delta < 0) {
    clearInterval(timeInterval);
    window.location.href = "../views/free.html";
  }
}

chrome.storage.sync.get(['sites', 'endingTime'], function(data) {
  endingTime = data.endingTime;
  updateTableWithList(data.sites);
  updateTimeWithDelta(data.endingTime-Date.now());
  timeInterval = setInterval(countDownTimer, 1000);
})


