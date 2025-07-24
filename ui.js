// --- Walk cycle animation variables ---
let walkCycleImg;
const WALK_FRAME_COUNT = 8; // Adjust if your sprite sheet has a different number of frames
const WALK_FRAME_W = 1038 / 8 - 7; //64;    // Width of a single frame (adjust to your sprite sheet)
const WALK_FRAME_H = 298 / 2 + 15; //128;   // Height of a single frame (adjust to your sprite sheet)
let walkFrameIdx1 = 0;
let walkFrameIdx2 = 0;
let walkFrameTimer1 = 0;
let walkFrameTimer2 = 0;
const WALK_FRAME_SPEED = 7; // Lower is faster
const WALK_FRAME_W_OFFSET = 70;
const WALK_FRAME_H_OFFSET = 65;

// Call this in preload() in main.js
function preloadWalkCycle() {
  walkCycleImg = loadImage('walkcycle.png');
}

// Call this in setup() in main.js to reset animation
function resetWalkCycle() {
  walkFrameIdx1 = 0;
  walkFrameIdx2 = 0;
  walkFrameTimer1 = 0;
  walkFrameTimer2 = 0;
}

// Call this in draw() in main.js to update animation
function updateWalkCycle(player1Moving, player2Moving) {
  if (player1Moving) {
    walkFrameTimer1++;
    if (walkFrameTimer1 >= WALK_FRAME_SPEED) {
      walkFrameIdx1 = (walkFrameIdx1 - 1) % WALK_FRAME_COUNT;
      if (walkFrameIdx1 < 0) walkFrameIdx1 += WALK_FRAME_COUNT; // Ensure non-negative index
      walkFrameTimer1 = 0;
    }
  } else {
    walkFrameIdx1 = 0;
    walkFrameTimer1 = 0;
  }
  if (player2Moving) {
    walkFrameTimer2++;
    if (walkFrameTimer2 >= WALK_FRAME_SPEED) {
      walkFrameIdx2 = (walkFrameIdx2 - 1) % WALK_FRAME_COUNT;
      if (walkFrameIdx2 < 0) walkFrameIdx2 += WALK_FRAME_COUNT; // Ensure non-negative index
      walkFrameTimer2 = 0;
    }
  } else {
    walkFrameIdx2 = 0;
    walkFrameTimer2 = 0;
  }
}

// Draws the animated person at the given position, facing left or right
function drawWalker(x, y, facingLeft, frameIdx) {
  if (!walkCycleImg) return;
  push();
  translate(x, y);
  if (facingLeft) {
    scale(-0.5, 0.5);
    image(
      walkCycleImg,
      -WALK_FRAME_W / 2,
      -WALK_FRAME_H / 2,
      WALK_FRAME_W,
      WALK_FRAME_H,
      frameIdx * WALK_FRAME_W + WALK_FRAME_W_OFFSET,
      WALK_FRAME_H_OFFSET,
      WALK_FRAME_W,
      WALK_FRAME_H
    );
  } else {
    scale(0.5, 0.5);
    image(
      walkCycleImg,
      -WALK_FRAME_W / 2,
      -WALK_FRAME_H / 2,
      WALK_FRAME_W,
      WALK_FRAME_H,
      frameIdx * WALK_FRAME_W + WALK_FRAME_W_OFFSET,
      WALK_FRAME_H_OFFSET,
      WALK_FRAME_W,
      WALK_FRAME_H
    );
  }
  pop();
}
// UI rendering and event handling helpers for the tug-of-war game

let ROPE_X = 400;
let ROPE_Y = 300;

function setRopeCenter(x, y) {
  ROPE_X = x;
  ROPE_Y = y;
}
let ROPE_HALF_LENGTH = 150;
const PLAYER_RADIUS = WALK_FRAME_H / 2 + 15; // Adjusted to match the height of the walk cycle sprite
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
let WINNER_TEXT_X = 400;
let WINNER_TEXT_Y = 500;
let RESTART_TEXT_X = 400;
let RESTART_TEXT_Y = 540;

function setWinnerTextPos(x, y) {
  WINNER_TEXT_X = x;
  WINNER_TEXT_Y = y;
}

function setRestartTextPos(x, y) {
  RESTART_TEXT_X = x;
  RESTART_TEXT_Y = y;
}

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
  // Animate player 1 (left, facing right)
  drawWalker(
    ROPE_X + ropeCenter - ROPE_HALF_LENGTH,
    ROPE_Y + PLAYER_RADIUS / 2 - 50,
    false,
    walkFrameIdx1
  );
  // Animate player 2 (right, facing left)
  drawWalker(
    ROPE_X + ropeCenter + ROPE_HALF_LENGTH,
    ROPE_Y + PLAYER_RADIUS / 2 - 50,
    true,
    walkFrameIdx2
  );
  updateWalkCycle(true, true);
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
