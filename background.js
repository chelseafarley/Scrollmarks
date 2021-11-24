chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Add Scrollmark",
    id: "add-scrollmark",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "add-scrollmark") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "addScrollmarkClicked", tab: tabs[0] });
    });
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "scrollmarkClicked") {
      chrome.tabs.create({
        url: request.data.url,
        active: true
      }, tab => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
          // make sure the status is 'complete' and it's the right tab
          if (tabId === tab.id && changeInfo.status == 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
              target: {tabId: tab.id},
              args: [request.data],
              func: (data) => {
                scrollTo(data.xScroll, data.yScroll);
              },
            });
          }
        });
      });
    }
  }
);