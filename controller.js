var questionNumber = 0;
var questionBank = [];
var stage = "#game1";
var stage2 = {};
var questionLock = false;
var numberOfQuestions;
var numberOfOptions;
var options = [];
var score = 0;
function getData() {
    $.ajax({
        async: false,
        url: 'activity.json',
        success: function(data){
            for (var i = 0; i < data.quizlist.length; i++) {
                questionBank[i] = data.quizlist[i].question;
            }
            numberOfQuestions = questionBank.length;
            for (i = 0; i < data.answers.length; i++) {
                options[i] = data.answers[i].option;
            }
            numberOfOptions = options.length;
        }
    });
}
function displayQuestion() {
    $(stage).append('<div class="questionText">' + questionBank[questionNumber]);
    for (var i = 0; i < numberOfOptions; i++) {
        $(stage).append('<div id="' + String(i) + '" class="option">' + options[i] + '</div>');
    }
    $('.option').click(function () {
        if (questionLock == false) {
            questionLock = true;
            score += parseInt(this.id);
            //liberal answer
            if (parseInt(this.id) < 2) {
                $(stage).append('<div class="feedback1">NICE!</div>');
            }
            //authoritative  answer
            if (parseInt(this.id) > 2) {
                $(stage).append('<div class="feedback2">REALLY?!</div>');
            }
            setTimeout(function () {
                changeQuestion()
            }, 1000);
        }
    })
}//display question
function changeQuestion() {
    questionNumber++;
    if (stage == "#game1") {
        stage2 = "#game1";
        stage = "#game2";
    }
    else {
        stage2 = "#game2";
        stage = "#game1";
    }
    if (questionNumber < numberOfQuestions) {
        displayQuestion();
    } else {
        displayFinalSlide();
    }

    $(stage2).animate({"right": "+=800px"}, "slow", function () {
        $(stage2).css('right', '-800px');
        $(stage2).empty();
    });
    $(stage).animate({"right": "+=800px"}, "slow", function () {
        questionLock = false;
    });
}//change question


function displayFinalSlide() {

    $(stage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: ' + numberOfQuestions + '<br>your scale is around ' + String(calculateScore()) + ' of  10' + '</div>');

}//display final slide
function calculateScore(){
    return Math.round(score / (numberOfQuestions * (numberOfOptions - 1)) * 10);
}

$(document).ready(function () {
    getData();
    displayQuestion();
});
