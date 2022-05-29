import { generateAnswer, calcQuiz } from "./utils.js";
import { rules, classOfStatus } from "./data.js";
const first_num = document.querySelector(".first-number");
const second_num = document.querySelector(".second-number");
const operation_ui = document.querySelector(".operation");
const answers_ui = document.querySelectorAll(".answer");
const quiz_round = document.querySelector(".quiz-round");
const points_ui = document.querySelector(".points");
const timer_ui = document.querySelector(".timer");
const gameZone = document.querySelector(".game-zone");
const degreeZone = document.querySelector(".degree-zone");
const resultZone = document.querySelector(".result-zone");
const degreeButtons = document.querySelectorAll(".degree-button");
const degreeTitle = document.querySelector(".degre-title");
const pointsResult = document.querySelectorAll(".point-result");
const pointPercents = document.querySelectorAll(".point-percent");
const btnReset = document.getElementById("btn-reset");
const btnShowAnswers = document.getElementById("btn-show-answers");
const btnNewGame = document.querySelector(".new-game");

const MAX_ROUND = 10;
let MAX_TIME = 0;
let operations = ["*", "-", "+"];
let quizzes = [];
let answerPoints = [];

let firstNum;
let secondNum;
let timer;
let intervalId;
let distance;

// LOGIC FUNCTIONS
const generateAnswers = (corAnswer) => {
  const answers = [corAnswer];
  for (let i = 1; i < 4; i++) answers[i] = generateAnswer(corAnswer);
  const mixedAnswers = answers.sort(() => Math.random() - 0.5);
  return mixedAnswers;
};

function showAllResult() {
  const answerAmounts = [0 /**timeout */, 0 /**fail */, 0 /**success */];
  toggleZone([resultZone]);

  quizzes.forEach((quiz) => {
    const isTimeout = quiz.selectedIdx === null;
    const isCorrect = quiz.correctAnswer === quiz.answers[quiz.selectedIdx];
    const amountIdx = isTimeout ? 0 : isCorrect ? 2 : 1;
    answerAmounts[amountIdx]++;
  });

  pointPercents[0].innerText =
    (100 * (answerAmounts[0] + answerAmounts[1])) / MAX_ROUND + "%";
  pointPercents[1].innerText = (100 * answerAmounts[2]) / MAX_ROUND + "%";
  pointsResult.forEach((point_ui, idx) => {
    point_ui.innerText = answerAmounts[idx];
  });
  btnReset.addEventListener("click", onReset);
  btnShowAnswers.addEventListener("click", onShowAnswers);
  resultZone.addEventListener("click", (event) => showResultZone(event));
}

function createInterval() {
  intervalId = setInterval(() => {
    timer--;
    timer_ui.innerText = timer + "s";
    checkTimer();
  }, 1000);
}

function generateQuiz() {
  firstNum = Math.ceil(Math.random() * distance);
  secondNum = Math.ceil(Math.random() * distance);
  const ranOpIdx = Math.floor(Math.random() * operations.length);
  const operation = operations[ranOpIdx]; // +
  const correctAnswer = calcQuiz(firstNum, secondNum, operation);
  const answers = generateAnswers(correctAnswer);
  const selectedIdx = null;
  const quiz = {
    firstNum,
    secondNum,
    operation,
    correctAnswer,
    answers,
    selectedIdx,
  };
  quizzes.push(quiz);
  quiz_round.innerText = `${quizzes.length}-round`;
  return quiz;
}

function nextQuiz() {
  if (quizzes.length !== MAX_ROUND) renderQuiz(generateQuiz());
}

function checkTimer() {
  if (timer === 0) {
    timer = MAX_TIME;
    timer_ui.innerText = timer + "s";
    renderPoint(classOfStatus[2]);
    nextQuiz();
    checkFinish();
  }
}

function checkFinish() {
  if (quizzes.length >= MAX_ROUND) {
    clearInterval(intervalId);
    showAllResult();
  }
}

// EVENT HANDLER FUNCTIONS
function onSelectAnswer({ target }) {
  const currentQuiz = quizzes[quizzes.length - 1]; // currentQuiz
  currentQuiz.selectedIdx = target.id;
  const isCorrect = currentQuiz.correctAnswer === +target.innerText;

  if (quizzes.length >= MAX_ROUND) {
    clearInterval(intervalId);
    showAllResult();
  }

  if (isCorrect) {
    timer += 5;
    timer_ui.innerText = timer + "s";
  }
  const classIdx = isCorrect ? 1 : 0;
  renderPoint(classOfStatus[classIdx]);

  nextQuiz();
}
function onReset() {
  toggleZone([degreeZone], [gameZone, resultZone]);
}

function onShowAnswers() {
  toggleZone([gameZone, btnNewGame], [resultZone, degreeZone]);

  answerPoints.forEach((item, idx) => {
    item.disabled = false;
    let showClickedPoint = item.innerText;
    item.addEventListener("click", () => {
      quiz_round.innerText = `${idx + 1}-round`;
      answers_ui.forEach(({ style }) => (style.background = "lightblue"));

      renderQuiz(quizzes[showClickedPoint - 1]);

      if (answers_ui[quizzes[showClickedPoint - 1].selectedIdx])
        answers_ui[quizzes[showClickedPoint - 1].selectedIdx].style.background =
          "red";

      for (let i = 0; i < 4; i++) {
        const { correctAnswer, answers } = quizzes[showClickedPoint - 1];
        if (answers[i] === correctAnswer)
          answers_ui[i].style.background = "#00B533";
      }
    });
  });

  btnNewGame.addEventListener("click", () => {
    answers_ui.forEach(({ style }) => (style.background = "lightblue"));
    onReset();
  });
}
// UI FUNCTIONS

function renderPoint(suffix) {
  const className = `point point--${suffix}`;
  const btn = document.createElement("button");
  btn.className = className;
  btn.innerText = quizzes.length;
  btn.disabled = true;

  if (quizzes.length != MAX_ROUND) {
    points_ui.appendChild(btn);
    answerPoints.push(btn);
  }
}

function renderQuiz(quiz) {
  const { operation, firstNum, secondNum, answers } = quiz;
  first_num.innerText = firstNum;
  second_num.innerText = secondNum;
  operation_ui.innerText = operation;

  answers_ui.forEach((answer_ui, idx) => {
    answer_ui.innerText = answers[idx];
    answer_ui.id = idx;
    answer_ui.addEventListener("click", onSelectAnswer);
  });
}

function initGameZone() {
  points_ui.innerHTML = "";
  quizzes = [];
  const firstQuiz = generateQuiz();
  renderQuiz(firstQuiz);
  createInterval();
}

function toggleZone(showZones = [], hideZones = [], callback) {
  if (showZones.length !== 0)
    showZones.forEach((zone) => zone.classList.remove("hide"));
  if (hideZones.length !== 0)
    hideZones.forEach((zone) => zone.classList.add("hide")); //  on hidden
  if (callback) callback();
}

function showResultZone(event) {
  event.stopPropagation();
  if (event.target.classList.contains("result-zone")) {
    resultZone.classList.add("hide");
  }
}

function initDegreeZone() {
  degreeButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      const {
        distance: _distance,
        maxTime,
        operations: _operations,
      } = rules[idx];
      distance = _distance;
      MAX_TIME = maxTime;
      operations = _operations;
      timer = MAX_TIME;
      timer_ui.innerText = `${timer}s`;

      toggleZone([gameZone], [degreeZone], initGameZone);
    });
  });
}

function init() {
  initDegreeZone();
}

init();
