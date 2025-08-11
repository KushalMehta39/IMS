let secretNumber = "";
let attempts = 0;
const maxAttempts = 10;
let gameStarted = false;

document.getElementById("startBtn").addEventListener("click", () => {
  const mode = document.getElementById("mode").value;
  secretNumber = generateNumber(mode);
  attempts = 0;
  gameStarted = true;

  document.getElementById("gameArea").style.display = "block";
  document.getElementById("feedback").textContent = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").focus();
});

document.getElementById("guessBtn").addEventListener("click", () => {
  if (!gameStarted) {
    alert("Please start the game first.");
    return;
  }

  const guess = document.getElementById("guessInput").value.trim();

  if (!/^\d{5}$/.test(guess)) {
    alert("Please enter a valid 5-digit number.");
    return;
  }

  attempts++;

  const { bulls, cows } = getBullsAndCows(secretNumber, guess);

  document.getElementById("feedback").textContent = `${bulls} Bulls, ${cows} Cows`;

  if (bulls === 5) {
    document.getElementById("feedback").textContent = `🎉 You win in ${attempts} attempts!`;
    gameStarted = false;
  } else if (attempts >= maxAttempts) {
    document.getElementById("feedback").textContent = `💀 Game over! The number was ${secretNumber}`;
    gameStarted = false;
  }

  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").focus();
});

function generateNumber(mode) {
  let digits = [];

  while (digits.length < 5) {
    const digit = Math.floor(Math.random() * 10);

    if (digits.length === 0 && digit === 0) continue; // No leading 0

    if (mode === "easy" && digits.includes(digit)) continue;

    digits.push(digit);
  }

  return digits.join("");
}

function getBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows = 0;

  const secretArr = secret.split("");
  const guessArr = guess.split("");

  const unmatchedSecret = [];
  const unmatchedGuess = [];

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      bulls++;
    } else {
      unmatchedSecret.push(secretArr[i]);
      unmatchedGuess.push(guessArr[i]);
    }
  }

  unmatchedGuess.forEach((digit) => {
    const index = unmatchedSecret.indexOf(digit);
    if (index !== -1) {
      cows++;
      unmatchedSecret.splice(index, 1); // remove matched digit
    }
  });

  return { bulls, cows };
}
