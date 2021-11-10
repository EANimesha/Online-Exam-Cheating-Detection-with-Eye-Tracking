var x1 = [];
// start recording
function recordGaze() {
  // webgazer.setRegression("ridge");
  webgazer
    .setGazeListener(function (data, elapsedTime) {
      if (data == null) {
        return;
      }
      var xprediction = data.x.toFixed(2);
      var yprediction = data.y.toFixed(2);

      x1.push([elapsedTime,xprediction, yprediction]);
    })
}

// exporting data to .csv file
function saveGaze(g,pm,t_cheat) {
  // console.log(x1);

  var csv = "";
  x1.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });

  g.forEach(function (value){
    csv += value;
    csv += "\n";
  });

  csv += pm;
  csv += "\n";

  t_cheat.forEach(function (value) {
    csv += value;
    csv += "\n";
  });

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = "gazeData.csv";
  hiddenElement.click();
}
