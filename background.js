alert('launched');
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: "#3aa757" }, function() {
    console.log("The color is green.");
  });

  chrome.storage.sync.get("sites", function(sites){
    // DEBUG
    chrome.storage.sync.set({sites:[]});
    chrome.storage.sync.set({stopEnabled:false});
    if(!sites) {
    }
  })

  chrome.storage.sync.set({enabled: false});

  const sites = ["naver.com", "reddit.com"].map(x => {
    return { hostContains: `.${x}` };
  });

  chrome.webNavigation.onBeforeNavigate.addListener(
    function() {
      if (enabled) {
        chrome.tabs.update({ url: "./options.html" });
      }
    },
    { url: sites }
  );
});
