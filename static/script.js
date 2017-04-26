// This will have other content once setting a manual timer is a modal !!!
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


///////////////////////////////////////////
// the clickable text
var set = document.getElementById('set-text');
// the modal div
var modal = document.getElementById('timer-modal');


set.onclick = function() {
    modal.style.display = 'block';
    // alert('testing 1, 2, 3')
}
