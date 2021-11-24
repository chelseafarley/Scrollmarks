chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.type === "addScrollmarkClicked") {
      // Add to storage
      let xOffset = scrollX;
      let yOffset = scrollY;
      chrome.storage.sync.get('scrollmarks', function (result) {
        let currentScrollmarks = result['scrollmarks'];
        let newScrollmark = {
          url: request.tab.url,
          title: request.tab.title,
          xScroll: xOffset,
          yScroll: yOffset
        };

        if (!currentScrollmarks) {
          chrome.storage.sync.set({"scrollmarks" : [newScrollmark]});
        } else {
          currentScrollmarks.push(newScrollmark);
          chrome.storage.sync.set({"scrollmarks" : currentScrollmarks});
        }
      });
    }
  }
);