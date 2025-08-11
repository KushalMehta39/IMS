let secretNumber = "";
let attempts = 0;
const maxAttempts = 10;
let gameStarted = false;

const modeSelect = document.getElementById("mode");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const feedbackElem = document.getElementById("feedback");
const attemptsLeftElem = document.getElementById("attemptsLeft");
const attemptsProgressElem = document.getElementById("attemptsProgress");
const retryBtn = document.getElementById("retryBtn");

// Generate secret number based on mode
function generateNumber(mode) {
  let digits = [];
  while (digits.length < 5) {
    const digit = Math.floor(Math.random() * 10);
    if (digits.length === 0 && digit === 0) continue; // No leading zero
    if (mode === "easy" && digits.includes(digit)) continue;
    digits.push(digit);
  }
  return digits.join("");
}

// Calculate bulls and cows
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

// Update UI for attempts left
function updateAttemptsUI() {
  const attemptsLeft = maxAttempts - attempts;
  attemptsLeftElem.textContent = attemptsLeft;
  const percent = (attemptsLeft / maxAttempts) * 100;
  attemptsProgressElem.style.width = percent + "%";
}

// End the game — disable inputs, show retry
function endGame(win = false) {
  gameStarted = false;
  guessInput.disabled = true;
  guessBtn.disabled = true;
  retryBtn.style.display = "block";

  if (win) {
    feedbackElem.classList.add("win");
    feedbackElem.classList.remove("lose");
  } else {
    feedbackElem.classList.add("lose");
    feedbackElem.classList.remove("win");
  }
}

// Start a new game
startBtn.addEventListener("click", () => {
  secretNumber = generateNumber(modeSelect.value);
  attempts = 0;
  gameStarted = true;

  gameArea.style.display = "block";
  feedbackElem.textContent = "";
  feedbackElem.className = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  retryBtn.style.display = "none";
  guessInput.value = "";
  guessInput.focus();

  updateAttemptsUI();
});

// Handle guess button and Enter key press
function makeGuess() {
  if (!gameStarted) {
    alert("Please start the game first.");
    return;
  }

  const guess = guessInput.value.trim();

  if (!/^\d{5}$/.test(guess)) {
    alert("Please enter a valid 5-digit number.");
    return;
  }

  attempts++;

  const { bulls, cows } = getBullsAndCows(secretNumber, guess);

  feedbackElem.textContent = `${bulls} Bulls, ${cows} Cows`;
  feedbackElem.className = "";

  updateAttemptsUI();

  if (bulls === 5) {
    feedbackElem.textContent = `🎉 You win in ${attempts} attempts!`;
    endGame(true);
  } else if (attempts >= maxAttempts) {
    feedbackElem.textContent = `💀 Game over! The number was ${secretNumber}`;
    endGame(false);
  }

  guessInput.value = "";
  guessInput.focus();
}

guessBtn.addEventListener("click", makeGuess);

guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    makeGuess();
  }
});

retryBtn.addEventListener("click", () => {
  retryBtn.style.display = "none";
  feedbackElem.textContent = "";
  feedbackElem.className = "";
  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  guessInput.focus();

  attempts = 0;
  updateAttemptsUI();

  gameArea.style.display = "none";
  gameStarted = false;
});
