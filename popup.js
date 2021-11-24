document.addEventListener("DOMContentLoaded", function () {
  debugger;
  chrome.storage.sync.get("scrollmarks", function (result) {
    let scrollmarks = result["scrollmarks"];
    
    let scrollmarksList = document.getElementById("scrollmarks-list");
    scrollmarks.forEach(data => {
      let scrollmark = document.createElement("div");
      scrollmark.setAttribute("class", "scrollmark-item")
      let title = document.createTextNode(data.title);
      let button = document.createElement("button");
      button.innerHTML = "Go";
      button.onclick = function() {
        chrome.runtime.sendMessage({ type: "scrollmarkClicked", data: data });
      };

      let deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.onclick = function() {
        let updatedScrollmarks = scrollmarks.filter(scrollmarkItem => {
          return scrollmarkItem.title !== data.title || scrollmarkItem.url !== data.url 
          || scrollmarkItem.xScroll !== data.xScroll || scrollmarkItem.yScroll !== data.yScroll;
        });
        scrollmarks = updatedScrollmarks;

        chrome.storage.sync.set({"scrollmarks" : updatedScrollmarks});
        scrollmark.remove();
      };

      scrollmark.appendChild(title);
      scrollmark.appendChild(button);
      scrollmark.appendChild(deleteButton);
      scrollmarksList.appendChild(scrollmark);
    });
  });
});
