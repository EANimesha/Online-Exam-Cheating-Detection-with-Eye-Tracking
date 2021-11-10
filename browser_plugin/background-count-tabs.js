chrome.runtime.onSuspend.addListener(function() {
    console.log("onSuspend");
});

function countTabs() {
    chrome.tabs.query({pinned: false}, function(tabs) {

        // console.log("tabsCount: " + tabs.length);
        setBadge(tabs.length);
    });
};

function setBadge(value) {
    chrome.browserAction.setBadgeText({text: value.toString()});
    if(value>1){
        alert('Please close other tabs')
    }
}

chrome.tabs.onCreated.addListener(countTabs);
chrome.tabs.onRemoved.addListener(countTabs);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo != null && changeInfo.pinned != null) {
        countTabs();
    }
});

countTabs();