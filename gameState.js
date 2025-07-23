// Game state and logic

const ropeThreshold = 200; // pixels from center to win

function getInitialState() {
  return {
    ropeCenter: 0,
    player1Score: 0,
    player2Score: 0,
    player1Answered: false,
    player2Answered: false,
    player1Correct: false,
    player2Correct: false,
    player1Question: generateQuestion(),
    player2Question: generateQuestion(),
    winner: null,
    roundStartTime: performance.now(),
    roundTimer: 8,
    roundActive: true,
    flashColor1: null,
    flashColor2: null,
    flashTimer1: 0,
    flashTimer2: 0,
    correctSound: undefined,
    wrongSound: undefined,
    paused: false,
  };
}

function resetQuestions(state) {
  state.player1Question = generateQuestion();
  state.player2Question = generateQuestion();
  state.player1Answered = false;
  state.player2Answered = false;
  state.player1Correct = false;
  state.player2Correct = false;
  state.roundStartTime = performance.now();
  state.roundActive = true;
}

function checkWinner(state) {
  if (state.ropeCenter <= -ropeThreshold) state.winner = 'Player 1';
  if (state.ropeCenter >= ropeThreshold) state.winner = 'Player 2';
}

function applyForces(state, resetQuestionsCb) {
  if (!state.roundActive) return;
  if (state.player1Answered && state.player2Answered) {
    if (state.player1Correct && state.player2Correct) {
      if (state.player1Score < state.player2Score) state.ropeCenter -= 40;
      else if (state.player2Score < state.player1Score) state.ropeCenter += 40;
    } else if (state.player1Correct) {
      state.ropeCenter -= 60;
    } else if (state.player2Correct) {
      state.ropeCenter += 60;
    } else {
      state.ropeCenter += (Math.random() < 0.5 ? -1 : 1) * 30;
    }
    state.roundActive = false;
    setTimeout(() => resetQuestionsCb(state), 1000);
  }
}

function checkTimer(state, resetQuestionsCb) {
  if (!state.roundActive) return;
  const elapsed = (performance.now() - state.roundStartTime) / 1000;
  if (elapsed >= state.roundTimer) {
    state.roundActive = false;
    state.ropeCenter += (Math.random() < 0.5 ? -1 : 1) * 30;
    setTimeout(() => resetQuestionsCb(state), 1000);
  }
}

function setupGame(state, resetQuestionsCb) {
  state.ropeCenter = 0;
  state.player1Score = 0;
  state.player2Score = 0;
  state.winner = null;
  resetQuestionsCb(state);
}
