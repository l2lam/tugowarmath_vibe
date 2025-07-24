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
  state.correctSound = loadSound('correct.wav');
  state.wrongSound = loadSound('wrong.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Set layout variables based on window size
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  setRopeCenter(centerX, centerY);
  setTimerTextPos(centerX, 90);
  setWinnerTextPos(centerX, centerY + 200);
  setRestartTextPos(centerX, centerY + 240);
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

function drawPlayerQuestion(
  player,
  color,
  question,
  flashColor,
  flashTimer,
  rectX,
  rectY,
  rectW,
  rectH,
  rectRadius,
  textX,
  textY,
  gap
) {
  textSize(20);
  fill(color);
  text(
    `${player}: ${question.a} ${question.op} ${question.b} = ?`,
    textX,
    rectY - 30
  );
  question.choices.forEach((c, i) => {
    if (
      flashColor &&
      flashTimer > 0 &&
      i === question.choices.findIndex((x) => x === question.selected)
    ) {
      fill(flashColor);
    } else {
      fill('white');
    }
    rect(rectX, rectY + i * gap, rectW, rectH, rectRadius);
    fill('black');
    text(c, textX, textY + i * gap);
  });
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Tug of War Math!', TITLE_TEXT_X, TITLE_TEXT_Y);

  if (!state.winner) {
    drawPauseButton(state.paused);
    if (state.paused) {
      textSize(36);
      fill('orange');
      text('Paused', PAUSE_TEXT_X, PAUSE_TEXT_Y);
      return;
    }
  }

  if (!state.winner) {
    drawTimer(state.roundActive, state.roundTimer, state.roundStartTime);
  }
  drawRope(state.ropeCenter);
  if (drawWinner(state.winner)) return;

  drawPlayerQuestion(
    'Player 1',
    'red',
    state.player1Question,
    state.flashColor1,
    state.flashTimer1,
    PLAYER1_CHOICE_RECT_X,
    PLAYER1_CHOICE_RECT_Y,
    PLAYER1_CHOICE_RECT_W,
    PLAYER1_CHOICE_RECT_H,
    PLAYER1_CHOICE_RECT_RADIUS,
    PLAYER1_CHOICE_TEXT_X,
    PLAYER1_CHOICE_TEXT_Y,
    PLAYER1_CHOICE_GAP
  );
  drawPlayerQuestion(
    'Player 2',
    'blue',
    state.player2Question,
    state.flashColor2,
    state.flashTimer2,
    PLAYER2_CHOICE_RECT_X,
    PLAYER2_CHOICE_RECT_Y,
    PLAYER2_CHOICE_RECT_W,
    PLAYER2_CHOICE_RECT_H,
    PLAYER2_CHOICE_RECT_RADIUS,
    PLAYER2_CHOICE_TEXT_X,
    PLAYER2_CHOICE_TEXT_Y,
    PLAYER2_CHOICE_GAP
  );

  // Handle flash timers
  if (state.flashTimer1 > 0) state.flashTimer1--;
  if (state.flashTimer2 > 0) state.flashTimer2--;
  if (state.flashTimer1 === 0) state.flashColor1 = null;
  if (state.flashTimer2 === 0) state.flashColor2 = null;
  if (!state.winner) {
    checkTimer(state, resetQuestions);
  }
}

function handlePauseButtonClick() {
  state.paused = !state.paused;
  // If resuming, reset roundStartTime to account for pause duration
  if (!state.paused && state.roundActive) {
    const elapsed = (performance.now() - state.roundStartTime) / 1000;
    state.roundStartTime = performance.now() - elapsed * 1000;
  }
}

function handlePlayerAnswer(player, x, y) {
  let rectX,
    rectW,
    rectY,
    areaY2,
    question,
    answered,
    correct,
    score,
    flashColor,
    flashTimer,
    correctSound,
    wrongSound,
    gap;
  if (player === 1) {
    rectX = PLAYER1_CHOICE_RECT_X;
    rectW = PLAYER1_CHOICE_RECT_W;
    rectY = PLAYER1_CHOICE_RECT_Y;
    areaY2 = PLAYER1_CHOICE_AREA_Y2;
    question = state.player1Question;
    answered = 'player1Answered';
    correct = 'player1Correct';
    score = 'player1Score';
    flashColor = 'flashColor1';
    flashTimer = 'flashTimer1';
    correctSound = 'correctSound';
    wrongSound = 'wrongSound';
    gap = PLAYER1_CHOICE_GAP;
  } else {
    rectX = PLAYER2_CHOICE_RECT_X;
    rectW = PLAYER2_CHOICE_RECT_W;
    rectY = PLAYER2_CHOICE_RECT_Y;
    areaY2 = PLAYER2_CHOICE_AREA_Y2;
    question = state.player2Question;
    answered = 'player2Answered';
    correct = 'player2Correct';
    score = 'player2Score';
    flashColor = 'flashColor2';
    flashTimer = 'flashTimer2';
    correctSound = 'correctSound';
    wrongSound = 'wrongSound';
    gap = PLAYER2_CHOICE_GAP;
  }
  if (x > rectX && x < rectX + rectW && y > rectY && y < areaY2) {
    const idx = Math.floor((y - rectY) / gap);
    if (idx >= 0 && idx < question.choices.length && !state[answered]) {
      state[answered] = true;
      question.selected = question.choices[idx];
      state[correct] = question.choices[idx] === question.answer;
      state[score] = performance.now();
      if (state[correct]) {
        state[flashColor] = 'lime';
        state[flashTimer] = 20;
        if (state[correctSound]) state[correctSound].play();
      } else {
        state[flashColor] = 'red';
        state[flashTimer] = 20;
        if (state[wrongSound]) state[wrongSound].play();
      }
      applyForces(state, resetQuestions);
      checkWinner(state);
    }
  }
}

function processInput(x, y) {
  // Pause/resume button area
  if (
    x > PAUSE_BTN_X &&
    x < PAUSE_BTN_X2 &&
    y > PAUSE_BTN_Y &&
    y < PAUSE_BTN_Y2
  ) {
    handlePauseButtonClick();
    return;
  }

  if (state.paused) return;
  if (state.winner || !state.roundActive) return;
  if (!state.player1Answered) handlePlayerAnswer(1, x, y);
  if (!state.player2Answered) handlePlayerAnswer(2, x, y);
  if (state.player1Answered && state.player2Answered)
    applyForces(state, resetQuestions);
}

function mousePressed() {
  processInput(mouseX, mouseY);
}

function touchStarted() {
  if (touches && touches.length > 0) {
    for (let i = 0; i < touches.length; i++) {
      processInput(touches[i].x, touches[i].y);
    }
  } else {
    processInput(mouseX, mouseY);
  }
  return false;
}

function keyPressed() {
  if (state.winner && (key === 'r' || key === 'R')) {
    setupGame(state, resetQuestions);
  }
}
