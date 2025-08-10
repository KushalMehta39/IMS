let secretNumber = "";
let attempts = 0;
const maxAttempts = 10;

document.getElementById("startBtn").addEventListener("click", () => {
  const mode = document.getElementById("mode").value;
  secretNumber = generateNumber(mode);
  attempts = 0;
  document.getElementById("gameArea").style.display = "block";
  document.getElementById("history").innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("guessInput").value = "";
});

document.getElementById("guessBtn").addEventListener("click", () => {
  const guess = document.getElementById("guessInput").value.trim();
  
  if (!/^\d{5}$/.test(guess)) {
    alert("Please enter a valid 5-digit number.");
    return;
  }

  attempts++;
  const { bulls, cows } = getBullsAndCows(secretNumber, guess);

  const entry = document.createElement("li");
  entry.textContent = `${guess} → ${bulls} Bulls, ${cows} Cows`;
  document.getElementById("history").appendChild(entry);

  if (bulls === 5) {
    document.getElementById("feedback").textContent = `🎉 You win in ${attempts} attempts!`;
  } else if (attempts >= maxAttempts) {
    document.getElementById("feedback").textContent = `💀 Game over! The number was ${secretNumber}`;
  }

  document.getElementById("guessInput").value = "";
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
