let secretNumber = "";
let attempts = 0;
const maxAttempts = 10;
let gameMode = "easy";

const modeSelect = document.getElementById("mode");
const startBtn = document.getElementById("startBtn");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const changeModeBtn = document.getElementById("changeModeBtn");
const guessInput = document.getElementById("guessInput");
const feedbackElem = document.getElementById("feedback");
const progressBar = document.getElementById("progressBar");
const attemptsLeftElem = document.getElementById("attemptsLeft");
const gameArea = document.getElementById("gameArea");
const setupArea = document.getElementById("setupArea");
const guessCol1 = document.getElementById("guessCol1");
const guessCol2 = document.getElementById("guessCol2");

// Start Game
startBtn.addEventListener("click", () => {
  gameMode = modeSelect.value;
  secretNumber = generateNumber(gameMode);
  attempts = 0;
  resetGameUI();
  gameArea.style.display = "flex";
  setupArea.style.display = "none";
  guessInput.focus();
});

// Restart Game
restartBtn.addEventListener("click", () => {
  secretNumber = generateNumber(gameMode);
  attempts = 0;
  resetGameUI();
  guessInput.disabled = false;
  guessBtn.disabled = false;
  guessInput.focus();
});

// Change Mode mid-game
changeModeBtn.addEventListener("click", () => {
  gameMode = gameMode === "easy" ? "hard" : "easy";
  secretNumber = generateNumber(gameMode);
  attempts = 0;
  resetGameUI();
  guessInput.disabled = false;
  guessBtn.disabled = false;
  feedbackElem.textContent = `Mode changed to ${gameMode.toUpperCase()}`;
  feedbackElem.className = "";
  guessInput.focus();
});

guessBtn.addEventListener("click", handleGuess);
guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleGuess();
  }
});

function handleGuess() {
  const guess = guessInput.value.trim();
  if (!/^\d{5}$/.test(guess)) {
    alert("Please enter a valid 5-digit number.");
    return;
  }

  attempts++;
  const { bulls, cows } = getBullsAndCows(secretNumber, guess);
  updateAttempts();

  if (gameMode === "easy") {
    const entry = document.createElement("div");
    entry.textContent = `${guess} → 🐂 ${bulls}  🐄 ${cows}`;
    if (attempts <= 5) {
      guessCol1.appendChild(entry);
    } else {
      guessCol2.appendChild(entry);
    }
  }

  feedbackElem.textContent = `🐂 ${bulls} Bulls, 🐄 ${cows} Cows`;
  feedbackElem.className = ""; // remove previous animations

  if (bulls === 5) {
    feedbackElem.textContent = `🎉 You win in ${attempts} attempts!`;
    feedbackElem.classList.add("win-feedback");
    endGame();
  } else if (attempts >= maxAttempts) {
    feedbackElem.textContent = `💀 Game over! The number was ${secretNumber}`;
    feedbackElem.classList.add("lose-feedback");
    endGame();
  }

  guessInput.value = "";
  guessInput.focus();
}

function resetGameUI() {
  updateAttempts();
  progressBar.style.width = "100%";
  feedbackElem.textContent = "";
  feedbackElem.className = "";
  guessInput.value = "";
  guessCol1.innerHTML = "";
  guessCol2.innerHTML = "";
}

function endGame() {
  guessInput.disabled = true;
  guessBtn.disabled = true;
}

function generateNumber(mode) {
  let digits = [];
  while (digits.length < 5) {
    const digit = Math.floor(Math.random() * 10);
    if (digits.length === 0 && digit === 0) continue;
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
      unmatchedSecret.splice(index, 1);
    }
  });

  return { bulls, cows };
}

function updateAttempts() {
  const attemptsLeft = maxAttempts - attempts;
  attemptsLeftElem.textContent = `Attempts left: ${attemptsLeft}`;
  const progressPercent = (attemptsLeft / maxAttempts) * 100;
  progressBar.style.width = `${progressPercent}%`;

  if (progressPercent <= 30) {
    progressBar.style.backgroundColor = "#cc0000";
  } else if (progressPercent <= 60) {
    progressBar.style.backgroundColor = "#ffaa00";
  } else {
    progressBar.style.backgroundColor = "#008000";
  }
}
