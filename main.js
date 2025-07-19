// Game state
let ropeCenter = 0; // 0 = center, negative = left, positive = right
const ropeThreshold = 200; // pixels from center to win
let player1Score = 0;
let player2Score = 0;
let player1Answered = false;
let player2Answered = false;
let player1Correct = false;
let player2Correct = false;
let player1Question = null;
let player2Question = null;
let winner = null;
let roundStartTime = 0;
let roundTimer = 8; // seconds
let roundActive = true;
let flashColor1 = null;
let flashColor2 = null;
let flashTimer1 = 0;
let flashTimer2 = 0;
let correctSound, wrongSound;

function generateQuestion() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
  let answer;
  if (op === '+') answer = a + b;
  else if (op === '-') answer = a - b;
  else answer = a * b;
  // Generate 3 wrong answers
  const choices = [answer];
  while (choices.length < 4) {
    let wrong = answer + Math.floor(Math.random() * 11) - 5;
    if (!choices.includes(wrong)) choices.push(wrong);
  }
  // Shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return { a, b, op, answer, choices };
}

function resetQuestions() {
  player1Question = generateQuestion();
  player2Question = generateQuestion();
  player1Answered = false;
  player2Answered = false;
  player1Correct = false;
  player2Correct = false;
  roundStartTime = performance.now();
  roundActive = true;
}

function checkWinner() {
  if (ropeCenter <= -ropeThreshold) winner = 'Player 1';
  if (ropeCenter >= ropeThreshold) winner = 'Player 2';
}

function applyForces() {
  if (!roundActive) return;
  if (player1Answered && player2Answered) {
    if (player1Correct && player2Correct) {
      // Both correct, but who was faster?
      if (player1Score < player2Score) ropeCenter -= 40;
      else if (player2Score < player1Score) ropeCenter += 40;
      else; // tie, no move
    } else if (player1Correct) {
      ropeCenter -= 60;
    } else if (player2Correct) {
      ropeCenter += 60;
    } else {
      // Both wrong, lose force
      ropeCenter += (Math.random() < 0.5 ? -1 : 1) * 30;
    }
    roundActive = false;
    setTimeout(resetQuestions, 1000);
  }
}

function checkTimer() {
  if (!roundActive) return;
  const elapsed = (performance.now() - roundStartTime) / 1000;
  if (elapsed >= roundTimer) {
    // Timer ran out
    roundActive = false;
    // Apply penalty: move rope slightly toward random side
    ropeCenter += (Math.random() < 0.5 ? -1 : 1) * 30;
    setTimeout(resetQuestions, 1000);
  }
}

function setupGame() {
  ropeCenter = 0;
  player1Score = 0;
  player2Score = 0;
  winner = null;
  resetQuestions();
}

function preload() {
  // correctSound = loadSound('src/correct.wav');
  // wrongSound = loadSound('src/wrong.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupGame();
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Tug of War Math!', 400, 40);
  // Draw timer
  if (roundActive) {
    const timeLeft = Math.max(
      0,
      roundTimer - (performance.now() - roundStartTime) / 1000
    ).toFixed(1);
    textSize(28);
    fill('orange');
    text(`Time Left: ${timeLeft}s`, 400, 90);
  }
  // Draw rope
  stroke(0);
  strokeWeight(8);
  line(400 + ropeCenter - 150, 300, 400 + ropeCenter + 150, 300);
  noStroke();
  fill('red');
  ellipse(400 + ropeCenter - 150, 300, 40, 40); // Player 1
  fill('blue');
  ellipse(400 + ropeCenter + 150, 300, 40, 40); // Player 2
  fill('black');
  ellipse(400 + ropeCenter, 300, 30, 30); // Center knot
  // Draw threshold lines
  stroke('green');
  strokeWeight(2);
  line(400 - ropeThreshold, 250, 400 - ropeThreshold, 350);
  line(400 + ropeThreshold, 250, 400 + ropeThreshold, 350);
  noStroke();
  // Show winner
  if (winner) {
    textSize(48);
    fill('green');
    text(`${winner} Wins!`, 400, 500);
    textSize(24);
    text('Press R to restart', 400, 540);
    return;
  }
  // Player 1 question
  textSize(20);
  fill('red');
  text(
    `Player 1: ${player1Question.a} ${player1Question.op} ${player1Question.b} = ?`,
    200,
    400
  );
  player1Question.choices.forEach((c, i) => {
    if (
      flashColor1 &&
      flashTimer1 > 0 &&
      i ===
        player1Question.choices.findIndex((x) => x === player1Question.selected)
    ) {
      fill(flashColor1);
    } else {
      fill('white');
    }
    rect(100, 430 + i * 40, 200, 30, 8);
    fill('black');
    text(c, 200, 445 + i * 40);
  });
  // Player 2 question
  fill('blue');
  text(
    `Player 2: ${player2Question.a} ${player2Question.op} ${player2Question.b} = ?`,
    600,
    400
  );
  player2Question.choices.forEach((c, i) => {
    if (
      flashColor2 &&
      flashTimer2 > 0 &&
      i ===
        player2Question.choices.findIndex((x) => x === player2Question.selected)
    ) {
      fill(flashColor2);
    } else {
      fill('white');
    }
    rect(500, 430 + i * 40, 200, 30, 8);
    fill('black');
    text(c, 600, 445 + i * 40);
  });
  // Handle flash timers
  if (flashTimer1 > 0) flashTimer1--;
  if (flashTimer2 > 0) flashTimer2--;
  if (flashTimer1 === 0) flashColor1 = null;
  if (flashTimer2 === 0) flashColor2 = null;
  checkTimer();
}

function mousePressed() {
  if (winner || !roundActive) return;
  // Player 1 area
  if (mouseX > 100 && mouseX < 300 && mouseY > 430 && mouseY < 590) {
    const idx = Math.floor((mouseY - 430) / 40);
    if (!player1Answered) {
      player1Answered = true;
      player1Question.selected = player1Question.choices[idx];
      player1Correct = player1Question.choices[idx] === player1Question.answer;
      player1Score = performance.now();
      if (player1Correct) {
        flashColor1 = 'lime';
        flashTimer1 = 20;
        if (correctSound) correctSound.play();
      } else {
        flashColor1 = 'red';
        flashTimer1 = 20;
        if (wrongSound) wrongSound.play();
      }
      applyForces();
      checkWinner();
    }
  }
  // Player 2 area
  if (mouseX > 500 && mouseX < 700 && mouseY > 430 && mouseY < 590) {
    const idx = Math.floor((mouseY - 430) / 40);
    if (!player2Answered) {
      player2Answered = true;
      player2Question.selected = player2Question.choices[idx];
      player2Correct = player2Question.choices[idx] === player2Question.answer;
      player2Score = performance.now();
      if (player2Correct) {
        flashColor2 = 'lime';
        flashTimer2 = 20;
        if (correctSound) correctSound.play();
      } else {
        flashColor2 = 'red';
        flashTimer2 = 20;
        if (wrongSound) wrongSound.play();
      }
      applyForces();
      checkWinner();
    }
  }
  if (player1Answered && player2Answered) applyForces();
}

function keyPressed() {
  if (winner && (key === 'r' || key === 'R')) {
    setupGame();
  }
}
