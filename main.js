// The following imports have been removed as all functions are now global.
// 'state' is declared only once below.

// UI and game layout variables (set in setup)
let TITLE_TEXT_X, TITLE_TEXT_Y;
let PAUSE_TEXT_X, PAUSE_TEXT_Y;
let PLAYER1_QUESTION_X, PLAYER1_QUESTION_Y;
let PLAYER1_CHOICE_RECT_X,
  PLAYER1_CHOICE_RECT_Y,
  PLAYER1_CHOICE_RECT_W,
  PLAYER1_CHOICE_RECT_H,
  PLAYER1_CHOICE_RECT_RADIUS;
let PLAYER1_CHOICE_TEXT_X,
  PLAYER1_CHOICE_TEXT_Y,
  PLAYER1_CHOICE_GAP,
  PLAYER1_CHOICE_AREA_Y2;
let PLAYER2_QUESTION_X, PLAYER2_QUESTION_Y;
let PLAYER2_CHOICE_RECT_X,
  PLAYER2_CHOICE_RECT_Y,
  PLAYER2_CHOICE_RECT_W,
  PLAYER2_CHOICE_RECT_H,
  PLAYER2_CHOICE_RECT_RADIUS;
let PLAYER2_CHOICE_TEXT_X,
  PLAYER2_CHOICE_TEXT_Y,
  PLAYER2_CHOICE_GAP,
  PLAYER2_CHOICE_AREA_Y2;
let PAUSE_BTN_X, PAUSE_BTN_X2, PAUSE_BTN_Y, PAUSE_BTN_Y2;

let state = getInitialState();

function preload() {
  // state.correctSound = loadSound('src/correct.wav');
  // state.wrongSound = loadSound('src/wrong.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Set layout variables based on window size
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  setRopeCenter(centerX, centerY);
  setTimerTextPos(centerX, 90);
  TITLE_TEXT_X = centerX;
  TITLE_TEXT_Y = 40;
  PAUSE_TEXT_X = centerX;
  PAUSE_TEXT_Y = centerY - 50;
  PLAYER1_QUESTION_X = centerX - 200;
  PLAYER1_QUESTION_Y = centerY + 100;
  PLAYER1_CHOICE_RECT_X = centerX - 300;
  PLAYER1_CHOICE_RECT_Y = centerY + 130;
  PLAYER1_CHOICE_RECT_W = 200;
  PLAYER1_CHOICE_RECT_H = 30;
  PLAYER1_CHOICE_RECT_RADIUS = 8;
  PLAYER1_CHOICE_TEXT_X = centerX - 200;
  PLAYER1_CHOICE_TEXT_Y = centerY + 145;
  PLAYER1_CHOICE_GAP = 40;
  PLAYER1_CHOICE_AREA_Y2 = PLAYER1_CHOICE_RECT_Y + 4 * PLAYER1_CHOICE_GAP;
  PLAYER2_QUESTION_X = centerX + 200;
  PLAYER2_QUESTION_Y = centerY + 100;
  PLAYER2_CHOICE_RECT_X = centerX + 100;
  PLAYER2_CHOICE_RECT_Y = centerY + 130;
  PLAYER2_CHOICE_RECT_W = 200;
  PLAYER2_CHOICE_RECT_H = 30;
  PLAYER2_CHOICE_RECT_RADIUS = 8;
  PLAYER2_CHOICE_TEXT_X = centerX + 200;
  PLAYER2_CHOICE_TEXT_Y = centerY + 145;
  PLAYER2_CHOICE_GAP = 40;
  PLAYER2_CHOICE_AREA_Y2 = PLAYER2_CHOICE_RECT_Y + 4 * PLAYER2_CHOICE_GAP;
  // Move pause button below timer
  PAUSE_BTN_X = centerX - 60;
  PAUSE_BTN_X2 = PAUSE_BTN_X + 120;
  PAUSE_BTN_Y = 110;
  PAUSE_BTN_Y2 = PAUSE_BTN_Y + 40;
  setupGame(state, resetQuestions);
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Tug of War Math!', TITLE_TEXT_X, TITLE_TEXT_Y);

  drawPauseButton(state.paused);
  if (state.paused) {
    textSize(36);
    fill('orange');
    text('Paused', PAUSE_TEXT_X, PAUSE_TEXT_Y);
    return;
  }

  drawTimer(state.roundActive, state.roundTimer, state.roundStartTime);
  drawRope(state.ropeCenter);
  if (drawWinner(state.winner)) return;

  // Player 1 question
  textSize(20);
  fill('red');
  text(
    `Player 1: ${state.player1Question.a} ${state.player1Question.op} ${state.player1Question.b} = ?`,
    PLAYER1_QUESTION_X,
    PLAYER1_QUESTION_Y
  );
  state.player1Question.choices.forEach((c, i) => {
    if (
      state.flashColor1 &&
      state.flashTimer1 > 0 &&
      i ===
        state.player1Question.choices.findIndex(
          (x) => x === state.player1Question.selected
        )
    ) {
      fill(state.flashColor1);
    } else {
      fill('white');
    }
    rect(
      PLAYER1_CHOICE_RECT_X,
      PLAYER1_CHOICE_RECT_Y + i * PLAYER1_CHOICE_GAP,
      PLAYER1_CHOICE_RECT_W,
      PLAYER1_CHOICE_RECT_H,
      PLAYER1_CHOICE_RECT_RADIUS
    );
    fill('black');
    text(
      c,
      PLAYER1_CHOICE_TEXT_X,
      PLAYER1_CHOICE_TEXT_Y + i * PLAYER1_CHOICE_GAP
    );
  });
  // Player 2 question
  fill('blue');
  text(
    `Player 2: ${state.player2Question.a} ${state.player2Question.op} ${state.player2Question.b} = ?`,
    PLAYER2_QUESTION_X,
    PLAYER2_QUESTION_Y
  );
  state.player2Question.choices.forEach((c, i) => {
    if (
      state.flashColor2 &&
      state.flashTimer2 > 0 &&
      i ===
        state.player2Question.choices.findIndex(
          (x) => x === state.player2Question.selected
        )
    ) {
      fill(state.flashColor2);
    } else {
      fill('white');
    }
    rect(
      PLAYER2_CHOICE_RECT_X,
      PLAYER2_CHOICE_RECT_Y + i * PLAYER2_CHOICE_GAP,
      PLAYER2_CHOICE_RECT_W,
      PLAYER2_CHOICE_RECT_H,
      PLAYER2_CHOICE_RECT_RADIUS
    );
    fill('black');
    text(
      c,
      PLAYER2_CHOICE_TEXT_X,
      PLAYER2_CHOICE_TEXT_Y + i * PLAYER2_CHOICE_GAP
    );
  });
  // Handle flash timers
  if (state.flashTimer1 > 0) state.flashTimer1--;
  if (state.flashTimer2 > 0) state.flashTimer2--;
  if (state.flashTimer1 === 0) state.flashColor1 = null;
  if (state.flashTimer2 === 0) state.flashColor2 = null;
  checkTimer(state, resetQuestions);
}

function mousePressed() {
  // Pause/resume button area
  if (
    mouseX > PAUSE_BTN_X &&
    mouseX < PAUSE_BTN_X2 &&
    mouseY > PAUSE_BTN_Y &&
    mouseY < PAUSE_BTN_Y2
  ) {
    state.paused = !state.paused;
    // If resuming, reset roundStartTime to account for pause duration
    if (!state.paused && state.roundActive) {
      const elapsed = (performance.now() - state.roundStartTime) / 1000;
      state.roundStartTime = performance.now() - elapsed * 1000;
    }
    return;
  }

  if (state.paused) return;
  if (state.winner || !state.roundActive) return;
  // Player 1 area
  if (
    mouseX > PLAYER1_CHOICE_RECT_X &&
    mouseX < PLAYER1_CHOICE_RECT_X + PLAYER1_CHOICE_RECT_W &&
    mouseY > PLAYER1_CHOICE_RECT_Y &&
    mouseY < PLAYER1_CHOICE_AREA_Y2
  ) {
    const idx = Math.floor((mouseY - 430) / 40);
    if (!state.player1Answered) {
      state.player1Answered = true;
      state.player1Question.selected = state.player1Question.choices[idx];
      state.player1Correct =
        state.player1Question.choices[idx] === state.player1Question.answer;
      state.player1Score = performance.now();
      if (state.player1Correct) {
        state.flashColor1 = 'lime';
        state.flashTimer1 = 20;
        if (state.correctSound) state.correctSound.play();
      } else {
        state.flashColor1 = 'red';
        state.flashTimer1 = 20;
        if (state.wrongSound) state.wrongSound.play();
      }
      applyForces(state, resetQuestions);
      checkWinner(state);
    }
  }
  // Player 2 area
  if (
    mouseX > PLAYER2_CHOICE_RECT_X &&
    mouseX < PLAYER2_CHOICE_RECT_X + PLAYER2_CHOICE_RECT_W &&
    mouseY > PLAYER2_CHOICE_RECT_Y &&
    mouseY < PLAYER2_CHOICE_AREA_Y2
  ) {
    const idx = Math.floor((mouseY - 430) / 40);
    if (!state.player2Answered) {
      state.player2Answered = true;
      state.player2Question.selected = state.player2Question.choices[idx];
      state.player2Correct =
        state.player2Question.choices[idx] === state.player2Question.answer;
      state.player2Score = performance.now();
      if (state.player2Correct) {
        state.flashColor2 = 'lime';
        state.flashTimer2 = 20;
        if (state.correctSound) state.correctSound.play();
      } else {
        state.flashColor2 = 'red';
        state.flashTimer2 = 20;
        if (state.wrongSound) state.wrongSound.play();
      }
      applyForces(state, resetQuestions);
      checkWinner(state);
    }
  }
  if (state.player1Answered && state.player2Answered)
    applyForces(state, resetQuestions);
}

function keyPressed() {
  if (state.winner && (key === 'r' || key === 'R')) {
    setupGame(state, resetQuestions);
  }
}
