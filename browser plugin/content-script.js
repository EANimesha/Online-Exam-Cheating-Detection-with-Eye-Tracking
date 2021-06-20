// const endBtn=document.createElement('button');
// endBtn.classList.add('endBtn')
// endBtn.innerHTML='End Proctoring';
// document.body.append(endBtn)
var x = [];

// start recording
function recordGaze() {
    webgazer.setGazeListener(function (data, elapsedTime) {
        if (data == null) {
            return;
        }
        var xprediction = data.x; 
        var yprediction = data.y;

        x.push([xprediction, yprediction]);
        console.log(xprediction + "," + yprediction);
    }).begin();
}

 // exporting data to .csv file
 function saveGaze() {
  console.log(x);

  var csv = '';
  x.forEach(function (row) {
      csv += row.join(',');
      csv += "\n";
  });


  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'gazeData.csv';
  hiddenElement.click();
}

const buttons=document.createElement('div');
buttons.classList.add('buttons')

const startBtn=document.createElement('button')
startBtn.classList.add('btn')
startBtn.innerHTML='Start Eye Track';
buttons.appendChild(startBtn);
startBtn.addEventListener("click", () =>
  recordGaze()
, false);

const saveBtn=document.createElement('button')
saveBtn.classList.add('btn')
saveBtn.innerHTML='Save Eye Track';
buttons.appendChild(saveBtn);
saveBtn.addEventListener("click", () =>
  saveGaze()
, false);

document.body.append(buttons)

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "start" ) {
          makeFullScreen()
        }
    }
  );

  function makeFullScreen(){
    document.documentElement.requestFullscreen()
  }

