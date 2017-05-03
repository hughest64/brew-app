var hr = document.getElementById('hr');
var mn = document.getElementById('mn');
var sec = document.getElementById('sec');
var display = document.getElementById('timer');
var recipeName = document.getElementById('recipeName');
var current_step = document.getElementById('current_step');
var steps = localStorage['steps'];

var hop_adds = localStorage['hop_adds'];
var hopKeys = Object.keys(JSON.parse(hop_adds));

var hopModal = document.getElementById('hop-modal');
var hopList = document.getElementById('hop-list');

var set = document.getElementById('set-text');
var modal = document.getElementById('timer-modal');
var span = document.getElementsByClassName('close')[0];
var hopSpan = document.getElementsByClassName('close')[1];

var mashSteps = document.getElementsByClassName('mash-step');

function currentMashStep() {
    for (var i=0; i < mashSteps.length; i++) {
        if (i == Number(localStorage['stepIndex'])) {
            mashSteps[i].style.color = "#b3dbff";
            mashSteps[i].style.fontWeight = "bold";
        }
        else {
            mashSteps[i].style.color = "#fff";
            mashSteps[i].style.fontWeight = "normal";
        }
    }
}

function goToStep(clicked_id) {
    var id = clicked_id.slice(-1);
    if (id != localStorage['stepIndex']) {
        localStorage['stepIndex'] = id;
        nextTimer();
    }
}

set.onclick = function() {
    modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == hopModal) {
        hopModal.style.display = "none";
    }
}

hopSpan.onclick = function() {
    hopModal.style.display = 'none';
}

////////////////////////////////////////////////////////
function hopCheck(time) {
    var sec = Math.floor(time / 1000);
    var hop = hopKeys.indexOf(sec.toString())
    var hops = Object.values(JSON.parse(hop_adds));
    if (current_step.innerHTML == 'Boil' && hop != -1) {
        for (var i=0; i < hops[hop].length; i++) {
            var hopElement = document.createElement("li");
            // set up how you want this displayed!!!
            var hopText = document.createTextNode(hops[hop][i]);
            hopElement.appendChild(hopText);
            hopList.appendChild(hopElement);
     }
        hopModal.style.display = "block";

    }
}

function xtraTime(hour, minute) {
    hr.value = hour;
    mn.value = minute;
    current_step.innerHTML = 'timer';
    // localStorage['stepIndex'] = JSON.parse
    localStorage['stepIndex'] = JSON.parse(steps).length + 1;
    setTimer();
    modal.style.display = 'none';
}

function setTimer() {
    // if a timer is running, stop it
    stopTimer();
    // we only set the timer if there is some value to set
    if (hr.value || mn.value || sec.value) {
        // the 450 adds a bump to ms and keeps the timer from skipping
        var remainingTime = (
            (Math.abs(Math.floor(hr.value)) * 3600000) +
            (Math.abs(Math.floor(mn.value)) * 60000) +
            (Math.abs(Math.floor(sec.value * 1000))) + 450
        )
        var resetTime = remainingTime;
        localStorage['remainingTime'] = remainingTime;
        localStorage['resetTime'] = resetTime;
        formatDisplay(remainingTime);
        hr.value = "";
        mn.value = "";
    }
}

function runTimer() {
    if (localStorage['isRunning']) {
        var endTime = Number(localStorage['endTime']);
        var remainingTime = endTime - Date.now();
        hopCheck(remainingTime);
        // adding some buffer time to make sure we don't lose any time
        if (remainingTime % 1000 < 10) {
            endTime += 441;
            localStorage['endTime'] = endTime;
        }
        localStorage['remainingTime'] = remainingTime;
        formatDisplay(remainingTime);
        if (remainingTime > 999) {
            timer = setTimeout(runTimer, 1000);
        } else {
            localStorage['isRunning'] = '';
            localStorage['remainingTime'] = '';
            localStorage['resetTime'] = '';
            localStorage['stepIndex'] = Number(localStorage['stepIndex']) + 1;
            nextTimer();
        }
    }
}

function formatDisplay(time) {
    var hour = Math.floor(time/3600000);
    var minute = Math.floor(time/60000) % 60;
    var second = Math.floor(time/1000) % 60;

    var displayHr = "0" + hour;
    var displayMn = "0" + minute;
    var displaySec = "0" + second;

    if (hour > 0) {
        display.innerHTML = displayHr.slice(-2) + ":" + displayMn.slice(-2) + ":" + displaySec.slice(-2);
    } else {
        display.innerHTML = displayMn.slice(-2) + ":" + displaySec.slice(-2);
    }
}

function startTimer() {
    if (!localStorage['isRunning'] && localStorage['remainingTime']) {
        localStorage['isRunning'] = 'true';
        var remainingTime = Number(localStorage['remainingTime'])
        var endTime = Date.now() + remainingTime;
        localStorage['endTime'] = endTime;
        runTimer();
    }
}

function stopTimer() {
    localStorage['isRunning'] = '';
    clearTimeout(timer);
}

function resetTimer() {
    stopTimer();
    var remainingTime = localStorage['resetTime'];
    localStorage['remainingTime'] = remainingTime;
    formatDisplay(remainingTime);
}

function clearTimer() {
    stopTimer();
    localStorage['remainingTime'] = '';
    localStorage['resetTime'] = '';
    localStorage['endTime'] = '';
    var display = document.getElementById('timer').innerHTML = '00:00';
}

function nextTimer() {
    var index = Number(localStorage['stepIndex']);
    var parsed = JSON.parse(steps);
    if (localStorage['stepIndex'] && index < (parsed.length)) {
        stopTimer();
        current_step.innerHTML = parsed[index][0];
        mn.value = (parsed[index][1])
        localStorage['stepIndex'] = index;
        setTimer();
        currentMashStep();
    }
}

next.onclick = function() {
    localStorage['stepIndex'] = Number(localStorage['stepIndex']) + 1;
    nextTimer();
}

if (localStorage['recipeLoaded']) {
    recipeName.innerHTML = localStorage['recipeName']
    nextTimer();
    localStorage['recipeLoaded'] = '';

} else {
    formatDisplay(localStorage['remainingTime']);
    var index = Number(localStorage['stepIndex'])
    var parsed = JSON.parse(steps);
    recipeName.innerHTML = localStorage['recipeName']
    current_step.innerHTML = parsed[index][0];
    currentMashStep();
    runTimer();
}
