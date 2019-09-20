let changeColor = document.getElementById("changeColor");
let hourField = document.getElementById("hourVal");
let minField = document.getElementById("minVal");
let siteNameField = document.getElementById("siteName");
let startBtn = document.getElementById("start");
let endingTime = 0;
let timeInterval = null;

hourField.value = 1;
minField.value = 0;

function updateTableWithList(siteList) {
  var table = document.createElement("TABLE");
  for (var i = 0; i < siteList.length; i++) {
    row = table.insertRow(-1);
    var cell = row.insertCell(-1);

    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "X");
    button.setAttribute("class", "remove");

    cell.innerHTML = siteList[i];
    cell.appendChild(button);
  }
  const buttons = document.getElementsByName("removeButton");
  buttons.forEach(btn =>
    btn.addEventListener("click", function(btn) {
      event.preventDefault();
      removeSite(btn);
    })
  );
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

  startBtn.textContent = hours + "h " + minutes + "m " + seconds + "s ";
}

function countDownTimer() {
  var delta = endingTime - Date.now();
  updateTimeWithDelta(delta);
  if (delta < 0) {
    clearInterval(timeInterval);
  }
}

function removeSite(button) {
  const rowIndex = button.parentNode.parentNode.rowIndex;
  chrome.storage.sync.get(["sites"], function(data) {
    const deletedSite = data.sites[rowIndex];
    let updatedSites = data.sites.filter(site => site !== deletedSite);
    updateTableWithList(updatedSites);
    chrome.storage.sync.set({ sites: updatedSites }, function() {});
  });
}

document.addEventListener(
  "click",
  function(event) {
    if (event.target.matches(".remove")) {
      removeSite(event.target);
    }

    if (event.target.matches(".addSite")) {
      chrome.storage.sync.get(["sites"], function(data) {
        if (data.sites.some(site => site === siteNameField.value)) {
          alert("site already exists in the list!");
          siteNameField.value = "";
          return;
        }

        let newSites = [].concat(data.sites, siteNameField.value);
        chrome.storage.sync.set({ sites: newSites }, function() {
          updateTableWithList(newSites);
          siteNameField.value = "";
        });
      });
    }

    if (event.target.matches(".start")) {
      chrome.storage.sync.get(["stopEnabled", "sites"], function(data) {
        if (data.stopEnabled) return;
        
        let until = Math.floor(
          Date.now() +
          3600 * 1000 * hourField.value +
          60 * 1000 * minField.value
          );
        updateTimeWithDelta(until-Date.now());
        endingTime = until;
        startBtn.style.backgroundColor = "red";
        chrome.storage.sync.set(
          { stopEnabled: true, endingTime: until },
          function() {}
        );

        clearInterval(timeInterval);
        timeInterval = setInterval(countDownTimer, 1000);
      });
    }
  },
  false
);


chrome.storage.sync.get(["sites", "stopEnabled", "endingTime"], function(data) {
  updateTableWithList(data.sites);
  updateTimeWithDelta(data.endingTime-Date.now());
  if (data.stopEnabled) {
    timeInterval = setInterval(countDownTimer, 1000);
    startBtn.disabled = true;
    startBtn.style.backgroundColor = "red";
    endingTime = data.endingTime;
  } else {
    clearInterval(timeInterval);
    startBtn.disabled = false;
    startBtn.textContent = "START STOPPING";
    startBtn.style.backgroundColor = "green";
  }
});