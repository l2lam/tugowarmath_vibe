// UI rendering and event handling helpers for the tug-of-war game

let ROPE_X = 400;
let ROPE_Y = 300;

function setRopeCenter(x, y) {
  ROPE_X = x;
  ROPE_Y = y;
}
let ROPE_HALF_LENGTH = 150;
const PLAYER_RADIUS = 40;
const KNOT_RADIUS = 30;
const THRESHOLD_LINE_OFFSET1 = -50;
const THRESHOLD_LINE_OFFSET2 = 50;
const PAUSE_BTN_W = 120;
const PAUSE_BTN_H = 40;
const PAUSE_BTN_RADIUS = 10;
let PAUSE_BTN_TEXT_X = 760;
let PAUSE_BTN_TEXT_Y = 50;

function setPauseBtnTextPos(x, y) {
  PAUSE_BTN_TEXT_X = x;
  PAUSE_BTN_TEXT_Y = y;
}
let TIMER_TEXT_X = 400;
let TIMER_TEXT_Y = 90;

function setTimerTextPos(x, y) {
  TIMER_TEXT_X = x;
  TIMER_TEXT_Y = y;
}
const WINNER_TEXT_X = 400;
const WINNER_TEXT_Y = 500;
const RESTART_TEXT_X = 400;
const RESTART_TEXT_Y = 540;

function drawRope(ropeCenter) {
  stroke(0);
  strokeWeight(8);
  line(
    ROPE_X + ropeCenter - ROPE_HALF_LENGTH,
    ROPE_Y,
    ROPE_X + ropeCenter + ROPE_HALF_LENGTH,
    ROPE_Y
  );
  noStroke();
  fill('red');
  ellipse(
    ROPE_X + ropeCenter - ROPE_HALF_LENGTH,
    ROPE_Y,
    PLAYER_RADIUS,
    PLAYER_RADIUS
  ); // Player 1
  fill('blue');
  ellipse(
    ROPE_X + ropeCenter + ROPE_HALF_LENGTH,
    ROPE_Y,
    PLAYER_RADIUS,
    PLAYER_RADIUS
  ); // Player 2
  fill('black');
  ellipse(ROPE_X + ropeCenter, ROPE_Y, KNOT_RADIUS, KNOT_RADIUS); // Center knot
  // Draw threshold lines
  stroke('green');
  strokeWeight(2);
  line(
    ROPE_X - ropeThreshold,
    ROPE_Y + THRESHOLD_LINE_OFFSET1,
    ROPE_X - ropeThreshold,
    ROPE_Y + THRESHOLD_LINE_OFFSET2
  );
  line(
    ROPE_X + ropeThreshold,
    ROPE_Y + THRESHOLD_LINE_OFFSET1,
    ROPE_X + ropeThreshold,
    ROPE_Y + THRESHOLD_LINE_OFFSET2
  );
  noStroke();
}

function drawPauseButton(paused) {
  textSize(20);
  fill(paused ? 'orange' : 'lightgreen');
  rect(PAUSE_BTN_X, PAUSE_BTN_Y, PAUSE_BTN_W, PAUSE_BTN_H, PAUSE_BTN_RADIUS);
  fill('black');
  textAlign(CENTER, CENTER);
  text(
    paused ? 'Resume' : 'Pause',
    PAUSE_BTN_X + PAUSE_BTN_W / 2,
    PAUSE_BTN_Y + PAUSE_BTN_H / 2
  );
}

function drawTimer(roundActive, roundTimer, roundStartTime) {
  if (roundActive) {
    const timeLeft = Math.max(
      0,
      roundTimer - (performance.now() - roundStartTime) / 1000
    ).toFixed(1);
    textSize(28);
    fill('orange');
    text(`Time Left: ${timeLeft}s`, TIMER_TEXT_X, TIMER_TEXT_Y);
  }
}

function drawWinner(winner) {
  if (winner) {
    textSize(48);
    fill('green');
    text(`${winner} Wins!`, WINNER_TEXT_X, WINNER_TEXT_Y);
    textSize(24);
    text('Press R to restart', RESTART_TEXT_X, RESTART_TEXT_Y);
    return true;
  }
  return false;
}
