function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
   });
//    document.getElementById("full_screen").innerHTML='yes';
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({pinned: false}, function(tabs) {
        document.getElementById("tabs_count").innerHTML=tabs.length;
    });

    document.getElementById('btn').addEventListener("click", popup);
})

// if (window.screenTop!==0 || window.screenY!==0){
//     document.getElementById("full_screen").innerHTML='yes';
// }


// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("button1").addEventListener("click", popup);
// });