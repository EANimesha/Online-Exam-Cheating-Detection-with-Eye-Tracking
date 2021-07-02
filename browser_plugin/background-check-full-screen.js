// document.addEventListener('resize', (event) => {
//     console.log('fullScreenChange')
//     // if (document.fullscreenElement) {
//     //   console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
//     // } else {
//     //   console.log('Leaving full-screen mode.');
//     // }
// })
  
$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange", function () {
    console.log('your exam will ended')
    if (window.innerHeight == screen.height) {
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "fullScreen"});
      });
      console.log('fullscreened')
    } else {
      alert('your exam will ended')
    }
  });