const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const newGameBtn = document.getElementById("newGame");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];
let isSinglePlayer = false;
let playerX = "Player X";
let playerO = "Player O";
let scores = { X: 0, O: 0 };

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function startGame(mode) {
  playerX = player1Input.value || "Player X";
  playerO = player2Input.value || "Player O";
  isSinglePlayer = mode === "single";
  document.getElementById("player2-label").style.display = isSinglePlayer ? "none" : "block";
  setupScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
  updateScoreboard();
}

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if (board[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);
  checkWinner();

  if (isSinglePlayer && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer === "X" ? playerX : playerO}'s Turn`;
}

function checkWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      const winnerName = board[a] === "X" ? playerX : playerO;
      scores[board[a]]++;
      popupMessage.textContent = `🎉 ${winnerName} Wins! 🎉`;
      popup.classList.remove("hidden");
      gameActive = false;
      updateScoreboard();
      return;
    }
  }

  if (!board.includes("")) {
    popupMessage.textContent = `😐 It's a Draw!`;
    popup.classList.remove("hidden");
    gameActive = false;
  }
}

function computerMove() {
  let available = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  if (available.length === 0) return;
  let randomIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(randomIndex, "O");
  checkWinner();
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = `${playerX}'s Turn`;
  cells.forEach(cell => cell.textContent = "");
  popup.classList.add("hidden");
}

function updateScoreboard() {
  scoreX.textContent = `${playerX}: ${scores.X}`;
  scoreO.textContent = `${playerO}: ${scores.O}`;
}

function closePopup() {
  popup.classList.add("hidden");
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", () => {
  setupScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  scores = { X: 0, O: 0 };
  updateScoreboard();
});
