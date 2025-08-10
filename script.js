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
});

document.getElementById("guessBtn").addEventListener("click", () => {
  const guess = document.getElementById("guessInput").value;
  if (!/^\d{5}$/.test(guess)) {
    alert("Please enter a valid 5-digit number.");
    return;
  }
  attempts++;
  const { bulls, cows } = getBullsAndCows(secretNumber, guess);
  document.getElementById("history").innerHTML += `<li>${guess} → ${bulls} Bulls, ${cows} Cows</li>`;
  if (bulls === 5) {
    document.getElementById("feedback").textContent = `You win in ${attempts} attempts!`;
  } else if (attempts >= maxAttempts) {
    document.getElementById("feedback").textContent = `Game over! Number was ${secretNumber}`;
  }
});

function generateNumber(mode) {
  let digits = [];
  while (digits.length < 5) {
    const digit = Math.floor(Math.random() * 10);
    if (mode === "easy" && digits.includes(digit)) continue;
    if (digits.length === 0 && digit === 0) continue;
    digits.push(digit);
  }
  return digits.join("");
}

function getBullsAndCows(secret, guess) {
  let bulls = 0, cows = 0;
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      bulls++;
    } else if (secret.includes(guess[i])) {
      cows++;
    }
  }
  return { bulls, cows };
}