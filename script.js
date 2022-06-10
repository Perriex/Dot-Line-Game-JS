const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];

// simulate backend logic response
const complete = {
  "box-0-0": ["h-0-0", "v-0-0", "v-0-1", "h-1-0"],
  "box-0-1": ["h-0-1", "v-0-1", "v-0-2", "h-1-1"],
  "box-0-2": ["h-0-2", "v-0-2", "v-0-3", "h-1-2"],
  "box-1-0": ["h-1-0", "v-1-0", "v-1-1", "h-2-0"],
  "box-1-1": ["h-1-1", "v-1-1", "v-1-2", "h-2-1"],
  "box-1-2": ["h-1-2", "v-1-2", "v-1-3", "h-2-2"],
  "box-2-0": ["v-2-0", "v-2-1", "h-2-0", "h-3-0"],
  "box-2-1": ["h-2-1", "v-2-2", "v-2-1", "h-3-1"],
  "box-2-2": ["h-2-2", "v-2-3", "v-2-2", "h-3-2"],
};

// simulate backend logic response
const relative = {
  "v-0-0": ["box-0-0"],
  "h-0-0": ["box-0-0"],
  "v-0-1": ["box-0-0", "box-0-1"],
  "h-1-0": ["box-0-0", "box-1-0"],
  "h-0-1": ["box-0-1"],
  "v-0-2": ["box-0-1", "box-0-2"],
  "h-1-1": ["box-0-1", "box-1-1"],
  "h-0-2": ["box-0-2"],
  "v-0-3": ["box-0-2"],
  "h-1-2": ["box-0-2", "box-1-2"],
  "v-1-0": ["box-1-0"],
  "v-1-1": ["box-1-0", "box-1-1"],
  "v-1-2": ["box-1-1", "box-1-2"],
  "v-1-3": ["box-1-2"],
  "h-2-0": ["box-1-0", "box-2-0"],
  "h-2-1": ["box-1-1", "box-2-1"],
  "h-2-2": ["box-1-2", "box-2-2"],
  "v-2-0": ["box-2-0"],
  "v-2-1": ["box-2-0", "box-2-1"],
  "v-2-2": ["box-2-1", "box-2-2"],
  "v-2-3": ["box-2-2"],
  "h-3-0": ["box-2-0"],
  "h-3-1": ["box-2-1"],
  "h-3-2": ["box-2-2"],
};

const scores = {
  R: 0,
  B: 0,
};

const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) =>
  `It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const isLineSelected = (line) =>
  line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
  const gameGridContainer = document.getElementsByClassName(
    "game-grid-container"
  )[0];

  const rows = Array(N)
    .fill(0)
    .map((_, i) => i);
  const cols = Array(M)
    .fill(0)
    .map((_, i) => i);

  rows.forEach((row) => {
    cols.forEach((col) => {
      const dot = document.createElement("div");
      dot.setAttribute("class", "dot");

      const hLine = document.createElement("div");
      hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
      hLine.setAttribute("id", `h-${row}-${col}`);
      hLine.addEventListener("click", handleLineClick);

      gameGridContainer.appendChild(dot);
      if (col < M - 1) gameGridContainer.appendChild(hLine);
    });

    if (row < N - 1) {
      cols.forEach((col) => {
        const vLine = document.createElement("div");
        vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
        vLine.setAttribute("id", `v-${row}-${col}`);
        vLine.addEventListener("click", handleLineClick);

        const box = document.createElement("div");
        box.setAttribute("class", "box");
        box.setAttribute("id", `box-${row}-${col}`);

        gameGridContainer.appendChild(vLine);
        if (col < M - 1) gameGridContainer.appendChild(box);
      });
    }
  });

  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
  const nextTurn = turn === "R" ? "B" : "R";

  const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

  lines.forEach((l) => {
    //if line was not already selected, change it's hover color according to the next turn
    if (!isLineSelected(l)) {
      l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
    }
  });
  turn = nextTurn;
  document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

// just playing with color
const changeBgBox = (id) => {
  const completeBox = document.getElementById(id);
  completeBox.classList.add(bgClasses[turn]);
};

// check logic for complete temps
const checkSquare = (selectedLine) => {
  const possibles = relative[selectedLine.id];
  let box = "";
  possibles.forEach((item) => {
    const check = complete[item];
    const result = check.map((line) => selectedLines.indexOf(line) !== -1);
    if (result.every((val) => val)) {
      changeBgBox(item);
      scores[turn]++;
      box = item;
    }
  });

  return box.length > 0;
};

const playersWinnerText = () => {
  let winner = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
  return `Won ${winner === "R" ? "Red" : "Blue"}`;
};

// change for winner result
const handleLineClick = (e) => {
  const lineId = e.target.id;

  const selectedLine = document.getElementById(lineId);

  if (isLineSelected(selectedLine)) {
    //if line was already selected, return
    return;
  }

  selectedLines = [...selectedLines, lineId];

  colorLine(selectedLine);
  let res = checkSquare(selectedLine);
  if (selectedLines.length === 24) {
    document.getElementById("game-status").innerHTML = playersWinnerText();
    return;
  }
  if (!res) changeTurn();
};

const colorLine = (selectedLine) => {
  selectedLine.classList.remove(hoverClasses[turn]);
  selectedLine.classList.add(bgClasses[turn]);
};

createGameGrid();
