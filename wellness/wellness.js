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
    selectedClass = "";
    unselectedClass = "";
    selectedChoices = [];
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
    CATALOG_API_HOST = "http://catalog.app.iherblocal.com";
    name = "wellness";
    activeClass = "active";
    sections = [];
    startSectionId = 1;
    currentPage = 0;
    selectedChoices = [];
    constructor() {
        this.init();
    }

    getSections(sectionId) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: `${this.CATALOG_API_HOST}/quizzes/${this.name}/sections/${sectionId}`,
        }).then((res) => {
            let comingSection = res.sections[0];
            this.sections.push(comingSection);
            console.log('comingSection', comingSection);
            this.$wellness_quiz_container = $(".wellness-quiz-container");
            this.$wellness_quiz_container.html(this.renderContainer(comingSection));
            this.$wellness_page_container = $(".wellness-page-container");
            this._cacheDom();
            this._bindEvents();
        });
    }

    init() {
        this._bindGlobalEvents();
        this.currentPage = 0;
        this.getSections(this.startSectionId);
    }

    _cacheDom() {
        this.$option = $(".wellness-option");
    }

    _bindGlobalEvents() {
        this.$nextQuestionBtn = $(".wellness-progress-bar-next-btn");
        this.$nextQuestionBtn.on("click", (e) => {
            this.handleClickNextQuestion(e);
        });

        this.$backwardBtn = $(".wellness-progress-bar-backward-btn");
        this.$backwardBtn.on("click", (e) => {
            this.handleClickNextQuestion(e);
        });
    }

    _bindEvents() {
        this.$option.on("click", (e) => {
            this.handleOptionClick(e);
        });
    }

    renderContainer(section) {
        return `${this.renderSection(section)}`;
    }

    renderSection(section) {
        let pages = section.pages;
        let className = "wellness-section current-section";
        let pagesHtml = `<div class="${className}" data-id="${section.id}">${this.renderPages(pages, section)}</div>`;
        return `<div class="wellness-section-container">${pagesHtml}</div>`;
    }

    renderPages(pages, section) {
        let html = "";
        let validPageIndex = this.currentPage;
        for (let index = this.currentPage; index < pages.length; index++) {
            const page = pages[index];
            if (page.questions === undefined || !Array.isArray(page.questions) || page.questions.length < 1) {
                validPageIndex++;
            }
            else {
                break;
            }
        }

        const page = pages[validPageIndex];
        console.log('validPageIndex', validPageIndex);
        html += this.renderPage(page, validPageIndex, section);
        this.currentPage = validPageIndex;
        return `<div class="wellness-page-container">${html}</div>`;
    }

    renderPage(page, i, section) {
        let questions = page.questions;
        if (questions.length === 0) return "";
        let className = i === this.currentPage ? "wellness-page current-page" : "wellness-page";
        return `<div class="${className}" data-index="${i}">${this.renderQuestions(questions, section)}</div>`;
    }

    renderQuestions(questions, section) {
        let html = "";
        if (questions.length === 0) return html;
        questions.forEach((question, i) => {
            html += this.renderQuestion(question, section);
        });
        return `<div class="wellness-question-container">${html}</div>`;
    }

    renderQuestion(question, section) {
        if (question.choiceType === "SingleChoice") {
            return this.renderSingleChoiceQuestion(question, section);
        } else if (question.choiceType === "MultipleChoices") {
            return this.renderMultipleChoicesQuestion(question, section);
        }
    }

    renderSingleChoiceQuestion(question, section) {

        let html = "";
        let choices = question.choices;

        choices.forEach((choice, i) => {
            html += this.renderChoice(choice, question.choiceStyle, section);
        });
        return `<div class="wellness-question" data-required=${question.isRequired} data-choicetype=${question.choiceType}><div class="wellness-question-title-container">${question.displayName}</div><div class="wellness-radio-option-container">
        ${html}</div></div>`;
    }

    renderMultipleChoicesQuestion(question, section) {
        let choices = question.choices;
        let html = "";
        choices.forEach((choice, i) => {
            html += this.renderChoice(choice, question.choiceStyle, section);
        });
        return `<div class="wellness-question" data-required=${question.isRequired} data-choicetype=${question.choiceType}><div class="wellness-question-title-container">${question.displayName}</div><div class="wellness-checkbox-option-container">
        ${html}</div></div>`;
    }

    renderChoice(choice, choiceStyle, section) {
        let html = "";
        if (choiceStyle === "CheckBoxAndLabel")
            html += this.renderCheckbox(choice, section);
        else if (choiceStyle === "Label") {
            html += this.renderLabel(choice, section);
        } else {
            html += this.renderRadio(choice, section);
        }
        return html;
    }

    renderLabel(choice, section) {
        return `
        <div class="wellness-checkbox-option wellness-option" ${this.renderChoiceData(choice, section)}>
        <div class="wellness-checkbox-option-btn-icon"><img alt="" /></div>
          <b class="checkbox-option-text">${choice.displayName}</b>
        </div>`;
    }

    renderRadio(choice, section) {
        return `
        <div class="wellness-radio-option wellness-option" ${this.renderChoiceData(choice, section)}>
          <div class="wellness-radio-option-btn-icon">
            <img alt="" />
          </div>
          <b class="radio-option-text">${choice.displayName}</b>
        </div>`;
    }

    renderCheckbox(choice, section) {
        return `
        <div class="wellness-checkbox-option wellness-option" ${this.renderChoiceData(choice, section)}>
          <div class="wellness-checkbox-option-btn-icon">
            <img alt="" />
          </div>
          <b class="checkbox-option-text">${choice.displayName}</b>
        </div>`;
    }

    renderChoiceData(choice, section) {
        const tempId = `${section.id}-${choice.value.page}-${choice.value.question}-${choice.value.value}`;
        return `
        data-value=${choice.value.value} 
        data-page=${choice.value.page}
        data-question=${choice.value.question}
        data-valueType=${choice.value.valueType}
        data-resultType=${choice.value.resultType || "none"}
        data-tempid=${tempId}
        `;
    }

    handleOptionClick(e) {
        let $target = $(e.currentTarget);
        let $question = $target.parents(".wellness-question");
        let choiceType = $question.data("choicetype");
        //unselected
        if ($target.hasClass(this.activeClass)) {
            $target.removeClass(this.activeClass);
            this.handleUnselected(e);
        } else {
            $target.addClass(this.activeClass);
            if (choiceType === "SingleChoice") {
                this.cleanUnselected($target.siblings(this.activeClass));
                $target.siblings().removeClass(this.activeClass);
            }
            this.handleSelected(e);
        }
    }

    handleClickNextQuestion() {
        let valid = true;
        $(".wellness-question").each((i, question) => {
            let isRequired = $(question).data("required");
            let chosen = $(question).find(`.${this.activeClass}`).length > 0;
            if (isRequired === true && !chosen) {
                valid = false;
            }
        });
        if (valid === false) {
            alert("some question(s) require your choice.")
        }
        else {
            this.forward();
        }
    }

    getCurrentSection() {
        let currentSectionId = $(".current-section").data("id");
        let found = this.sections.findIndex(s => s.id == currentSectionId);
        return this.sections[found];
    }

    forward() {
        let currentPage = $(".current-page").data("index");
        let section = this.getCurrentSection();
        let pageLength = section.pages.length;
        currentPage += 1;

        // for (let index = currentPage; index < section.pages.length; index++) {
        //     const page = section.pages[index];
        //     if (page.questions === undefined || !Array.isArray(page.questions) || page.questions.length < 1) {
        //         currentPage++;
        //     }
        // }

        if (currentPage >= pageLength) {
            this.currentPage = 0;
            this.nextSection();
        }
        else {
            this.currentPage = currentPage;
            this.nextPage();
        }
    }

    nextSection() {
        let currentSectionId = $(".current-section").data("id");
        this.getSections(currentSectionId + 1);
    }

    backSection() {
        let currentSectionId = $(".current-section").data("id");
        this.getSections(currentSectionId - 1);
    }

    nextPage() {
        // let section = this.getCurrentSection();
        // this.$wellness_page_container.html(this.renderPages(section.pages));
        // this._cacheDom();
        // this._bindEvents();
        this.getNextPage();
    }

    getCurrentSectionChoices() {
        const currentSection = this.getCurrentSection();
        let choices = [];

        currentSection.pages.forEach(page => {
            if (page.questions != undefined && Array.isArray(page.questions) && page.questions.length > 0) {

                page.questions.forEach(question => {
                    if (question.choices != undefined && Array.isArray(question.choices) && question.choices.length > 0) {
                        question.choices.forEach(choice => {
                            if (choice.selected === true) {
                                const requestModel = this.mapToRequestModel(choice);
                                choices.push(requestModel);
                            }
                        });
                    }
                });
            }
        });

        return choices;
    }

    mapToRequestModel(choice) {
        const currentSection = this.getCurrentSection();
        const requestModel = {
            section: currentSection.id,
            page: choice.value.page,
            question: choice.value.question,
            value: choice.value.value,
            valueType: choice.value.valueType,
            resultType: choice.value.resultType || "",
        };
        return requestModel;
    }

    getNextPage() {
        const currentSectionChoices = this.getCurrentSectionChoices();
        const data = JSON.stringify({ choices: currentSectionChoices });
        let currentSectionId = $(".current-section").data("id");
        $.ajax({
            type: "POST",
            contentType: "application/json",
            data: data,
            url: `${this.CATALOG_API_HOST}/quizzes/${this.name}/sections/${currentSectionId}`,
        }).then((res) => {
            let sections = res.sections;
            let comingSection = sections[0];
            // this.$wellness_quiz_container = $(".wellness-quiz-container");
            // this.$wellness_quiz_container.html(this.renderContainer());
            // this.$wellness_page_container = $(".wellness-page-container");
            this.sections.push(comingSection);
            let nextValidPageIndex = this.getNextValidPageIndex(comingSection.pages);
            if (nextValidPageIndex > -1) {
                this.$wellness_page_container.html(this.renderPages(comingSection.pages));
                this._cacheDom();
                this._bindEvents();
            } else {
                this.currentPage = 0;
                this.nextSection();
            }
        });
    }

    getNextValidPageIndex(pages) {
        let validPageIndex = this.currentPage;
        for (let index = this.currentPage; index < pages.length; index++) {
            const page = pages[index];
            if (page.questions === undefined || !Array.isArray(page.questions) || page.questions.length < 1) {
                validPageIndex++;
            }
            else {
                break;
            }
        }
        if (validPageIndex === pages.length) return -1;
        return validPageIndex;
    }

    backPage() {
        this.currentPage -= 1;
        this.getPreviousPage();
    }

    getPreviousPage() {
        const data = JSON.stringify({ choices: this.selectedChoices });
        let currentSectionId = $(".current-section").data("id");
        $.ajax({
            type: "POST",
            contentType: "application/json",
            data: data,
            url: `${this.CATALOG_API_HOST}/quizzes/${this.name}/sections/${currentSectionId}`,
        }).then((res) => {
            let sections = res.sections;
            // this.$wellness_quiz_container = $(".wellness-quiz-container");
            // this.$wellness_quiz_container.html(this.renderContainer());
            // this.$wellness_page_container = $(".wellness-page-container");
            let nextValidPageIndex = this.getPreviousValidPageIndex(sections[0].pages);
            if (nextValidPageIndex > -1) {
                this.$wellness_page_container.html(this.renderPages(sections[0].pages));
                this._cacheDom();
                this._bindEvents();
            } else {
                this.currentPage = 0;
                this.nextSection();
            }
        });
    }

    getPreviousValidPageIndex(pages) {
        let validPageIndex = this.currentPage;
        for (let index = this.currentPage; index > 0; index--) {
            const page = pages[index];
            if (page.questions === undefined || !Array.isArray(page.questions) || page.questions.length < 1) {
                validPageIndex--;
            }
            else {
                break;
            }
        }
        if (validPageIndex === 0) return -1;
        return validPageIndex;
    }

    handleSelected(e) {
        let currentSection = this.getCurrentSection();
        let $target = $(e.currentTarget);
        let questionId = $target.data("question");
        let value = $target.data("value");
        const pageIndex = $(".current-page").data("index");
        const question = currentSection.pages[pageIndex].questions[questionId - 1];
        console.log("value", value);
        console.log("question.choices", question.choices);
        let choiceIndex = question.choices.findIndex(c => c.value.value == value);
        question.choices[choiceIndex].selected = true;
        // const choice = {
        //     section: currentSectionId,
        //     page: $target.data("page"),
        //     question: $target.data("question"),
        //     value: $target.data("value"),
        //     valueType: $target.data("valuetype"),
        //     resultType: $target.data("resulttype") || "",
        //     tempId: `${currentSectionId}-${page}-${question}-${value}`
        // };
        //this.selectedChoices.push(choice);
    }

    handleUnselected(e) {
        let currentSection = this.getCurrentSection();
        let $target = $(e.currentTarget);
        let questionId = $target.data("question");
        let value = $target.data("value");
        const pageIndex = $(".current-page").data("index");
        const question = currentSection.pages[pageIndex].questions[questionId - 1];
        let choiceIndex = question.choices.findIndex(c => c.value.value == value);
        question.choices[choiceIndex].selected = false;
    }

    cleanUnselected(ea) {
        if (ea.length) {
            let $target = $(ea[0]);
            let currentSection = this.getCurrentSection();
            let value = $target.data("value");
            const pageIndex = $(".current-page").data("index");
            const question = currentSection.pages[pageIndex].questions[questionId - 1];
            let choiceIndex = question.choices.findIndex(c => c.value.value == value);
            question.choices[choiceIndex].selected = false;
        }
    }

    backward(e) {

    }

    skipQuestion() {
        this.forward();
    }

    serCanSkip() {

    }

    calcProgressPercent() {

    }
}


new WellnessQuiz();