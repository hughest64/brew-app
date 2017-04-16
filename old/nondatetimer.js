// load the script at the bottom of the body tag!

/*!!! timer runs fine when swithing windows but
halts when you click on a new tab in the same window -
Can local storage and/or workers fix this?*/

var hr = 0;
var mn = document.getElementById('mn');
var sec = document.getElementById('sec');
var resetHr = hr;
var resetMn = mn.value;
var resetSec = sec.value;
var display = document.getElementById('timer');
var isRunning = false;


/* !!! sec can still be manually set higher than 59 -
maybe use modulo and abs to add to min?
!!! Setting with empty fields dispalys NaN */
function setTimer() {
    // ensure that the timer only runs with positive integers
    totalMn = Math.abs(parseInt(mn.value));
    // reduce totalMn into hour and minute values
    hr = Math.abs(parseInt(totalMn/60));
    mn.value = totalMn % 60;
    // values that will become strings and displayed in the element
    displayHr = hr;
    displayMn = mn.value;
    displaySec = Math.abs(parseInt(sec.value));
    // storing values away for reseting the timer
    resetHr = displayHr;
    resetMn = mn.value;
    resetSec = sec.value;
    // displaying
    t = format(displayHr, displayMn, displaySec);
    display.innerHTML = t;
}

// decrements and displays timer values
function run() {
    if (isRunning) {
        // if the timer is not set, don't run it
        if (hr == 0 && mn.value == 0 && sec.value == 0) {
            stop();
        // if their is more than one hour left
        } else if (hr > 0 && sec.value == 0) {
            // subtract hour and reset mn and sec
            if (mn.value == 0) {
                hr --;
                mn.value = 59;
                sec.value = 59;
            // or subtract one from mn and reset sec
            } else {
                mn.value --;
                sec.value = 59;
            }
        // if we are under one hour to go
        } else if (sec.value == 0) {
            mn.value --;
            sec.value = 59;
        } else {
            sec.value --;
        }
        // create and set the display
        t = format(hr, mn.value, sec.value);
        display.innerHTML = t;
        // do the same thing again
        setTimeout(run, 1000);
    }
}

// formats the dispay as HH:MM:SS or MM:SS as necessary
function format(h, m, s) {
    displayHr = "0" + h;
    displayMn = "0" + m;
    displaySec = "0" + s;
    if (hr > 0) {
        t = displayHr.slice(-2) + ":" + displayMn.slice(-2) + ":" + displaySec.slice(-2);
    } else {
        t = displayMn.slice(-2) + ":" + displaySec.slice(-2);
    }
    return t;
}


function start() {
    if (isRunning  === false) {
       isRunning = true;
       setTimeout(run, 1000);
   }
}


function stop() {
    isRunning = false;
}


function reset() {
    isRunning = false;
    hr = resetHr;
    mn.value = resetMn;
    sec.value = resetSec;
    t = format(hr, resetMn, resetSec);
    display.innerHTML = t;
}

// start();
// with worker involved I think start() would need to be called here
// I think you can still load the file without worry as isRunning = false by default
// this should still make the stop() and reset() functions availble outside the worker
// 
