let timeLabel = document.getElementById('timer');
let timeInterval = null;
let endingTime = 0;

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


