let secretNumber = "";
let attempts = 0;
const maxAttempts = 10;

const modeSelect = document.getElementById("mode");
const startBtn = document.getElementById("startBtn");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const guessInput = document.getElementById("guessInput");
const feedbackElem = document.getElementById("feedback");
const progressBar = document.getElementById("progressBar");
const attemptsLeftElem = document.getElementById("attemptsLeft");
const gameArea = document.getElementById("gameArea");
const setupArea = document.getElementById("setupArea");

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
      unmatchedSecret.splice(index, 1);
    }
  });

  return { bulls, cows };
}

function updateProgress() {
  const widthPercent = ((maxAttempts - attempts) / maxAttempts) * 100;
  progressBar.style.width = widthPercent + "%";

  attemptsLeftElem.textContent = `Attempts left: ${maxAttempts - attempts}`;
}

function resetUI() {
  feedbackElem.textContent = "";
  feedbackElem.classList.remove("win-feedback", "lose-feedback");
  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  updateProgress();
  guessInput.focus();
}

function startGame() {
  const mode = modeSelect.value;
  secretNumber = generateNumber(mode);
  attempts = 0;
  resetUI();

  setupArea.style.display = "none";
  gameArea.style.display = "flex";
  restartBtn.style.display = "block";
}

function endGame(win) {
  guessInput.disabled = true;
  guessBtn.disabled = true;

  if (win) {
    feedbackElem.textContent = `🎉 You win in ${attempts} attempt${attempts > 1 ? "s" : ""}!`;
    feedbackElem.classList.add("win-feedback");
  } else {
    feedbackElem.textContent = `💀 Game over! The number was ${secretNumber}`;
    feedbackElem.classList.add("lose-feedback");
  }
}

function makeGuess() {
  const guess = guessInput.value.trim();

  if (!/^\d{5}$/.test(guess)) {
    alert("Please enter a valid 5-digit number.");
    return;
  }

  attempts++;

  const { bulls, cows } = getBullsAndCows(secretNumber, guess);

  feedbackElem.textContent = `🐂 ${bulls} Bull${bulls !== 1 ? "s" : ""}, 🐄 ${cows} Cow${cows !== 1 ? "s" : ""}`;
  updateProgress();

  if (bulls === 5) {
    endGame(true);
  } else if (attempts >= maxAttempts) {
    endGame(false);
  } else {
    guessInput.value = "";
    guessInput.focus();
  }
}

// Event listeners
startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
  attempts = 0;
  resetUI();
  startGame();
});

guessBtn.addEventListener("click", makeGuess);

guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "ArrowRight") {
    e.preventDefault();
    makeGuess();
  }
});
