var x1 = [];

// start recording
function recordGaze(cornerCoordinates) {
  // webgazer.setRegression("ridge");
  webgazer
    .setGazeListener(function (data, elapsedTime) {
      if (data == null) {
        return;
      }
      var xprediction = data.x;
      var yprediction = data.y;

      x1.push([xprediction, yprediction]);
      console.log(xprediction + "," + yprediction);
      // if(xprediction < (cornerCoordinates[0]-100) || xprediction > (cornerCoordinates[1]+100) ||
      // yprediction < (cornerCoordinates[2]+100) || yprediction > (cornerCoordinates[3]-100) ){
      //   alert('Looking away')
      // }
      // if(xprediction < (cornerCoordinates[0]-100) ){
      //   alert('Looking away',cornerCoordinates[0]-100)
      // }
    })
    .begin();
    webgazer.showPredictionPoints(true);
}

// exporting data to .csv file
function saveGaze() {
  console.log(x1);

  var csv = "";
  x1.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = "gazeData.csv";
  hiddenElement.click();
}

