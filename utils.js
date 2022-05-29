// Named export
// import {generateAnswer}  from "utils.js"
export function generateAnswer(corAnswer) {
  let point = 20;
  let distance = Math.floor(Math.random() * (2 * point + 1)) - point; // [-20,20]
  return corAnswer + distance;
}

// default export
// import anyName from "utils.js"

export function calcQuiz(firstNum, secondNum, operation) {
  switch (operation) {
    case "+":
      return firstNum + secondNum;
    case "-":
      return firstNum - secondNum;
    case "*":
      return firstNum * secondNum;
  }
}

function generateNum(num, distance = 0) {}
