
$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange", function () {
  if (window.innerHeight == screen.height) {
    console.log('fullscreened')
  } else {
    alert('your exam will ended')
  }
});


var PointCalibrate = 0;
var CalibrationPoints={};

var x = [];

// start recording
function recordGaze() {
  // webgazer.setRegression("ridge");
  webgazer
    .setGazeListener(function (data, elapsedTime) {
      if (data == null) {
        return;
      }
      var xprediction = data.x;
      var yprediction = data.y;

      x.push([xprediction, yprediction]);
      console.log(xprediction + "," + yprediction);
    })
    .begin();
}

// exporting data to .csv file
function saveGaze() {
  console.log(x);

  var csv = "";
  x.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";
  hiddenElement.download = "gazeData.csv";
  hiddenElement.click();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "start") {
    makeFullScreen();
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const startBtn = document.createElement("button");
    startBtn.classList.add("btn");
    startBtn.innerHTML = "Start Eye Track";
    buttons.appendChild(startBtn);
    startBtn.addEventListener("click", () => recordGaze(), false);

    const saveBtn = document.createElement("button");
    saveBtn.classList.add("btn");
    saveBtn.innerHTML = "Save Eye Track";
    buttons.appendChild(saveBtn);
    saveBtn.addEventListener("click", () => saveGaze(), false);

    const pauseBtn = document.createElement("button");
    pauseBtn.classList.add("btn");
    pauseBtn.innerHTML = "Pause";
    buttons.appendChild(pauseBtn);
    pauseBtn.addEventListener("click", () => webgazer.pause(), false);

    const resumeBtn = document.createElement("button");
    resumeBtn.classList.add("btn");
    resumeBtn.innerHTML = "Resume";
    buttons.appendChild(resumeBtn);
    resumeBtn.addEventListener("click", () => webgazer.resume(), false);

    document.body.append(buttons);
  }
  else if(request.message === "calibrate"){
    makeFullScreen();
    const content='<canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;"></canvas><div class="calibrationDiv"><input type="button" class="Calibration" id="Pt1"></input><input type="button" class="Calibration" id="Pt2"></input><input type="button" class="Calibration" id="Pt3"></input><input type="button" class="Calibration" id="Pt4"></input><input type="button" class="Calibration" id="Pt5"></input><input type="button" class="Calibration" id="Pt6"></input><input type="button" class="Calibration" id="Pt7"></input><input type="button" class="Calibration" id="Pt8"></input><input type="button" class="Calibration" id="Pt9"></input></div>'

    document.body.insertAdjacentHTML('beforeend',content)

    $(document).ready(function(){
      webgazer.begin();
      webgazer.setRegression("ridge"); 
      // ClearCanvas();
      // helpModalShow();
         $(".Calibration").click(function(){ // click event on the calibration buttons
          var prediction = webgazer.getCurrentPrediction();
            if (prediction) {
                var x = prediction.x;
                var y = prediction.y;
            }
          console.log(x + "," + y);
    
          var id = $(this).attr('id');
    
          if (!CalibrationPoints[id]){ // initialises if not done
            CalibrationPoints[id]=0;
          }
          CalibrationPoints[id]++; // increments values
    
          if (CalibrationPoints[id]==5){ //only turn to yellow after 5 clicks
            $(this).css('background-color','yellow');
            $(this).prop('disabled', true); //disables the button
            PointCalibrate++;
          }else if (CalibrationPoints[id]<5){
            //Gradually increase the opacity of calibration points when click to give some indication to user.
            var opacity = 0.2*CalibrationPoints[id]+0.2;
            $(this).css('opacity',opacity);
          }
    
          //Show the middle calibration point after all other points have been clicked.
          if (PointCalibrate == 8){
            $("#Pt5").show();
          }
    
          if (PointCalibrate >= 9){ // last point is calibrated
                //using jquery to grab every element in Calibration class and hide them except the middle point.
                $(".Calibration").hide();
                $("#Pt5").show();
    
                // clears the canvas
                var canvas = document.getElementById("plotting_canvas");
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    
                // notification for the measurement process
                var ask= confirm("Calculating measurement,Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.")
                if( ask => {
    
                    // makes the variables true for 5 seconds & plots the points
                    $(document).ready(function(){
    
                      store_points_variable(); // start storing the prediction points
    
                      sleep(5000).then(() => {
                          stop_storing_points_variable(); // stop storing the prediction points
                          var past50 = webgazer.getStoredPoints(); // retrieve the stored points
                          var precision_measurement = calculatePrecision(past50);
                          var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                          document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
                          alert( "Your accuracy measure is " + precision_measurement + "%")
                          document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
                          webgazer.clearData();
                          ClearCalibration();
                          ClearCanvas();
                          ShowCalibrationPoint();
                      });
                    });
                });
              }
        });
    });
    
  }
});

function makeFullScreen() {
  document.documentElement.requestFullscreen();
}
