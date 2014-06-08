$(function() {
    $.getJSON('js/questions.json', function(questionData) {
        game = new Game(questionData);
        game.initMainScreenDOM();
    });
});

var times = [];
var differences = [];
var WINDOW_LENGTH = 50;
INITIAL_FEEDBACK = "Type furiously to begin";
SERIOUSLY = "No, seriously. Start typing."

$feedback = $('#feedback');
$feedback.text(INITIAL_FEEDBACK);

setTimeout(function() {
    $feedback.trigger('click');
}, 10000);

$(document).on('click', function() {
    if ($feedback.text() == INITIAL_FEEDBACK) {
        $feedback.fadeOut(function() {
            $feedback.text(SERIOUSLY).fadeIn();
        });
    }
});

//Initialise the differences array to big values, so we aren't typing furiously yet.
for (var i = 0; i < WINDOW_LENGTH; i++) {
    differences[i] = 1000.0;
}
// Time in ms between keystrokes which we think is fast.
// (50ms)
var TIME_BETWEEN_KEYSTROKES = 50;

// add an object with keycode and timestamp
$(document).keyup(function(evt) {
    if (checkFuriousness()) {
        // If we've passed the test, stop recording keystrokes.
        $(document).unbind('keyup');
        window.setTimeout(showPage, 2000);
    }

    if (times.length != 0) {
        differences.push(evt.timeStamp - times[times.length - 1] );
    }
    times.push(evt.timeStamp);

    //Only keep the last few times, ring buffer style.
    times = times.slice(-WINDOW_LENGTH);
});

function mfwAverage(iterable) {
    //mfw I have to write this myself
    var sum = 0.0;
    for (var i = 0; i < iterable.length; i++)
    {
        sum += iterable[i]; 
    }
    return sum / iterable.length;

}
function checkFuriousness() {
    // Whether we are typing furiously enough.
    // Furious if the average time between keystrokes over the last X keystrokes  is less than so much.

    if (differences.length <= WINDOW_LENGTH) {
        return false;
    }

    //The last few keystrokes
    //var time_window = differences.slice(-WINDOW_LENGTH);
    differences = differences.slice(-WINDOW_LENGTH);
    var average = mfwAverage(differences);

    var message = "";
    if (average <= TIME_BETWEEN_KEYSTROKES) {
        message = "I'm in!";
    }
    else if (average < 100) {
        message = "It's 11:59:59 quick!";
    }
    else if (average < 250) {
        message = "[typing intensifies]";
    }
    else if (average < 500) {
        message = "Time to start this assignment!";
    }
    else if (average < 800) {
        message = "Faster!";
    }

    var $feedback = $('#feedback');
    if (message != "" && $feedback.text() != message) {
        $feedback.fadeOut(100, function() {
            $feedback.text(message).fadeIn(100);
        });
    }

    return average < TIME_BETWEEN_KEYSTROKES ;
}

function showPage() {
    game.progress();
}
