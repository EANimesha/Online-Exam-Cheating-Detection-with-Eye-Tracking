var x1 = [];
c=0
// start recording
function recordGaze(cornerCoordinates) {
  // webgazer.setRegression("ridge");
  webgazer
    .setGazeListener(function (data, elapsedTime) {
      if (data == null) {
        return;
      }
      var xprediction = data.x.toFixed(2);
      var yprediction = data.y.toFixed(2);

      x1.push([xprediction, yprediction]);
      console.log(xprediction + "," + yprediction);
      c=c+1
      if(c==3000){
        makePrediction(cornerCoordinates,g=x1)
        x1=[]
        c=0
      }
    })
}

async function makePrediction(cornerCoordinates,g){
  // saveGaze(g)
  var data = JSON.stringify({
    "x_min": cornerCoordinates[0],
    "x_max": cornerCoordinates[1],
    "y_max": cornerCoordinates[3],
    "y_min": cornerCoordinates[2],
    "gazes":g
  });
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      document.body.insertAdjacentText('afterbegin', `${this.responseText}...`)
    }
  });
  
  xhr.open("POST", `https://898d-104-196-251-164.ngrok.io/api`);
  // xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("content-type", "application/json");
  
  xhr.send(data);
}
// exporting data to .csv file
function saveGaze(g) {
  // console.log(x1);

  var csv = "";
  g.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = "gazeData.csv";
  hiddenElement.click();
}

// function start() {
//     chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
//         var activeTab = tabs[0];
//         chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
//    });
// }


    // if(xprediction < (cornerCoordinates[0]-100) || xprediction > (cornerCoordinates[1]+100) ||
      // yprediction < (cornerCoordinates[2]+100) || yprediction > (cornerCoordinates[3]-100) ){
      //   alert('Looking away')
      // }
      // if(xprediction < (cornerCoordinates[0]-100) ){
      //   alert('Looking away',cornerCoordinates[0]-100)
      // }
