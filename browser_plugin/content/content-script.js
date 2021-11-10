$(document).on(
  "webkitfullscreenchange mozfullscreenchange fullscreenchange",
  function () {
    if (window.innerHeight == screen.height) {
      console.log("fullscreened");
    } else {
      alert("your exam will ended");
    }
  }
);

var PointCalibrate = 0;
var CalibrationPoints = {};
var CornerGazes = {'lt':[],'rt':[],'rb':[],'lb':[]}
// x min, x max, y min, y max
var cornerCoordinates = []

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === "start") {
    webgazer.params.showVideoPreview = true;
    //start the webgazer tracker
    await webgazer.setRegression('ridge') 
        .setGazeListener(function(data, clock) {
        })
        // .saveDataAcrossSessions(true)
        .begin();
        webgazer.showVideoPreview(true) /* shows all video previews */
            .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
            .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

    // makeFullScreen();
    // LoadEyeTrackingControls();
  } else if (request.message === "calibrate") {
    makeFullScreen();
    const content =
      '<canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;"></canvas><div class="calibrationDiv"><input type="button" class="Calibration" id="Pt1"></input><input type="button" class="Calibration" id="Pt2"></input><input type="button" class="Calibration" id="Pt3"></input><input type="button" class="Calibration" id="Pt4"></input><input type="button" class="Calibration" id="Pt5"></input><input type="button" class="Calibration" id="Pt6"></input><input type="button" class="Calibration" id="Pt7"></input><input type="button" class="Calibration" id="Pt8"></input><input type="button" class="Calibration" id="Pt9"></input></div>';

    document.body.insertAdjacentHTML("beforeend", content);
    $(document).ready( function () {

      $(".Calibration").click(async function () {
        // click event on the calibration buttons
        var prediction = await webgazer.getCurrentPrediction();
        if (prediction) {
          var x = prediction.x.toFixed();
          var y = prediction.y.toFixed();
        }
        var id = $(this).attr("id");

        switch (id) {
          case 'Pt1':
            CornerGazes['lt'].push([x,y])
            break;
          case 'Pt3':
            CornerGazes['rt'].push([x,y])
            break;
          case 'Pt7':
            CornerGazes['lb'].push([x,y])
            break;
          case 'Pt9':
            CornerGazes['rb'].push([x,y])
            break;
          default:
            break;
        }

        if (!CalibrationPoints[id]) {
          // initialises if not done
          CalibrationPoints[id] = 0;
        }
        CalibrationPoints[id]++; // increments values

        if (CalibrationPoints[id] == 5) {
          //only turn to yellow after 5 clicks
          $(this).css("background-color", "yellow");
          $(this).prop("disabled", true); //disables the button
          PointCalibrate++;
        } else if (CalibrationPoints[id] < 5) {
          //Gradually increase the opacity of calibration points when click to give some indication to user.
          var opacity = 0.2 * CalibrationPoints[id] + 0.2;
          $(this).css("opacity", opacity);
        }

        // Show the middle calibration point after all other points have been clicked.
        if (PointCalibrate == 8) {
          $("#Pt5").show();
        }

        if (PointCalibrate >= 9) {
          // last point is calibrated
          //using jquery to grab every element in Calibration class and hide them except the middle point.
          $(".Calibration").hide();
          $("#Pt5").show();

          // clears the canvas
          var canvas = document.getElementById("plotting_canvas");
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

          getCornerGazes()

          // makes the variables true for 5 seconds & plots the points
          $(document).ready(function () {
            webgazer.params.storingPoints = true;
            // recordGazeForCalibration()
            sleep(5000).then(() => {
              webgazer.params.storingPoints = false;
              var past50 = webgazer.getStoredPoints();
              var precision_measurement = calculatePrecision(past50);
              // alert( "Your accuracy measure is " + precision_measurement + "%")
              console.log(
                "Your accuracy measure is " + precision_measurement + "%"
              );
              // webgazer.clearData();
              ClearCalibration();
              ClearCanvas();
              if(precision_measurement>30){
                LoadEyeTrackingControls();
              }else{
                ShowCalibrationPoint();
              }
            });
          });
        }
      });
    });
  } else if (request.message === "end") {
    webgazer.end();
  }
});

function makeFullScreen() {
  document.documentElement.requestFullscreen();
}

function LoadEyeTrackingControls() {
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const startBtn = document.createElement("button");
  startBtn.classList.add("btn");
  startBtn.innerHTML = "Start Eye Track";
  buttons.appendChild(startBtn);
  startBtn.addEventListener("click", () => recordGaze(cornerCoordinates), false);

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

function getCornerGazes(){
  for (const [key, value] of Object.entries(CornerGazes)) {
    var x_tot=0
    var y_tot=0
    value.map((point)=>{
      x_tot+=parseInt(point[0]);
      y_tot+=parseInt(point[1])
    })
    CornerGazes[key]=[parseInt((x_tot/value.length).toFixed()),parseInt((y_tot/value.length).toFixed())]
    // console.log(key + "= " + CornerGazes[key][0], CornerGazes[key][1])
    // cornerCoordinates
  }
  cornerCoordinates.push(((CornerGazes['lt'][0]+CornerGazes['lb'][0])/2).toFixed())
  cornerCoordinates.push(((CornerGazes['rt'][0]+CornerGazes['rb'][0])/2).toFixed())
  cornerCoordinates.push(((CornerGazes['rb'][1]+CornerGazes['lb'][1])/2).toFixed())
  cornerCoordinates.push(((CornerGazes['rt'][1]+CornerGazes['lt'][1])/2).toFixed())
  for (i = 0; i < cornerCoordinates.length; i++){
    console.log(cornerCoordinates[i])
  }
  // document.body.insertAdjacentText('beforeend', cornerCoordinates.toString())
}

function ClearCanvas(){
  $(".Calibration").hide();
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function ShowCalibrationPoint() {
  $(".Calibration").show();
  $("#Pt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  // Clear data from WebGazer

  $(".Calibration").css('background-color','red');
  $(".Calibration").css('opacity',0.2);
  $(".Calibration").prop('disabled',false);

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}