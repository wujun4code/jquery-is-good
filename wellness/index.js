
class ChoiceValue {
    page = 0;
    question = 0;
    value = "";
    valueType = "";
    resultType = "";
}

class Choice {
    displayName = "";
    value = {};
}

class Question {
    displayName = "";
    options = [];
    selected = [];
    selectedClass = "quiz-pill";
    unselectedClass = "quiz-pill1";

    constructor() {
    }
}

class Page {
    evaluatedConditions = false;
    metConditions = false;
    questions = [];
}

class Section {
    displayName = "";
    id = 0;
    progressPercentage = {};
    pages = [];

    constructor() {
    }
}

class WellnessQuiz {
    constructor() {
        console.log("WellnessQuiz");
        this.init();
    }

    init() {
        this._cacheDom();
        this._bindEvents();
    }
    _cacheDom() {
        this.$option = $(".quiz-pill, .quiz-pill1");
    }

    _bindEvents() {
        this.$option.on("click", (e) => {
            console.log("clicked", e);
            let $target = $(e.currentTarget);
            //selected
            if ($target.hasClass("quiz-pill")) {
                $target.removeClass("quiz-pill");
                $target.addClass("quiz-pill1");
                // $target.siblings().removeClass("quiz-pill1");
                //$target.siblings().addClass("quiz-pill");
            } else if ($target.hasClass("quiz-pill1")) {
                $target.removeClass("quiz-pill1");
                $target.addClass("quiz-pill");
                $target.siblings().removeClass("quiz-pill");
                $target.siblings().addClass("quiz-pill1");
            }
        });

        // $(".content").click(function () {
        //     alert("Handler for .click() called.");
        // });
    }
}


new WellnessQuiz();