/* =========================================
   GOOGLE APPS SCRIPT URL

   Setelah membuat Google Apps Script,
   masukkan URL Web App di bawah ini.
========================================= */

const API_URL = "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI";


/* =========================================
   ELEMENT
========================================= */

const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");

const usernameInput = document.getElementById("username");
const whatsappInput = document.getElementById("whatsapp");

const startBtn = document.getElementById("startBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");

const playerName = document.getElementById("playerName");
const timerDisplay = document.getElementById("timer");

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const finalTime = document.getElementById("finalTime");
const resultName = document.getElementById("resultName");
const saveStatus = document.getElementById("saveStatus");

const playAgainBtn = document.getElementById("playAgainBtn");
const resultLeaderboardBtn =
    document.getElementById("resultLeaderboardBtn");

const backBtn = document.getElementById("backBtn");

const leaderboardList =
    document.getElementById("leaderboardList");

const errorText =
    document.getElementById("error");


/* =========================================
   GAME VARIABLES
========================================= */

let username = "";
let whatsapp = "";

let maze = [];

let rows = 15;
let cols = 15;

let player = {
    row: 0,
    col: 0
};

let startPosition = {
    row: 0,
    col: 0
};

let exitPosition = {
    row: rows - 1,
    col: cols - 1
};

let startTime = 0;

let timerInterval = null;

let gameRunning = false;


/* =========================================
   START GAME
========================================= */

startBtn.addEventListener("click", () => {

    username =
        usernameInput.value.trim();

    whatsapp =
        whatsappInput.value.trim();

    errorText.textContent = "";

    if (username.length < 3) {
        errorText.textContent =
            "Username minimal 3 karakter.";
        return;
    }

    if (!/^[0-9]{10,15}$/.test(whatsapp)) {
        errorText.textContent =
            "Nomor WhatsApp harus 10-15 angka.";
        return;
    }

    playerName.textContent = username;

    showScreen(gameScreen);

    startNewGame();
});


/* =========================================
   SCREEN
========================================= */

function showScreen(screen) {

    menu.classList.add("hidden");
    gameScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    leaderboardScreen.classList.add("hidden");

    screen.classList.remove("hidden");
}


/* =========================================
   NEW GAME
========================================= */

function startNewGame() {

    gameRunning = false;

    clearInterval(timerInterval);

    timerDisplay.textContent = "00:00.00";

    generateMaze();

    player = {
        row: startPosition.row,
        col: startPosition.col
    };

    drawMaze();

    setTimeout(() => {

        gameRunning = true;

        startTime = performance.now();

        timerInterval =
            setInterval(updateTimer, 10);

    }, 300);
}


/* =========================================
   TIMER
========================================= */

function updateTimer() {

    if (!gameRunning) return;

    const elapsed =
        performance.now() - startTime;

    timerDisplay.textContent =
        formatTime(elapsed);
}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(milliseconds) {

    const totalSeconds =
        milliseconds / 1000;

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        Math.floor(totalSeconds % 60);

    const hundredths =
        Math.floor(
            (milliseconds % 1000) / 10
        );

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(hundredths).padStart(2, "0")
    );
}


/* =========================================
   MAZE GENERATOR
   Recursive Backtracking

   0 = jalan
   1 = tembok
========================================= */

function generateMaze() {

    maze = [];

    for (let r = 0; r < rows; r++) {

        maze[r] = [];

        for (let c = 0; c < cols; c++) {

            maze[r][c] = 1;

        }
    }

    startPosition = {
        row: 1,
        col: 1
    };

    exitPosition = {
        row: rows - 2,
        col: cols - 2
    };

    carveMaze(1, 1);

    maze[startPosition.row][startPosition.col] = 0;

    maze[exitPosition.row][exitPosition.col] = 0;
}


/* =========================================
   CARVE MAZE
========================================= */

function carveMaze(row, col) {

    maze[row][col] = 0;

    const directions = [
        [0, 2],
        [0, -2],
        [2, 0],
        [-2, 0]
    ];

    shuffle(directions);

    for (const [dr, dc] of directions) {

        const nr = row + dr;
        const nc = col + dc;

        if (
            nr > 0 &&
            nr < rows - 1 &&
            nc > 0 &&
            nc < cols - 1 &&
            maze[nr][nc] === 1
        ) {

            maze[
                row + dr / 2
            ][
                col + dc / 2
            ] = 0;

            carveMaze(nr, nc);
        }
    }
}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }
}


/* =========================================
   DRAW MAZE
========================================= */

function drawMaze() {

    const size =
        Math.min(
            window.innerWidth * 0.92,
            window.innerHeight * 0.58,
            600
        );

    canvas.width = size;
    canvas.height = size;

    const cellSize =
        size / cols;

    ctx.clearRect(
        0,
        0,
        size,
        size
    );


    /* TEMBOK */

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            const x =
                c * cellSize;

            const y =
                r * cellSize;

            if (maze[r][c] === 1) {

                ctx.fillStyle = "#263449";

                ctx.fillRect(
                    x,
                    y,
                    cellSize,
                    cellSize
                );

            } else {

                ctx.fillStyle = "#0d1522";

                ctx.fillRect(
                    x,
                    y,
                    cellSize,
                    cellSize
                );
            }
        }
    }


    /* EXIT */

    drawCircle(
        exitPosition.col * cellSize +
            cellSize / 2,

        exitPosition.row * cellSize +
            cellSize / 2,

        cellSize * 0.32,

        "#ff4d5a"
    );


    /* PLAYER */

    drawCircle(
        player.col * cellSize +
            cellSize / 2,

        player.row * cellSize +
            cellSize / 2,

        cellSize * 0.30,

        "#20d47b"
    );
}


/* =========================================
   DRAW CIRCLE
========================================= */

function drawCircle(
    x,
    y,
    radius,
    color
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;

    ctx.fill();
}


/* =========================================
   MOVE PLAYER
========================================= */

function movePlayer(dr, dc) {

    if (!gameRunning) return;

    const newRow =
        player.row + dr;

    const newCol =
        player.col + dc;

    if (
        newRow < 0 ||
        newRow >= rows ||
        newCol < 0 ||
        newCol >= cols
    ) {
        return;
    }

    if (maze[newRow][newCol] === 1) {
        return;
    }

    player.row = newRow;
    player.col = newCol;

    drawMaze();

    checkWin();
}


/* =========================================
   CHECK WIN
========================================= */

function checkWin() {

    if (
        player.row === exitPosition.row &&
        player.col === exitPosition.col
    ) {

        finishGame();
    }
}


/* =========================================
   FINISH GAME
========================================= */

function finishGame() {

    gameRunning = false;

    clearInterval(timerInterval);

    const elapsed =
        performance.now() - startTime;

    const timeText =
        formatTime(elapsed);

    finalTime.textContent = timeText;

    resultName.textContent = username;

    showScreen(resultScreen);

    saveScore(elapsed);
}


/* =========================================
   SAVE SCORE
========================================= */

async function saveScore(milliseconds) {

    saveStatus.textContent =
        "⏳ Menyimpan skor...";

    if (
        API_URL ===
        "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI"
    ) {

        saveStatus.textContent =
            "⚠️ Google Sheets belum terhubung.";

        return;
    }

    try {

        const data = {

            username: username,

            whatsapp: whatsapp,

            time: milliseconds,

            timeText: formatTime(milliseconds),

            date: new Date().toISOString()

        };

        await fetch(API_URL, {

            method: "POST",

            mode: "no-cors",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data)

        });

        saveStatus.textContent =
            "✅ Skor berhasil disimpan!";

    } catch (error) {

        console.error(error);

        saveStatus.textContent =
            "❌ Gagal menyimpan skor.";
    }
}


/* =========================================
   CONTROL BUTTON
========================================= */

document
    .querySelectorAll(".control")
    .forEach(button => {

        button.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                const dir =
                    button.dataset.dir;

                if (dir === "up")
                    movePlayer(-1, 0);

                if (dir === "down")
                    movePlayer(1, 0);

                if (dir === "left")
                    movePlayer(0, -1);

                if (dir === "right")
                    movePlayer(0, 1);
            }
        );
    });


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (!gameRunning) return;

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {

            movePlayer(-1, 0);

        } else if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {

            movePlayer(1, 0);

        } else if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            movePlayer(0, -1);

        } else if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            movePlayer(0, 1);
        }
    }
);


/* =========================================
   PLAY AGAIN
========================================= */

playAgainBtn.addEventListener(
    "click",
    () => {

        showScreen(gameScreen);

        startNewGame();
    }
);


/* =========================================
   QUIT
========================================= */

document.getElementById("quitBtn")
    .addEventListener(
        "click",
        () => {

            gameRunning = false;

            clearInterval(timerInterval);

            showScreen(menu);
        }
    );


/* =========================================
   LEADERBOARD BUTTON
========================================= */

leaderboardBtn.addEventListener(
    "click",
    () => {

        showScreen(leaderboardScreen);

        loadLeaderboard();
    }
);


resultLeaderboardBtn.addEventListener(
    "click",
    () => {

        showScreen(leaderboardScreen);

        loadLeaderboard();
    }
);


/* =========================================
   BACK
========================================= */

backBtn.addEventListener(
    "click",
    () => {

        showScreen(menu);
    }
);


/* =========================================
   LOAD LEADERBOARD
========================================= */

async function loadLeaderboard() {

    leaderboardList.innerHTML = `
        <div class="loading">
            ⏳ Memuat leaderboard...
        </div>
    `;

    if (
        API_URL ===
        "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI"
    ) {

        leaderboardList.innerHTML = `
            <div class="loading">
                ⚠️ Google Sheets belum terhubung.
            </div>
        `;

        return;
    }

    try {

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        displayLeaderboard(data);

    } catch (error) {

        console.error(error);

        leaderboardList.innerHTML = `
            <div class="loading">
                ❌ Gagal memuat leaderboard.
            </div>
        `;
    }
}


/* =========================================
   DISPLAY LEADERBOARD
========================================= */

function displayLeaderboard(data) {

    if (!data || data.length === 0) {

        leaderboardList.innerHTML = `
            <div class="loading">
                Belum ada pemain.
            </div>
        `;

        return;
    }

    data.sort(
        (a, b) =>
            Number(a.time) -
            Number(b.time)
    );

    leaderboardList.innerHTML = "";

    data.slice(0, 20)
        .forEach((player, index) => {

            const item =
                document.createElement("div");

            item.className = "leader";

            item.innerHTML = `

                <div class="rank">
                    ${getRankIcon(index)}
                </div>

                <div class="leader-info">

                    <div class="leader-name">
                        ${escapeHTML(player.username)}
                    </div>

                    <div class="leader-date">
                        ${formatDate(player.date)}
                    </div>

                </div>

                <div class="leader-score">
                    ${player.timeText}
                </div>
            `;

            leaderboardList.appendChild(item);
        });
}


/* =========================================
   RANK ICON
========================================= */

function getRankIcon(index) {

    if (index === 0) return "🥇";

    if (index === 1) return "🥈";

    if (index === 2) return "🥉";

    return index + 1;
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================
   DATE
========================================= */

function formatDate(date) {

    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================
   RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            !gameScreen.classList.contains(
                "hidden"
            )
        ) {

            drawMaze();
        }
    }
);
