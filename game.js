let board = [];
let solution = [];
let selectedTile = null;
let selectedNumber = null;
let paused = true;
let timer = 0;
let timerInterval = null;
let hints = 6;
let errors = 0;
let numberCount = {};
let gameOver = false;

const difficultySettings = {
  easy: [5, 6],
  medium: [4, 5],
  hard: [1, 3]
};

window.onload = () => {
  createDigits();
  newGame();
  document.getElementById("startBtn").onclick = startGame;
  document.getElementById("newGameBtn").onclick = newGame;
  document.getElementById("pauseBtn").onclick = togglePause;
  document.getElementById("hintBtn").onclick = giveHint;
  document.getElementById("darkModeBtn").onclick = () =>
    document.body.classList.toggle("dark");
};

function startGame() {
  if (!paused) return;
  paused = false;
  document.getElementById("pause-overlay").style.display = "none";
  timerInterval = setInterval(() => {
    timer++;
    updateTimer();
  }, 1000);
  if (timerInterval) clearInterval(timerInterval);

timerInterval = setInterval(() => {
  if (!paused && !gameOver) {
    timer++;
    updateTimer();
  }
}, 1000);
}

function togglePause() {
  paused = !paused;
  document.getElementById("pause-overlay").style.display =
    paused ? "flex" : "none";
}

function newGame() {
  clearInterval(timerInterval);
  timer = 0;
  errors = 0;
  hints = 6;
  paused = true;
  updateTimer();
  gameOver = false;
  document.getElementById("errors").innerText = errors;
  document.getElementById("hints").innerText = hints;
  document.getElementById("pause-overlay").style.display = "flex";
  generateSudoku();
  numberCount = {};
for (let i = 1; i <= 9; i++) numberCount[i] = 0;
}

function createDigits() {
  const digits = document.getElementById("digits");
  digits.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
    let d = document.createElement("div");
    d.innerText = i;
    d.className = "number";
    d.onclick = () => {
  selectedNumber = i;
  highlightSameNumbers(i);
};
    digits.appendChild(d);
  }
}

function generateSudoku() {
  solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(solution);
  board = solution.map(r => r.slice());
  removeNumbers();
  drawBoard();
}

function fillBoard(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        let nums = shuffle([1,2,3,4,5,6,7,8,9]);
        for (let n of nums) {
          if (isValid(grid, r, c, n)) {
            grid[r][c] = n;
            if (fillBoard(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function highlightSameNumbers(num) {
  document.querySelectorAll(".tile").forEach(tile => {
    tile.classList.remove("same-number");
    if (tile.innerText == num) {
      tile.classList.add("same-number");
    }
  });
}

function removeNumbers() {
  const diff = document.getElementById("difficulty").value;
  const [min, max] = difficultySettings[diff];

  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      let cells = [];
      for (let r = br * 3; r < br * 3 + 3; r++)
        for (let c = bc * 3; c < bc * 3 + 3; c++)
          cells.push([r, c]);

      cells = shuffle(cells);
      let keep = rand(min, max);
      for (let i = keep; i < 9; i++) {
        let [r, c] = cells[i];
        board[r][c] = "";
      }
    }
  }
}

function drawBoard() {
  const b = document.getElementById("board");
  b.innerHTML = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.className = "tile";
      tile.innerText = board[r][c];
      if (board[r][c] !== "") tile.classList.add("locked");
      tile.onclick = () => handleTile(tile, r, c);
      b.appendChild(tile);
      updateNumberCounts();
    }
  }
}

function handleTile(tile, r, c) {
  if (paused || tile.classList.contains("locked")) return;
  if (!selectedNumber) return;
  // Right-click or backspace erase
tile.oncontextmenu = e => {
  e.preventDefault();
  if (tile.classList.contains("locked") && !paused) {
    tile.innerText = "";
    tile.classList.remove("locked");
    updateNumberCounts();
    checkWin();
  }
};

  if (solution[r][c] === selectedNumber) {
     tile.innerText = selectedNumber;
     tile.classList.add("locked");
      updateNumberCounts();
  } else {
    errors++;
    document.getElementById("errors").innerText = errors;
  }
  updateNumberCounts();
  highlightSameNumbers(selectedNumber);
}

function giveHint() {
  if (paused || hints <= 0) return;

  const emptyCells = [];

  document.querySelectorAll(".tile").forEach((tile, index) => {
    if (tile.innerText === "") {
      emptyCells.push({ tile, index });
    }
  });

  if (emptyCells.length === 0) return;

  const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const r = Math.floor(choice.index / 9);
  const c = choice.index % 9;

  choice.tile.innerText = solution[r][c];
  choice.tile.classList.add("locked");

  hints--;
  document.getElementById("hints").innerText = hints;

  updateNumberCounts();
  highlightSameNumbers(selectedNumber);
  checkWin();
}


function updateNumberCounts() {
  // reset
  for (let i = 1; i <= 9; i++) numberCount[i] = 0;

  // count board
  document.querySelectorAll(".tile").forEach(tile => {
    if (tile.innerText !== "") {
      numberCount[tile.innerText]++;
    }
  });

  // enable / disable digits
  document.querySelectorAll(".number").forEach(num => {
    const value = num.innerText;
    if (numberCount[value] >= 9) {
      num.classList.add("disabled");
    } else {
      num.classList.remove("disabled");
    }
  });
}

function updateTimer() {
  let m = String(Math.floor(timer / 60)).padStart(2, "0");
  let s = String(timer % 60).padStart(2, "0");
  document.getElementById("timer").innerText = `${m}:${s}`;
}

function isValid(g, r, c, n) {
  for (let i = 0; i < 9; i++)
    if (g[r][i] === n || g[i][c] === n) return false;
  let br = Math.floor(r / 3) * 3;
  let bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (g[br + i][bc + j] === n) return false;
  return true;
} 

function checkWin() {
  const tiles = document.querySelectorAll(".tile");

  for (let tile of tiles) {
    if (tile.innerText === "") return false;
  }

  // GAME WON
  gameOver = true;
  paused = true;
  clearInterval(timerInterval);

  document.getElementById("pause-overlay").style.display = "flex";
  document.getElementById("pause-overlay").innerHTML = `
    <div class="win">
      🎉<br>YOU WIN<br>
      <span>${document.getElementById("timer").innerText}</span>
    </div>
  `;

  document.querySelectorAll(".number").forEach(n => {
    n.classList.add("disabled");
  });

  return true;
}

const shuffle = a => a.sort(() => Math.random() - 0.5);
const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;


