// ===============================
// MAZE ESCAPE
// ===============================

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");

const startBtn = document.getElementById("startBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const resultLeaderboardBtn = document.getElementById("resultLeaderboardBtn");
const leaderboardBackBtn = document.getElementById("leaderboardBackBtn");

const playAgainBtn = document.getElementById("playAgainBtn");
const homeBtn = document.getElementById("homeBtn");
const quitBtn = document.getElementById("quitBtn");

const usernameInput = document.getElementById("username");
const whatsappInput = document.getElementById("whatsapp");
const errorMessage = document.getElementById("errorMessage");

const timerText = document.getElementById("timer");
const finalTime = document.getElementById("finalTime");

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const leaderboardList = document.getElementById("leaderboardList");


// ===============================
// DATA GAME
// ===============================

const SIZE = 17;

let maze = [];
let player = {
    row: 1,
    col: 1
};

let startTime = 0;
let timerInterval = null;
let gameRunning = false;
let currentUsername = "";

const STORAGE_KEY = "mazeEscapeLeaderboard";


// ===============================
// SCREEN
// ===============================

function showScreen(screen) {
    menuScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    leaderboardScreen.classList.remove("active");

    screen.classList.add("active");
}


// ===============================
// START GAME
// ===============================

startBtn.addEventListener("click", function () {

    const username = usernameInput.value.trim();

    if (username === "") {
        errorMessage.textContent = "⚠️ Masukkan username terlebih dahulu!";
        usernameInput.focus();
        return;
    }

    errorMessage.textContent = "";

    currentUsername = username;

    startGame();
});


// ===============================
// MULAI GAME
// ===============================

function startGame() {

    showScreen(gameScreen);

    createMaze();

    player.row = 1;
    player.col = 1;

    timerText.textContent = "0.0";

    gameRunning = true;

    startTime = performance.now();

    clearInterval(timerInterval);

    timerInterval = setInterval(updateTimer, 100);

    resizeCanvas();

    drawMaze();
}


// ===============================
// TIMER
// ===============================

function updateTimer() {

    if (!gameRunning) return;

    const elapsed = (performance.now() - startTime) / 1000;

    timerText.textContent = elapsed.toFixed(1);
}


// ===============================
// GENERATE MAZE
// ===============================

function createMaze() {

    // Semua jadi tembok
    maze = Array.from(
        { length: SIZE },
        () => Array(SIZE).fill(1)
    );

    carve(1, 1);

    // Pastikan start dan exit terbuka
    maze[1][1] = 0;
    maze[SIZE - 2][SIZE - 2] = 0;
}


// Recursive Backtracking
function carve(row, col) {

    maze[row][col] = 0;

    const directions = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ];

    shuffle(directions);

    for (const [dr, dc] of directions) {

        const nr = row + dr;
        const nc = col + dc;

        if (
            nr > 0 &&
            nr < SIZE - 1 &&
            nc > 0 &&
            nc < SIZE - 1 &&
            maze[nr][nc] === 1
        ) {

            maze[row + dr / 2][col + dc / 2] = 0;

            carve(nr, nc);
        }
    }
}


// ===============================
// SHUFFLE
// ===============================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}


// ===============================
// CANVAS
// ===============================

function resizeCanvas() {

    const size = Math.min(
        canvas.parentElement.clientWidth - 16,
        430
    );

    canvas.width = size;
    canvas.height = size;
}


// ===============================
// DRAW MAZE
// ===============================

function drawMaze() {

    if (!maze.length) return;

    const cell = canvas.width / SIZE;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Background
    ctx.fillStyle = "#061019";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Maze
    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            const x = col * cell;
            const y = row * cell;

            if (maze[row][col] === 1) {

                ctx.fillStyle = "#172c3b";

                ctx.fillRect(
                    x,
                    y,
                    cell + 1,
                    cell + 1
                );

            } else {

                ctx.fillStyle = "#07151d";

                ctx.fillRect(
                    x,
                    y,
                    cell + 1,
                    cell + 1
                );
            }
        }
    }


    // START
    drawCircle(
        1,
        1,
        cell,
        "#00ffc8"
    );


    // EXIT
    drawCircle(
        SIZE - 2,
        SIZE - 2,
        cell,
        "#ff5577"
    );


    // PLAYER
    drawPlayer(cell);
}


// ===============================
// DRAW CIRCLE
// ===============================

function drawCircle(row, col, cell, color) {

    const x = col * cell + cell / 2;
    const y = row * cell + cell / 2;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        cell * 0.27,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;

    ctx.fill();

    ctx.shadowBlur = 0;
}


// ===============================
// DRAW PLAYER
// ===============================

function drawPlayer(cell) {

    const x = player.col * cell + cell / 2;
    const y = player.row * cell + cell / 2;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        cell * 0.30,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffffff";

    ctx.fill();

    ctx.shadowBlur = 0;
}


// ===============================
// MOVEMENT
// ===============================

function movePlayer(direction) {

    if (!gameRunning) return;

    let newRow = player.row;
    let newCol = player.col;

    if (direction === "up") {
        newRow--;
    }

    if (direction === "down") {
        newRow++;
    }

    if (direction === "left") {
        newCol--;
    }

    if (direction === "right") {
        newCol++;
    }


    // Jangan keluar maze
    if (
        newRow < 0 ||
        newRow >= SIZE ||
        newCol < 0 ||
        newCol >= SIZE
    ) {
        return;
    }


    // Kalau tembok, jangan bergerak
    if (maze[newRow][newCol] === 1) {
        return;
    }


    player.row = newRow;
    player.col = newCol;

    drawMaze();

    checkWin();
}


// ===============================
// BUTTON CONTROL
// ===============================

document.querySelectorAll(".control").forEach(button => {

    const direction = button.dataset.direction;

    if (!direction) return;

    button.addEventListener("pointerdown", function (event) {

        event.preventDefault();

        movePlayer(direction);
    });
});


// ===============================
// KEYBOARD
// ===============================

document.addEventListener("keydown", function (event) {

    if (!gameRunning) return;

    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        movePlayer("up");
    }

    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        movePlayer("down");
    }

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        movePlayer("left");
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        movePlayer("right");
    }
});


// ===============================
// SWIPE HP
// ===============================

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (event) {

    const touch = event.changedTouches[0];

    touchStartX = touch.screenX;
    touchStartY = touch.screenY;

}, { passive: true });


canvas.addEventListener("touchend", function (event) {

    const touch = event.changedTouches[0];

    const dx = touch.screenX - touchStartX;
    const dy = touch.screenY - touchStartY;

    const minSwipe = 25;

    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) {
        return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 0) {
            movePlayer("right");
        } else {
            movePlayer("left");
        }

    } else {

        if (dy > 0) {
            movePlayer("down");
        } else {
            movePlayer("up");
        }
    }

}, { passive: true });


// ===============================
// CEK MENANG
// ===============================

function checkWin() {

    const exitRow = SIZE - 2;
    const exitCol = SIZE - 2;

    if (
        player.row === exitRow &&
        player.col === exitCol
    ) {

        finishGame();
    }
}


// ===============================
// SELESAI
// ===============================

function finishGame() {

    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(timerInterval);

    const elapsed =
        (performance.now() - startTime) / 1000;

    const finalSeconds = Number(elapsed.toFixed(1));

    finalTime.textContent =
        finalSeconds.toFixed(1) + " detik";

    saveScore(
        currentUsername,
        finalSeconds
    );

    showScreen(resultScreen);
}


// ===============================
// LEADERBOARD
// ===============================

function getLeaderboard() {

    try {

        const data =
            localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const leaderboard = JSON.parse(data);

        if (!Array.isArray(leaderboard)) {
            return [];
        }

        return leaderboard;

    } catch (error) {

        console.error("Leaderboard error:", error);

        return [];
    }
}


// ===============================
// SIMPAN SCORE
// ===============================

function saveScore(username, time) {

    const leaderboard = getLeaderboard();

    leaderboard.push({
        username: username,
        time: time,
        date: new Date().toLocaleDateString("id-ID")
    });

    leaderboard.sort((a, b) => a.time - b.time);

    const top20 = leaderboard.slice(0, 20);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(top20)
    );
}


// ===============================
// TAMPILKAN LEADERBOARD
// ===============================

function showLeaderboard() {

    const leaderboard = getLeaderboard();

    leaderboardList.innerHTML = "";

    if (leaderboard.length === 0) {

        leaderboardList.innerHTML = `
            <div class="empty">
                🏆 Belum ada pemain.<br>
                Jadilah yang pertama!
            </div>
        `;

        showScreen(leaderboardScreen);

        return;
    }


    leaderboard.forEach((player, index) => {

        const item = document.createElement("div");

        item.className = "rank-item";

        item.innerHTML = `
            <div class="rank">
                #${index + 1}
            </div>

            <div class="player">
                <div class="player-name">
                    ${escapeHTML(player.username)}
                </div>

                <div class="player-date">
                    ${player.date}
                </div>
            </div>

            <div class="player-time">
                ${Number(player.time).toFixed(1)}s
            </div>
        `;

        leaderboardList.appendChild(item);
    });

    showScreen(leaderboardScreen);
}


// ===============================
// AMANKAN USERNAME
// ===============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ===============================
// BUTTON LEADERBOARD
// ===============================

leaderboardBtn.addEventListener(
    "click",
    showLeaderboard
);

resultLeaderboardBtn.addEventListener(
    "click",
    showLeaderboard
);


// ===============================
// BACK LEADERBOARD
// ===============================

leaderboardBackBtn.addEventListener(
    "click",
    function () {

        showScreen(menuScreen);
    }
);


// ===============================
// MAIN LAGI
// ===============================

playAgainBtn.addEventListener(
    "click",
    function () {

        startGame();
    }
);


// ===============================
// HOME
// ===============================

homeBtn.addEventListener(
    "click",
    function () {

        clearInterval(timerInterval);

        gameRunning = false;

        showScreen(menuScreen);
    }
);


// ===============================
// QUIT
// ===============================

quitBtn.addEventListener(
    "click",
    function () {

        clearInterval(timerInterval);

        gameRunning = false;

        showScreen(menuScreen);
    }
);


// ===============================
// RESIZE
// ===============================

window.addEventListener(
    "resize",
    function () {

        if (gameScreen.classList.contains("active")) {

            resizeCanvas();

            drawMaze();
        }
    }
);
