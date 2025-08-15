let solutionBoard = [];
let puzzleBoard = [];
let timerInterval;
let secondsElapsed = 0;
let notesMode = false;

function generateSudoku(difficulty = "medium") {
  stopTimer();
  secondsElapsed = 0;
  updateTimer();
  startTimer();
  solutionBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(solutionBoard);
  puzzleBoard = JSON.parse(JSON.stringify(solutionBoard));
  let removeCount = difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 55;
  removeCells(puzzleBoard, removeCount);
  renderBoard(puzzleBoard);
}

function fillBoard(board) {
  let empty = findEmpty(board);
  if (!empty) return true;
  let [row, col] = empty;
  let numbers = [1,2,3,4,5,6,7,8,9];
  shuffle(numbers);
  for (let num of numbers) {
    if (isValid(board, num, row, col)) {
      board[row][col] = num;
      if (fillBoard(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

function removeCells(board, count) {
  while (count > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      count--;
    }
  }
}

function findEmpty(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
}

function isValid(board, num, row, col) {
  if (board[row].includes(num)) return false;
  if (board.some(r => r[col] === num)) return false;
  let boxRow = Math.floor(row / 3) * 3;
  let boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function renderBoard(board) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cellWrapper = document.createElement("div");
      cellWrapper.classList.add("cell");
      const cell = document.createElement("input");
      cell.maxLength = 1;
      if (board[r][c] !== 0) {
        cell.value = board[r][c];
        cell.disabled = true;
      }
      cell.addEventListener("input", () => {
        if (notesMode && cell.value !== "") {
          addNote(cell, cell.value);
          cell.value = "";
        } else {
          checkError(cell, r, c);
        }
      });
      cellWrapper.appendChild(cell);
      boardDiv.appendChild(cellWrapper);
    }
  }
}

function checkError(cell, row, col) {
  if (parseInt(cell.value) !== solutionBoard[row][col]) {
    cell.classList.add("error");
  } else {
    cell.classList.remove("error");
  }
}

function toggleNotes() {
  notesMode = !notesMode;
  alert(notesMode ? "Notizenmodus aktiviert" : "Notizenmodus deaktiviert");
}

function addNote(cell, note) {
  let notesDiv = cell.parentElement.querySelector(".notes");
  if (!notesDiv) {
    notesDiv = document.createElement("div");
    notesDiv.classList.add("notes");
    cell.parentElement.appendChild(notesDiv);
  }
  if (!notesDiv.innerText.includes(note)) {
    notesDiv.innerText += note + " ";
  }
}

function giveHint() {
  const cells = document.querySelectorAll("#board input");
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let idx = r * 9 + c;
      if (cells[idx].value === "" || cells[idx].classList.contains("error")) {
        cells[idx].value = solutionBoard[r][c];
        cells[idx].classList.remove("error");
        return;
      }
    }
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
  const seconds = String(secondsElapsed % 60).padStart(2, "0");
  document.getElementById("timer").innerText = `${minutes}:${seconds}`;
}

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
  generateSudoku("medium");
});
