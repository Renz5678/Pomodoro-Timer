let userChoice = ""; //will dictate the program
let accumulatedBreakMinutes = 0;
let longBreakCounter = 0;
let longBreakTime = 0;
let type = "";
let workTime = 0;
let breakTime = 0;
let isBreakTime = false; // Track if we're in break or work mode

const containerWrapper = document.getElementById("container-wrapper"); //main entry page container
const timerWrapper = document.getElementById("timer-wrapper"); //timer container
const continuePromptWrapper = document.getElementById("continue-prompt-wrapper"); //proceed with break or continue working container
const customTimerWrapper = document.getElementById("custom-timer-wrapper"); // make a custom timer container

const alarm = new Audio("alarm.mp3"); //alarm sound

//will show the info of the boxes
const questions = document.querySelectorAll(".choice-box .question");
questions.forEach(q => {
  q.addEventListener("mouseover", () => {
    const timerInfo = q.parentElement.querySelector(".timer-info");
    timerInfo.classList.toggle("hidden");
  });

  q.addEventListener("mouseleave", () => {
    const timerInfo = q.parentElement.querySelector(".timer-info");
    timerInfo.classList.toggle("hidden");
  })
});

//will listen to clicks to the choices
const choices = document.querySelectorAll(".choice-box");
choices.forEach(choice => {
  choice.addEventListener("click", (e) => {
    userChoice = choice.id;
    if (choice.id === "choice1") {
      console.log(userChoice)
      startProgram(userChoice);
    } else if (choice.id === "choice2") {
      startProgram(userChoice);
    } else if (choice.id === "choice3") {
      startProgram(userChoice);
    } else if (choice.id === "choice4") {
      customTimer();
    }
  });
});

//will be called once a box is pressed in the main entry page, will initialize timer based on the userChoice variable
function startProgram(userChoice) {
  containerWrapper.classList.toggle("hidden");
  timerWrapper.classList.toggle("hidden");

  switch (userChoice) {
    case "choice1":
      type = "Standard Pomodoro";
      workTime = 25;
      breakTime = 5;
      longBreakTime = 20;
      initializeTimer();
      break;

    case "choice2":
      type = "Extended Pomodoro";
      workTime = 50;
      breakTime = 15;
      longBreakTime = 30;
      initializeTimer();
      break;

    case "choice3":
      type = "Micro Pomodoro";
      workTime = 15;
      breakTime = 3;
      longBreakTime = 15;
      initializeTimer();
      break;
  }

  accumulatedBreakMinutes = breakTime;
}

//DOM variable that will be initialized for the timer
let classification = document.getElementById("classification");
let minutes = document.getElementById("minutes");
let seconds = document.getElementById("seconds");

//will ready the timer before starting it, different function tfo rthe startTimer function to be reused for break times
function initializeTimer() {
  continuePromptWrapper.classList.add("hidden");
  isBreakTime = false; // Reset to work mode

  const startBtn = document.getElementById("start-btn");
  startBtn.disabled = false;
  startBtn.classList.remove("disable");

  classification.innerHTML = type;
  minutes.innerHTML = workTime;
  seconds.innerHTML = "00";

  startBtn.onclick = () => {
    startTimer(workTime);
    startBtn.disabled = true;
    startBtn.classList.add("disable");
  };
}

//can be used both for working and break times
function startTimer(time) {
  // Only increment counter after work sessions, not breaks
  if (!isBreakTime) {
    longBreakCounter++;
  }
  
  let totalSeconds = time;
  let timer = setInterval(() => {
    totalSeconds--;

    let min = Math.floor(totalSeconds / 60);
    let sec = totalSeconds % 60;

    minutes.innerHTML = min;
    seconds.innerHTML = sec < 10 ? "0" + sec : sec;

    if (totalSeconds <= 0) {
      clearInterval(timer);
      endTimer();
    }
  }, 1000);
}

//will play once the timer reachaes 0
function endTimer() {
  alarm.play();
  // Check for long break only after work sessions
  if (longBreakCounter == 4 && !isBreakTime) {
    longBreak();
    return;
  }

  // If we just finished a break, go back to work
  if (isBreakTime) {
    accumulatedBreakMinutes = breakTime;

    let alertUser = alert("Break time is over!");
    if (alertUser === undefined) {
      alarm.pause();
      alarm.currentTime = 0;
    }
    isBreakTime = false;
    initializeTimer(); // Back to work
    return;
  }

  // If we just finished work, show break options
  continuePromptWrapper.classList.toggle("hidden");
  timerWrapper.classList.toggle("hidden");

  const breakTimer = document.getElementById("break");
  const continueTimer = document.getElementById("continue");
  const numOfB = document.getElementById("numberOfB");

  numOfB.innerHTML = `Total break-minutes u can consume: ${accumulatedBreakMinutes} minutes`;
  breakTimer.onclick = () => {
    breakTimeTimer();
    continuePromptWrapper.classList.toggle("hidden");
    timerWrapper.classList.toggle("hidden");
    alarm.pause();
    alarm.currentTime = 0;
  };

  continueTimer.onclick = () => {
    accumulatedBreakMinutes += breakTime;
    // Removed the breakTime += breakTime; line that was doubling break time
    initializeTimer();
    continuePromptWrapper.classList.add("hidden");
    timerWrapper.classList.remove("hidden");
    alarm.pause();
    alarm.currentTime = 0;
  };
}

//will show up when the user wants to create their own timer
function customTimer() {
  customTimerWrapper.classList.toggle("hidden");
  containerWrapper.classList.add("hidden");
  const close = document.getElementById("close");

  alert("LB means long breakkk ehehhehe");
  close.onclick = () => {
    location.reload();
  }

  const startCustom = document.getElementById("start-working");
  startCustom.onclick = () => {
    let workValue = document.getElementById("minutesWork").value;
    let breakValue = document.getElementById("minutesBreak").value;
    let LBValue = document.getElementById("longBreak").value;

    let workMins = parseInt(workValue);
    let breakMins = parseInt(breakValue);
    longBreakTime = parseInt(LBValue);

    if (isNaN(workMins) || isNaN(breakMins) || isNaN(longBreakTime) || breakMins <= 0 || workMins <= 0 || longBreakTime <= 0) {
      alert("Please put valid values!");
    } else {
      type = "Custom Timer";
      workTime = workMins;
      breakTime = breakMins;
      initializeTimer();
      customTimerWrapper.classList.toggle("hidden");
      timerWrapper.classList.toggle("hidden");
    }
  }
}

//will be called when the user wants to take a break
function breakTimeTimer() {
  isBreakTime = true; // Mark that we're in break mode
  
  const startBtn = document.getElementById("start-btn");
  startBtn.disabled = false;
  startBtn.classList.remove("disable");

  classification.innerHTML = "Break Time";
  minutes.innerHTML = accumulatedBreakMinutes;
  seconds.innerHTML = "00";

  startBtn.onclick = () => {
    startTimer(accumulatedBreakMinutes);
    startBtn.disabled = true;
    startBtn.classList.add("disable");
  };
}

//will bea called when the user uses their long break
function longBreak() {
  continuePromptWrapper.classList.add("hidden");
  timerWrapper.classList.remove("hidden");
  
    let alertUser = alert("Long Break Time!");
    if (alertUser === undefined) {
      alarm.pause();
      alarm.currentTime = 0;
    }

  isBreakTime = true; // Mark as break time
  
  classification.innerHTML = "Long Break";
  minutes.innerHTML = longBreakTime;
  seconds.innerHTML = "00";
  
  // Reset counter for next cycle
  longBreakCounter = 0;
  
  const startBtn = document.getElementById("start-btn");
  startBtn.disabled = false;
  startBtn.classList.remove("disable");

  startBtn.onclick = () => {
    startTimer(longBreakTime);
    startBtn.disabled = true;
    startBtn.classList.add("disable");
  };
}