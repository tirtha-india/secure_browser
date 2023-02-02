chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: 'testpage.com'},
      })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.update(tab.id, {url: 'fullscreen.html'});
});

chrome.webNavigation.onCommitted.addListener(function(details) {
  if (details.frameId === 0) {
    chrome.tabs.update(details.tabId, {'autoDiscardable': true});
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.tabId !== -1) {
      return {cancel: true};
    }
  },
  {urls: ["*://*/*"], types: ["main_frame"]},
  ["blocking"]
);

chrome.management.getSelf(function(info) {
  chrome.management.setEnabled(info.id, false);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'checkRequirements':
      var result = {};
      if (navigator.onLine) {
        result.internetStability = true;
      } else {
        result.internetStability = false;
      }
      navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) {
        result.audio = true;
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
        navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
          result.camera = true;
          stream.getTracks().forEach(function(track) {
            track.stop
          });
        }).catch(function() {
          result.camera = false;
        });
      }).catch(function() {
        result.audio = false;
      });
      sendResponse(result);
      break;
  }
  return true;
});

