function start() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
   });
}



function calibrate() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "calibrate"});
   });
}


document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({pinned: false}, function(tabs) {
        document.getElementById("tabs_count").innerHTML=tabs.length;
    });

    document.getElementById('btn').addEventListener("click", start);
    document.getElementById('calibrate').addEventListener("click", calibrate);
})


// if (window.screenTop!==0 || window.screenY!==0){
//     document.getElementById("full_screen").innerHTML='yes';
// }
