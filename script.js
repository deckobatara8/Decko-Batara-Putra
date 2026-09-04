/* ==========================================
   MAZE ESCAPE
========================================== */


/* ==========================================
   GOOGLE APPS SCRIPT

   GANTI DENGAN URL WEB APP KAMU
========================================== */

const API_URL =
    "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI";


/* ==========================================
   ELEMENT
========================================== */

const homeScreen =
    document.getElementById("homeScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");

const leaderboardScreen =
    document.getElementById(
        "leaderboardScreen"
    );


const usernameInput =
    document.getElementById("username");

const whatsappInput =
    document.getElementById("whatsapp");

const errorMessage =
    document.getElementById(
        "errorMessage"
    );


const startButton =
    document.getElementById(
        "startButton"
    );

const openLeaderboard =
    document.getElementById(
        "openLeaderboard"
    );

const closeLeaderboard =
    document.getElementById(
        "closeLeaderboard"
    );


const hudUsername =
    document.getElementById(
        "hudUsername"
    );

const timer =
    document.getElementById(
        "timer"
    );


const canvas =
    document.getElementById(
        "mazeCanvas"
    );

const ctx =
    canvas.getContext("2d");


const resultUsername =
    document.getElementById(
        "resultUsername"
    );

const finalTime =
    document.getElementById(
        "finalTime"
    );

const saveStatus =
    document.getElementById(
        "saveStatus"
    );


const playAgain =
    document.getElementById(
        "playAgain"
    );

const resultLeaderboard =
    document.getElementById(
        "resultLeaderboard"
    );

const leaderboardList =
    document.getElementById(
        "leaderboardList"
    );

const quitButton =
    document.getElementById(
        "quitButton"
    );


/* ==========================================
   PLAYER
========================================== */

let playerName = "";
let playerWhatsapp = "";


/* ==========================================
   MAZE
========================================== */

const ROWS = 17;
const COLS = 17;

let maze = [];

let player = {
    row: 1,
    col: 1
};

let startPosition = {
    row: 1,
    col: 1
};

let exitPosition = {
    row: ROWS - 2,
    col: COLS - 2
};


/* ==========================================
   TIMER
========================================== */

let gameRunning = false;

let startTime = 0;

let timerInterval = null;


/* ==========================================
   SCREEN CONTROL
========================================== */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });

    screen.classList.add("active");
}


/* ==========================================
   START BUTTON
========================================== */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    playerName =
        usernameInput.value.trim();

    playerWhatsapp =
        whatsappInput.value.trim();


    errorMessage.textContent = "";


    /* USERNAME */

    if (playerName.length < 3) {

        errorMessage.textContent =
            "Username minimal 3 karakter.";

        usernameInput.focus();

        return;
    }


    /* WHATSAPP */

    if (
        !/^[0-9]{10,15}$/.test(
            playerWhatsapp
        )
    ) {

        errorMessage.textContent =
            "Nomor WhatsApp tidak valid.";

        whatsappInput.focus();

        return;
    }


    hudUsername.textContent =
        playerName;

    resultUsername.textContent =
        playerName;


    showScreen(gameScreen);


    startNewMaze();
}


/* ==========================================
   NEW MAZE
========================================== */

function startNewMaze() {

    stopTimer();

    timer.textContent =
        "00:00.00";


    generateMaze();


    player = {
        row: startPosition.row,
        col: startPosition.col
    };


    resizeCanvas();

    drawMaze();


    setTimeout(() => {

        startTimer();

    }, 250);
}


/* ==========================================
   MAZE GENERATOR
========================================== */

function generateMaze() {

    maze = [];


    /* SEMUA TEMBOK */

    for (
        let r = 0;
        r < ROWS;
        r++
    ) {

        maze[r] = [];

        for (
            let c = 0;
            c < COLS;
            c++
        ) {

            maze[r][c] = 1;

        }
    }


    startPosition = {
        row: 1,
        col: 1
    };


    exitPosition = {
        row: ROWS - 2,
        col: COLS - 2
    };


    carvePath(1, 1);


    maze[
        exitPosition.row
    ][
        exitPosition.col
    ] = 0;
}


/* ==========================================
   CARVE PATH
========================================== */

function carvePath(row, col) {

    maze[row][col] = 0;


    const directions = [

        [0, 2],

        [0, -2],

        [2, 0],

        [-2, 0]

    ];


    shuffle(directions);


    for (
        const direction of directions
    ) {

        const newRow =
            row + direction[0];

        const newCol =
            col + direction[1];


        if (

            newRow > 0 &&

            newRow < ROWS - 1 &&

            newCol > 0 &&

            newCol < COLS - 1 &&

            maze[newRow][newCol] === 1

        ) {

            maze[
                row +
                direction[0] / 2
            ][
                col +
                direction[1] / 2
            ] = 0;


            carvePath(
                newRow,
                newCol
            );
        }
    }
}


/* ==========================================
   SHUFFLE
========================================== */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [

            array[j],
            array[i]

        ];
    }
}


/* ==========================================
   CANVAS SIZE
========================================== */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();


    const size =
        Math.floor(
            Math.min(
                rect.width,
                rect.height
            )
        );


    canvas.width = size;
    canvas.height = size;
}


/* ==========================================
   DRAW MAZE
========================================== */

function drawMaze() {

    if (!canvas.width) return;


    const cell =
        canvas.width / COLS;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* ==================================
       FLOOR
    ================================== */

    for (
        let r = 0;
        r < ROWS;
        r++
    ) {

        for (
            let c = 0;
            c < COLS;
            c++
        ) {

            const x =
                c * cell;

            const y =
                r * cell;


            if (
                maze[r][c] === 1
            ) {

                /* WALL */

                ctx.fillStyle =
                    "#17243a";

                ctx.fillRect(
                    x,
                    y,
                    cell,
                    cell
                );


                /* WALL HIGHLIGHT */

                ctx.fillStyle =
                    "rgba(255,255,255,.035)";

                ctx.fillRect(
                    x,
                    y,
                    cell,
                    1
                );


            } else {

                /* FLOOR */

                ctx.fillStyle =
                    "#080f1c";

                ctx.fillRect(
                    x,
                    y,
                    cell,
                    cell
                );


                /* FLOOR DOT */

                ctx.fillStyle =
                    "rgba(255,255,255,.018)";

                ctx.beginPath();

                ctx.arc(
                    x + cell / 2,
                    y + cell / 2,
                    1,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        }
    }


    /* ==================================
       START
    ================================== */

    drawGlowCircle(

        startPosition.col * cell +
        cell / 2,

        startPosition.row * cell +
        cell / 2,

        cell * .28,

        "#39f6a2"

    );


    /* ==================================
       EXIT
    ================================== */

    drawGlowCircle(

        exitPosition.col * cell +
        cell / 2,

        exitPosition.row * cell +
        cell / 2,

        cell * .28,

        "#ff526b"

    );


    /* EXIT FLAG */

    ctx.fillStyle = "#ffffff";

    ctx.font =
        `${cell * .28}px Arial`;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(

        "★",

        exitPosition.col * cell +
        cell / 2,

        exitPosition.row * cell +
        cell / 2

    );


    /* ==================================
       PLAYER
    ================================== */

    drawPlayer(
        player.col * cell +
        cell / 2,

        player.row * cell +
        cell / 2,

        cell
    );
}


/* ==========================================
   GLOW CIRCLE
========================================== */

function drawGlowCircle(
    x,
    y,
    radius,
    color
) {

    ctx.save();


    ctx.shadowBlur =
        radius * 1.5;

    ctx.shadowColor =
        color;


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        color;

    ctx.fill();


    ctx.restore();
}


/* ==========================================
   PLAYER
========================================== */

function drawPlayer(
    x,
    y,
    cell
) {

    const radius =
        cell * .27;


    ctx.save();


    ctx.shadowBlur =
        radius * 1.5;

    ctx.shadowColor =
        "#39f6a2";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#39f6a2";

    ctx.fill();


    ctx.shadowBlur = 0;


    /* PLAYER CENTER */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius * .38,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    ctx.restore();
}


/* ==========================================
   MOVE
========================================== */

function movePlayer(
    rowChange,
    colChange
) {

    if (!gameRunning) return;


    const newRow =
        player.row + rowChange;

    const newCol =
        player.col + colChange;


    /* BOUNDARY */

    if (

        newRow < 0 ||
        newRow >= ROWS ||
        newCol < 0 ||
        newCol >= COLS

    ) {

        return;
    }


    /* WALL */

    if (
        maze[newRow][newCol] === 1
    ) {

        return;
    }


    player.row =
        newRow;

    player.col =
        newCol;


    drawMaze();


    /* WIN */

    if (

        player.row ===
            exitPosition.row &&

        player.col ===
            exitPosition.col

    ) {

        finishGame();
    }
}


/* ==========================================
   CONTROLS
========================================== */

document
    .querySelectorAll(".control")
    .forEach(button => {

        button.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();


                const direction =
                    button.dataset.direction;


                switch (direction) {

                    case "up":

                        movePlayer(
                            -1,
                            0
                        );

                        break;


                    case "down":

                        movePlayer(
                            1,
                            0
                        );

                        break;


                    case "left":

                        movePlayer(
                            0,
                            -1
                        );

                        break;


                    case "right":

                        movePlayer(
                            0,
                            1
                        );

                        break;
                }

            }
        );

    });


/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener(
    "keydown",
    event => {

        if (!gameRunning) return;


        switch (event.key) {

            case "ArrowUp":
            case "w":
            case "W":

                movePlayer(-1, 0);

                break;


            case "ArrowDown":
            case "s":
            case "S":

                movePlayer(1, 0);

                break;


            case "ArrowLeft":
            case "a":
            case "A":

                movePlayer(0, -1);

                break;


            case "ArrowRight":
            case "d":
            case "D":

                movePlayer(0, 1);

                break;
        }
    }
);


/* ==========================================
   TIMER
========================================== */

function startTimer() {

    gameRunning = true;

    startTime =
        performance.now();


    timerInterval =
        setInterval(
            updateTimer,
            10
        );
}


function updateTimer() {

    if (!gameRunning) return;


    const elapsed =
        performance.now() -
        startTime;


    timer.textContent =
        formatTime(elapsed);
}


function stopTimer() {

    gameRunning = false;


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;
    }
}


/* ==========================================
   FORMAT TIME
========================================== */

function formatTime(
    milliseconds
) {

    const minutes =
        Math.floor(
            milliseconds /
            60000
        );


    const seconds =
        Math.floor(
            (milliseconds % 60000) /
            1000
        );


    const hundredths =
        Math.floor(
            (milliseconds % 1000) /
            10
        );


    return (

        String(minutes)
            .padStart(2, "0")

        + ":" +

        String(seconds)
            .padStart(2, "0")

        + "." +

        String(hundredths)
            .padStart(2, "0")

    );
}


/* ==========================================
   FINISH
========================================== */

function finishGame() {

    const elapsed =
        performance.now() -
        startTime;


    stopTimer();


    finalTime.textContent =
        formatTime(elapsed);


    showScreen(
        resultScreen
    );


    saveScore(elapsed);
}


/* ==========================================
   SAVE SCORE
========================================== */

async function saveScore(
    milliseconds
) {

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


    const data = {

        username:
            playerName,

        whatsapp:
            playerWhatsapp,

        time:
            milliseconds,

        timeText:
            formatTime(
                milliseconds
            ),

        date:
            new Date()
                .toISOString()

    };


    try {

        await fetch(
            API_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(data)

            }
        );


        saveStatus.textContent =
            "✓ SCORE SAVED";


    } catch (error) {

        console.error(error);


        saveStatus.textContent =
            "⚠ Gagal menyimpan skor.";
    }
}


/* ==========================================
   PLAY AGAIN
========================================== */

playAgain.addEventListener(
    "click",
    () => {

        showScreen(
            gameScreen
        );

        startNewMaze();

    }
);


/* ==========================================
   QUIT GAME
========================================== */

quitButton.addEventListener(
    "click",
    () => {

        stopTimer();

        showScreen(
            homeScreen
        );

    }
);


/* ==========================================
   LEADERBOARD
========================================== */

openLeaderboard.addEventListener(
    "click",
    () => {

        showScreen(
            leaderboardScreen
        );

        loadLeaderboard();

    }
);


resultLeaderboard.addEventListener(
    "click",
    () => {

        showScreen(
            leaderboardScreen
        );

        loadLeaderboard();

    }
);


closeLeaderboard.addEventListener(
    "click",
    () => {

        showScreen(
            homeScreen
        );

    }
);


/* ==========================================
   LOAD LEADERBOARD
========================================== */

async function loadLeaderboard() {

    leaderboardList.innerHTML = `

        <div class="leader-loading">
            ⏳ Loading leaderboard...
        </div>

    `;


    if (
        API_URL ===
        "MASUKKAN_URL_GOOGLE_APPS_SCRIPT_DI_SINI"
    ) {

        leaderboardList.innerHTML = `

            <div class="leader-loading">
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

            <div class="leader-loading">
                ❌ Gagal memuat leaderboard.
            </div>

        `;
    }
}


/* ==========================================
   DISPLAY LEADERBOARD
========================================== */

function displayLeaderboard(
    data
) {

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        leaderboardList.innerHTML = `

            <div class="leader-loading">
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


    leaderboardList.innerHTML =
        "";


    data
        .slice(0, 20)
        .forEach(
            (item, index) => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "leader";


                element.innerHTML = `

                    <div class="leader-rank">
                        ${getRank(index)}
                    </div>

                    <div class="leader-info">

                        <div class="leader-name">
                            ${escapeHTML(
                                item.username
                            )}
                        </div>

                   
