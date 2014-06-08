// Make arrow key events send to 2048 frame
document.addEventListener("keydown", function(event) {
    // if it's an arrow key
    if (event.which >= 37 && event.which <= 40) {
        var frame_2048 = document.getElementById("frame-2048");
        frame_2048.contentDocument.dispatchEvent(new CustomEvent("keydown", {detail: {event: event}}))
    }
});