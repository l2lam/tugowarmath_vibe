// Math question generation and validation
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
