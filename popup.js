let changeColor = document.getElementById("changeColor");
let addButton = document.getElementById("addSite");
let startButton = document.getElementById("start");
let hourField = document.getElementById("hourVal");
let minField = document.getElementById("minVal");
let siteNameField = document.getElementById("siteName");

addButton.addEventListener("click", function() {
  chrome.storage.sync.get(["sites"], function(data){
    let newSites = [].concat(data.sites, "LOL");
    chrome.storage.sync.set({"sites": newSites}, function(){
      var table = document.createElement("TABLE");
      table.border = "1";
      //Add the data rows.
      for (var i = 0; i < newSites.length; i++) {
        row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = newSites[i];
      }      
      var dvTable = document.getElementById("table");
      dvTable.innerHTML = "";
      dvTable.appendChild(table);
    });
  });
});

startButton.addEventListener("click", function() {
  chrome.storage.sync.get(["stopEnabled"], function(data){
    if (data.stopEnabled) return;
    let endingTime = Math.floor(Date.now()/1000+3600*hourField.value+60*minField.value);
    alert(hourField.value);
    alert(endingTime);
    // chrome.storage.sync.set({"stopEnabled": true, "endingTime": endingTime},{});
  })
});

chrome.storage.sync.get("color", function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute("value", data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'document.body.style.backgroundColor = "' + color + '";'
    });
  });
};

//Create a HTML Table element.

chrome.storage.sync.get(["sites"], function(data){
  var table = document.createElement("TABLE");
  table.border = "1";
  //Add the data rows.
  const sites = Array.from(data.sites);
  for (var i = 0; i < sites.length; i++) {
    row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML = sites[i];
  }
  
  var dvTable = document.getElementById("table");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
});

