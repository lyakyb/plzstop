chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get("sites", function(data) {
    if (!data.sites) {
      chrome.storage.sync.set({ sites: [] }, function() {});
    }
  });
});

chrome.storage.sync.get(["sites", "stopEnabled", "endingTime"], function(data) {
  chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    const url = new URL(details.url);
    chrome.storage.sync.get(["stopEnabled", "sites"], function(data) {
      const siteExists = data.sites.some(site => url.host.indexOf(site) !== -1);
      if (data.stopEnabled && siteExists) {
        chrome.tabs.update({ url: "../views/focus.html" });
      }
    });
  });

  if (data.stopEnabled && data.endingTime - Date.now() < 0) {
    chrome.storage.sync.set({ stopEnabled: false }, function() {});
  }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    if (key === "stopEnabled" && storageChange.newValue) {
      chrome.storage.sync.get(['endingTime'], function(data) {
        setTimeout(disable, data.endingTime-Date.now());
      })
    }
  }
});

function disable() {
  chrome.storage.sync.set({stopEnabled: false},function(){});
}
