/*var steps = JSON.parse(localStorage['steps']);
var index = localStorage['stepIndex'];
var hr = document.getElementById('hr');
var mn = document.getElementById('mn');
var sec = document.getElementById('sec');
console.log(steps[0][1]);
mn.value = Number(steps[0][1]);*/

function setNewTimer() {
    if (hr.value || mn.value || sec.value) {
        // the 450 ds a bump to ms and keeps the timer from skipping
        var remainingTime = (
            (Math.abs(Math.floor(hr.value)) * 3600000) +
            (Math.abs(Math.floor(mn.value)) * 60000) +
            (Math.abs(Math.floor(sec.value * 1000))) + 450
        );
        var resetTime = remainingTime;
        localStorage['remainingTime'] = remainingTime;
        localStorage['resetTime'] = resetTime;
        localStorage['newTimer'] = 'true';
    }
}
