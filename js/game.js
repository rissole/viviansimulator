function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Game(questionData) {
    this.questions = questionData;
    this.questionSet = this.questions[getRandomInt(0, this.questions.length-1)];
    this.$screenMain = $('.screen2');
    this.$screenVideoQuiz = $('.screen3');
    this.$screenShare = $('.screen4');
    this.$framePaper = $('#frame-paper');
    this.$frameQuestions = $(document.getElementById('frame-questions').contentDocument);
    this.$frameVideo = $('#frame-video');
    this.$frame2048 = $(document.getElementById('frame-2048').contentDocument);
    this.$countdown = $('#countdown');
    this.TIMELIMIT = 90 * 1000;

    this.score2048 = 0;
    this.scorePaper = 0;
    this.scoreVideo = 0;
}

Game.prototype.initMainScreenDOM = function() {
    // video
    this.$frameVideo.attr('src', 'http://www.youtube.com/embed/' + this.questionSet.video);

    // paper
    this.$framePaper.attr('src', this.questionSet.paper);

    // paper questions
    var formatQuestion = function(i, questionText) {
        return '<label for="paper-q%n%">%question%</label><input id="paper-q%n%" type="text">'.replace(/%n%/g, i).replace('%question%', questionText);
    }
    for (i in this.questionSet.paperQuestions) {
        this.$frameQuestions.find('fieldset').append(formatQuestion(i, this.questionSet.paperQuestions[i].question));
    }
}

Game.prototype.startTimer = function() {
    //WTF COUNTdown js is the worst thing ever, i cant believe this is used in a production environment, wait i can.
    var self = this;
    var timerId = countdown((new Date()).getTime()+this.TIMELIMIT, function(ts) {
            if (ts.minutes == 0 && ts.seconds == 0) {
                window.clearInterval(timerId);
            }
            var seconds = ts.seconds;
            // WOW back to first year for me
            if (seconds < 10) {
                seconds = '0' + seconds.toString();
            }
            self.$countdown.text(ts.minutes + ':' + seconds);
    }, countdown.MINUTES | countdown.SECONDS);
}

Game.prototype.progress = function() {
    // screen2 -> screen3
    if (this.$screenMain.is(":visible")) {
        this.calculate2048Score();
        this.calculatePaperScore();
        this.initVideoQuizDOM();
        this.$screenMain.fadeOut(500);
        this.$screenVideoQuiz.fadeIn(500);
    // screen3 -> screen4
    } else if (this.$screenVideoQuiz.is(":visible")) {
        this.calculateVideoScore();
        this.initShareDOM();
        this.$screenVideoQuiz.fadeOut(500);
        this.$screenShare.fadeIn(500);
    }
}

Game.prototype.initVideoQuizDOM = function() {
    var formatQuestion = function(i, questionText, answers) {
        var ret = '<h3>%question%</h3>'.replace('%question%', questionText);
        for (a in answers) {
            ret += '<label for="vid-a%q%-%a%" class="pure-radio"><input id="vid-a%q%-%a%" type="radio" name="vid-a%q%" value="a%q%-%a%">%answer%</label>'
            .replace(/%q%/g, i).replace(/%a%/g, a).replace('%answer%', answers[a][0]);
        }
        return ret;
    }
    for (i in this.questionSet.videoQuestions) {
        var q = this.questionSet.videoQuestions[i];
        this.$screenVideoQuiz.find('form').append(formatQuestion(i, q.question, q.answers));
    }
    this.$screenVideoQuiz.find('#video-desc').text(this.questionSet.videoDesc);
}

Game.prototype.getTotalScore = function() {
    return this.score2048 + this.scorePaper + this.scoreVideo;
}

Game.prototype.initShareDOM = function() {
    // custom twitter message with your score
    var twitterElement = '<a href="https://twitter.com/intent/tweet?button_hashtag=viviansimulator2014&text=I%20just%20scored%20$SCORE$%20points%20in%20Vivian%20Simulator%202014!" class="twitter-hashtag-button" data-url="http://vivians.im">Tweet #viviansimulator2014</a>'
    .replace('$SCORE$', this.getTotalScore());
    $('#tweet-container').append(twitterElement);
    twttr.widgets.load();

    // show scores
    $('.sim-scores-2048 .score').text(this.score2048);
    $('.sim-scores-paper .score').text(this.scorePaper);
    $('.sim-scores-video .score').text(this.scoreVideo);
    $('.sim-scores-total .score').text(this.getTotalScore());
}

Game.prototype.calculate2048Score = function() {
    var rawScore = parseInt(this.$frame2048.find('div.score-container').text())
    this.score2048 = rawScore;
    return this.score2048;
}

Game.prototype.calculatePaperScore = function() {
    var score = 0;
    for (i in this.questionSet.paperQuestions) {
        var input = this.$frameQuestions.find('#paper-q'+i).val();
        if (input.toLowerCase() == this.questionSet.paperQuestions[i].answer) {
            score += 200;
        }
    }
    this.scorePaper = score;
    return score;
}

Game.prototype.calculateVideoScore = function() {
    var score = 0;
    var self = this;
    for (i in this.questionSet.videoQuestions) {
        $('input[name=vid-a'+i+']').each(function (j, element) {
            if ($(element).is(':checked') && self.questionSet.videoQuestions[i].answers[j][1] == true) {
                score += 200;
            }
        });
    }
    this.scoreVideo = score;
    return score;
}