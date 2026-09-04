// ============================================
// MAZE ESCAPE - SCRIPT
// ============================================

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const MAZE_WIDTH = 25;
const MAZE_HEIGHT = 25;
const cellSize = 24;


// ============================================
// GENERATE MAZE
// ============================================

function generateMaze() {

    const maze = Array.from(
        { length: MAZE_HEIGHT },
        () => Array(MAZE_WIDTH).fill(1)
    );

    function shuffle(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(
                Math.random() * (i + 1)
            );

            [array[i], array[j]] =
            [array[j], array[i]];
        }

        return array;
    }


    function carve(x, y) {

        maze[y][x] = 0;

        const directions = shuffle([
            [0, -2],
            [2, 0],
            [0, 2],
            [-2, 0]
        ]);

        for (const [dx, dy] of directions) {

            const nx = x + dx;
            const ny = y + dy;

            if (
                nx > 0 &&
                nx < MAZE_WIDTH - 1 &&
                ny > 0 &&
                ny < MAZE_HEIGHT - 1 &&
                maze[ny][nx] === 1
            ) {

                maze[y + dy / 2][x + dx / 2] = 0;

                carve(nx, ny);
            }
        }
    }

    carve(1, 1);

    return maze;
}


// ============================================
// CEK JALUR KE EXIT
// ============================================

function isSolvable(maze) {

    const start = {
        x: 1,
        y: 1
    };

    const target = {
        x: MAZE_WIDTH - 2,
        y: MAZE_HEIGHT - 2
    };

    const queue = [start];

    const visited = Array.from(
        { length: MAZE_HEIGHT },
        () => Array(MAZE_WIDTH).fill(false)
    );

    visited[start.y][start.x] = true;

    const directions = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
    ];

    while (queue.length > 0) {

        const current = queue.shift();

        if (
            current.x === target.x &&
            current.y === target.y
        ) {
            return true;
        }

        for (const [dx, dy] of directions) {

            const nx = current.x + dx;
            const ny = current.y + dy;

            if (
                nx >= 0 &&
                nx < MAZE_WIDTH &&
                ny >= 0 &&
                ny < MAZE_HEIGHT &&
                maze[ny][nx] === 0 &&
                !visited[ny][nx]
            ) {

                visited[ny][nx] = true;

                queue.push({
                    x: nx,
                    y: ny
                });
            }
        }
    }

    return false;
}


// ============================================
// BUAT LABIRIN YANG PASTI BISA DISELESAIKAN
// ============================================

function createMaze() {

    let newMaze;

    do {
        newMaze = generateMaze();
    }
    while (!isSolvable(newMaze));

    return newMaze;
}


let maze = createMaze();


// ============================================
// PLAYER
// ============================================

let player = {
    x: 1,
    y: 1
};


// ============================================
// EXIT
// ============================================

const exit = {
    x: MAZE_WIDTH - 2,
    y: MAZE_HEIGHT - 2
};


// ============================================
// CANVAS
// ============================================

canvas.width = MAZE_WIDTH * cellSize;
canvas.height = MAZE_HEIGHT * cellSize;


// ============================================
// DATA PLAYER
// ============================================

let username = "";
let whatsapp = "";


// ============================================
// TIMER
// ============================================

let startTime = 0;
let timerInterval = null;
let gameRunning = false;


// ============================================
// MULAI GAME
// ============================================

function startGame() {

    username =
        document.getElementById("username")
        .value.trim();

    whatsapp =
        document.getElementById("whatsapp")
        .value.trim();

    const error =
        document.getElementById("error");


    if (username === "") {

        error.textContent =
            "Username wajib diisi!";

        return;
    }


    if (whatsapp === "") {

        error.textContent =
            "Nomor WhatsApp wajib diisi!";

        return;
    }


    if (whatsapp.length < 10) {

        error.textContent =
            "Nomor WhatsApp tidak valid!";

        return;
    }


    error.textContent = "";


    // Buat labirin baru
    maze = createMaze();


    // Kembali ke START
    player.x = 1;
    player.y = 1;


    // Pindah layar
    document
        .getElementById("menu")
        .classList.add("hidden");

    document
        .getElementById("gameScreen")
        .classList.remove("hidden");


    document
        .getElementById("playerName")
        .textContent = username;


    // Mulai timer
    startTimer();

    gameRunning = true;

    drawMaze();
}


// ============================================
// GAMBAR LABIRIN
// ============================================

function drawMaze() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        let y = 0;
        y < MAZE_HEIGHT;
        y++
    ) {

        for (
            let x = 0;
            x < MAZE_WIDTH;
            x++
        ) {

            const px = x * cellSize;
            const py = y * cellSize;


            // TEMBOK
            if (maze[y][x] === 1) {

                ctx.fillStyle = "#263238";

            }

            // JALAN
            else {

                ctx.fillStyle = "#eeeeee";
            }


            ctx.fillRect(
                px,
                py,
                cellSize,
                cellSize
            );


            // GRID
            ctx.strokeStyle = "#aab0b3";

            ctx.strokeRect(
                px,
                py,
                cellSize,
                cellSize
            );
        }
    }


    // ========================================
    // EXIT
    // ========================================

    ctx.fillStyle = "#00c853";

    ctx.fillRect(
        exit.x * cellSize + 3,
        exit.y * cellSize + 3,
        cellSize - 6,
        cellSize - 6
    );


    ctx.font = "17px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "🚪",
        exit.x * cellSize + cellSize / 2,
        exit.y * cellSize + cellSize / 2
    );


    // ========================================
    // PLAYER
    // ========================================

    ctx.fillStyle = "#1976d2";

    ctx.beginPath();

    ctx.arc(
        player.x * cellSize + cellSize / 2,
        player.y * cellSize + cellSize / 2,
        cellSize * 0.32,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // mata player
    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        player.x * cellSize + 8,
        player.y * cellSize + 9,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        player.x * cellSize + 16,
        player.y * cellSize + 9,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ============================================
// GERAK PLAYER
// ============================================

function movePlayer(dx, dy) {

    if (!gameRunning) {
        return;
    }


    const newX = player.x + dx;
    const newY = player.y + dy;


    // Batas
    if (
        newX < 0 ||
        newX >= MAZE_WIDTH ||
        newY < 0 ||
        newY >= MAZE_HEIGHT
    ) {
        return;
    }


    // Tembok
    if (maze[newY][newX] === 1) {
        return;
    }


    // Pindahkan player
    player.x = newX;
    player.y = newY;


    drawMaze();


    // Cek exit
    if (
        player.x === exit.x &&
        player.y === exit.y
    ) {

        finishGame();
    }
}


// ============================================
// KEYBOARD
// ============================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {
            return;
        }


        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === "W"
        ) {

            event.preventDefault();

            movePlayer(0, -1);
        }


        if (
            event.key === "ArrowDown" ||
            event.key === "s" ||
            event.key === "S"
        ) {

            event.preventDefault();

            movePlayer(0, 1);
        }


        if (
            event.key === "ArrowLeft" ||
            event.key === "a" ||
            event.key === "A"
        ) {

            event.preventDefault();

            movePlayer(-1, 0);
        }


        if (
            event.key === "ArrowRight" ||
            event.key === "d" ||
            event.key === "D"
        ) {

            event.preventDefault();

            movePlayer(1, 0);
        }

    }
);


// ============================================
// TIMER
// ============================================

function startTimer() {

    clearInterval(timerInterval);

    startTime = Date.now();


    timerInterval = setInterval(
        function() {

            const elapsed =
                (Date.now() - startTime) / 1000;


            document
                .getElementById("timer")
                .textContent =
                elapsed.toFixed(2);

        },
        50
    );
}


// ============================================
// SELESAI
// ============================================

function finishGame() {

    gameRunning = false;

    clearInterval(timerInterval);


    const finalTime =
        (Date.now() - startTime) / 1000;


    const time =
        parseFloat(finalTime.toFixed(2));


    document
        .getElementById("resultName")
        .textContent = username;


    document
        .getElementById("resultTime")
        .textContent = time.toFixed(2);


    saveScore(
        username,
        whatsapp,
        time
    );


    document
        .getElementById("gameScreen")
        .classList.add("hidden");


    document
        .getElementById("resultScreen")
        .classList.remove("hidden");
}


// ============================================
// RESET POSISI
// ============================================

function resetPosition() {

    if (!gameRunning) {
        return;
    }

    player.x = 1;
    player.y = 1;

    drawMaze();
}


// ============================================
// SIMPAN SCORE
// ============================================

function saveScore(name, phone, time) {

    let scores =
        JSON.parse(
            localStorage.getItem("mazeScores")
        ) || [];


    scores.push({
        name: name,
        phone: phone,
        time: time,
        date: new Date()
            .toLocaleDateString("id-ID")
    });


    scores.sort(
        (a, b) => a.time - b.time
    );


    scores =
        scores.slice(0, 20);


    localStorage.setItem(
        "mazeScores",
        JSON.stringify(scores)
    );
}


// ============================================
// LEADERBOARD
// ============================================

function showLeaderboard() {

    document
        .getElementById("menu")
        .classList.add("hidden");


    document
        .getElementById("resultScreen")
        .classList.add("hidden");


    document
        .getElementById("leaderboardScreen")
        .classList.remove("hidden");


    const container =
        document.getElementById(
            "leaderboardList"
        );


    let scores =
        JSON.parse(
            localStorage.getItem("mazeScores")
        ) || [];


    if (scores.length === 0) {

        container.innerHTML =
            "<p>Belum ada pemain.</p>";

        return;
    }


    container.innerHTML = "";


    scores.forEach(
        function(score, index) {

            const div =
                document.createElement("div");


            div.className = "rank";


            let medal;


            if (index === 0) {
                medal = "🥇";
            }
            else if (index === 1) {
                medal = "🥈";
            }
            else if (index === 2) {
                medal = "🥉";
            }
            else {
                medal = index + 1;
            }


            div.innerHTML = `
                <span class="rank-number">
                    ${medal}
                </span>

                <span class="rank-name">
                    ${escapeHTML(score.name)}
                </span>

                <span class="rank-time">
                    ${score.time.toFixed(2)}s
                </span>
            `;


            container.appendChild(div);
        }
    );
}


// ============================================
// KEMBALI MENU
// ============================================

function backToMenu() {

    document
        .getElementById("leaderboardScreen")
        .classList.add("hidden");


    document
        .getElementById("resultScreen")
        .classList.add("hidden");


    document
        .getElementById("menu")
        .classList.remove("hidden");
}


// ============================================
// MAIN LAGI
// ============================================

function restartGame() {

    document
        .getElementById("resultScreen")
        .classList.add("hidden");


    document
        .getElementById("gameScreen")
        .classList.remove("hidden");


    maze = createMaze();


    player.x = 1;
    player.y = 1;


    gameRunning = true;


    startTimer();

    drawMaze();
}


// ============================================
// SECURITY
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
    }

// ==========================================
// BUTTON EVENT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const startButton =
        document.getElementById("startButton");

    const leaderboardButton =
        document.getElementById("leaderboardButton");

    const upButton =
        document.getElementById("upButton");

    const downButton =
        document.getElementById("downButton");

    const leftButton =
        document.getElementById("leftButton");

    const rightButton =
        document.getElementById("rightButton");

    const resetButton =
        document.getElementById("resetButton");


    // MULAI GAME
    if (startButton) {

        startButton.addEventListener(
            "click",
            function () {

                startGame();

            }
        );
    }


    // LEADERBOARD
    if (leaderboardButton) {

        leaderboardButton.addEventListener(
            "click",
            function () {

                showLeaderboard();

            }
        );
    }


    // ATAS
    if (upButton) {

        upButton.addEventListener(
            "click",
            function () {

                movePlayer(0, -1);

            }
        );
    }


    // BAWAH
    if (downButton) {

        downButton.addEventListener(
            "click",
            function () {

                movePlayer(0, 1);

            }
        );
    }


    // KIRI
    if (leftButton) {

        leftButton.addEventListener(
            "click",
            function () {

                movePlayer(-1, 0);

            }
        );
    }


    // KANAN
    if (rightButton) {

        rightButton.addEventListener(
            "click",
            function () {

                movePlayer(1, 0);

            }
        );
    }


    // RESET
    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                resetPosition();

            }
        );
    }

});
