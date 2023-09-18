let amount = 8;
const numbers = [];
const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(6, 1fr)`;
let timer = 0;
let numberOfPlayers = 0;
let currentPlayer = 1;
let gameStarted = false;
let counter = 0;

const pairsInput = document.getElementById("pairsInput");
const MIN_PAIRS = 4;
const MAX_PAIRS = 15;

const playerInput = document.querySelector(".player-input");
const playerNameInput1 = document.getElementById("playerNameInput1");
const playerNameInput2 = document.getElementById("playerNameInput2");
const startGameBtn = document.getElementById("startGameBtn");
const modal = document.getElementById("modal");
const onePlayerBtn = document.getElementById("onePlayerBtn");
const twoPlayersBtn = document.getElementById("twoPlayersBtn");

document.addEventListener("DOMContentLoaded", function () {
  modal.style.display = "flex";
  modal.classList.add("active");
});

onePlayerBtn.addEventListener("click", () => {
  numberOfPlayers = 1;
  playerInput.style.display = "flex";
  playerNameInput2.style.display = "none";
  document.querySelector(".player2").style.display = "none";
});

twoPlayersBtn.addEventListener("click", () => {
  numberOfPlayers = 2;
  playerInput.style.display = "flex";
  playerNameInput2.style.display = "block";
  document.querySelector(".player2").style.display = "block";
});

startGameBtn.addEventListener("click", () => {
  const playerName1 = playerNameInput1.value || "Player 1";
  document.querySelector(".player1 span ").textContent = `${playerName1}: `;

  if (numberOfPlayers === 2) {
    const playerName2 = playerNameInput2.value || "Player 2";
    document.querySelector(".player2 span").textContent = `${playerName2}: `;
  }

  const selectedPairs = parseInt(pairsInput.value, 10);

  if (
    isNaN(selectedPairs) ||
    selectedPairs < MIN_PAIRS ||
    selectedPairs > MAX_PAIRS
  ) {
    alert("Please enter a valid number of pairs between 4 and 15.");
    return;
  }

  amount = selectedPairs;

  for (let i = 1; i <= amount; i++) {
    numbers.push(i, i);
  }

  for (let i = 1; i <= amount * 2; i++) {
    const rand = Math.floor(Math.random() * numbers.length);
    const div = document.createElement("div");
    div.innerHTML = `<span>${numbers[rand]}</span>`;
    board.appendChild(div);

    numbers.splice(rand, 1);

    div.addEventListener("click", (ev) => {
      if (ev.target.classList.contains("hidden")) {
        return;
      }

      const cards = board.querySelectorAll(".showing");

      if (cards.length == 2) {
        return;
      }

      ev.target.classList.add("showing");

      // cheat code to find the pair
      // board
      //   .querySelectorAll(".cheat")
      //   .forEach((elem) => elem.classList.remove("cheat"));
      // const elements = board.querySelectorAll("div:not(.showing)");

      // for (const elem of elements) {
      //   if (elem.textContent == ev.target.textContent) {
      //     elem.classList.add("cheat");
      //     break;
      //   }
      // }

      check();
    });
  }
  playerInput.style.display = "none";
  if (numberOfPlayers === 1) {
    document.querySelector(".player2").style.display = "none";
  } else if (numberOfPlayers === 2) {
    document.querySelector(".player2").style.display = "block";
  }
  modal.classList.remove("active");
});

function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.querySelector(".player-active").classList.remove("player-active");
  document
    .querySelector(`.player${currentPlayer}`)
    .classList.add("player-active");
}

let timerInterval = setInterval(() => {
  timer++;

  const date = new Date(timer * 1000);
  const m = date.getMinutes();
  const s = date.getSeconds();

  document.querySelector(".timer").innerHTML = `${m < 10 ? "0" + m : m}:${
    s < 10 ? "0" + s : s
  }`;
}, 1000);

function check() {
  const cards = board.querySelectorAll(".showing");

  if (cards.length == 2) {
    document.querySelector(".counter").innerHTML = ++counter;
    const first = cards[0];
    const last = cards[1];

    if (first.textContent == last.textContent) {
      setTimeout(() => {
        first.classList.remove("showing");
        last.classList.remove("showing");

        first.classList.add("hidden");
        last.classList.add("hidden");

        const playerScoreElement = document.querySelector(
          `.player${currentPlayer}Score`
        );
        playerScoreElement.textContent =
          Number(playerScoreElement.textContent) + 1;

        checkIsComplete();
      }, 1000);
    } else {
      setTimeout(() => {
        first.classList.remove("showing");
        last.classList.remove("showing");

        if (numberOfPlayers === 2) {
          switchTurn();
        } else {
          document
            .querySelector(".player-active")
            .classList.remove("player-active");
          document
            .querySelector(`.player${currentPlayer}`)
            .classList.add("player-active");
        }
      }, 1500);
    }
  }
}

function checkIsComplete() {
  const cards = board.querySelectorAll("div:not(.hidden)");

  if (!cards.length) {
    clearInterval(timerInterval);

    confetti({
      particleCount: 100,
      spread: 70,
      decay: 0.9,
      origin: { y: 0.6 },
    });

    const winner = document.createElement("div");
    winner.className = "winner";

    let winnerName = "";

    if (currentPlayer === 1) {
      winnerName = playerNameInput1.value || "Player 1";
    } else {
      winnerName = playerNameInput2.value || "Player 2";
    }

    winner.innerHTML = `${winnerName} Wins!<br>Attempts: ${counter}<br>Time: ${timer} seconds`;
    document.body.appendChild(winner);
  }
}
