var TIMELIMIT = 90 * 1000;

// Make arrow key events send to 2048 frame
document.addEventListener("keydown", function(event) {
    // if it's an arrow key
    if (event.which >= 37 && event.which <= 40) {
        var frame_2048 = document.getElementById("frame-2048");
        frame_2048.contentDocument.dispatchEvent(new CustomEvent("keydown", {detail: {event: event}}))
    }
});

//WTF COUNTdown js is the worst thing ever, i cant believe this is used in a production environment, wait i can.
var timerId = countdown((new Date()).getTime()+TIMELIMIT, function(ts) {
        if (ts.minutes == 0 && ts.seconds == 0) {
            window.clearInterval(timerId);
        }
        var seconds = ts.seconds;
        // WOW back to first year for me
        if (seconds < 10) {
            seconds = '0' + seconds.toString();
        }
        document.getElementById('countdown').innerHTML = ts.minutes + ':' + seconds;
}, countdown.MINUTES | countdown.SECONDS);