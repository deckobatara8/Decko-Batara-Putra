// ================================
// KONFIGURASI GAME
// ================================

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// ==========================================
// LABIRIN RANDOM - DIJAMIN BISA DISELESAIKAN
// ==========================================

const MAZE_WIDTH = 25;
const MAZE_HEIGHT = 25;
const cellSize = 24;


// ==========================================
// BUAT LABIRIN
// ==========================================

function createMaze() {

    let maze;

    do {
        maze = generateMaze();

    } while (!isMazeSolvable(maze));

    return maze;
}


// ==========================================
// GENERATOR LABIRIN
// ==========================================

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

                maze[
                    y + dy / 2
                ][
                    x + dx / 2
                ] = 0;


                carve(nx, ny);
            }
        }
    }


    // START
    carve(1, 1);


    // Pastikan START terbuka
    maze[1][1] = 0;


    // Pastikan EXIT terbuka
    maze[MAZE_HEIGHT - 2][MAZE_WIDTH - 2] = 0;


    return maze;
}


// ==========================================
// CEK APAKAH ADA JALAN KE EXIT
// ==========================================

function isMazeSolvable(maze) {

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


        // EXIT DITEMUKAN
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


// ==========================================
// BUAT LABIRIN
// ==========================================

const maze = createMaze();


// ==========================================
// PLAYER
// ==========================================

let player = {
    x: 1,
    y: 1
};


// ==========================================
// EXIT
// ==========================================

const exit = {
    x: MAZE_WIDTH - 2,
    y: MAZE_HEIGHT - 2
};


// ==========================================
// CANVAS
// ==========================================

const canvas =
    document.getElementById("mazeCanvas");

const ctx =
    canvas.getContext("2d");


canvas.width =
    MAZE_WIDTH * cellSize;

canvas.height =
    MAZE_HEIGHT * cellSize;


// DATA PEMAIN

let username = "";
let whatsapp = "";


// TIMER

let startTime = 0;
let timerInterval = null;
let gameRunning = false;


// ================================
// UKURAN CANVAS
// ================================

canvas.width = maze[0].length * cellSize;
canvas.height = maze.length * cellSize;


// ================================
// MULAI GAME
// ================================

function startGame() {

    username = document.getElementById("username").value.trim();
    whatsapp = document.getElementById("whatsapp").value.trim();

    const error = document.getElementById("error");

    if (username === "") {
        error.textContent = "Username wajib diisi!";
        return;
    }

    if (whatsapp === "") {
        error.textContent = "Nomor WhatsApp wajib diisi!";
        return;
    }

    if (whatsapp.length < 10) {
        error.textContent = "Nomor WhatsApp tidak valid!";
        return;
    }

    error.textContent = "";

    player.x = 1;
    player.y = 1;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");

    document.getElementById("playerName").textContent = username;

    startTimer();
    drawMaze();

    gameRunning = true;
}


// ================================
// GAMBAR LABIRIN
// ================================

function drawMaze() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (let y = 0; y < maze.length; y++) {

        for (let x = 0; x < maze[y].length; x++) {

            const px = x * cellSize;
            const py = y * cellSize;

            // TEMBOK

            if (maze[y][x] === 1) {

                ctx.fillStyle = "#263238";

                ctx.fillRect(
                    px,
                    py,
                    cellSize,
                    cellSize
                );

            } else {

                // JALAN

                ctx.fillStyle = "#eeeeee";

                ctx.fillRect(
                    px,
                    py,
                    cellSize,
                    cellSize
                );
            }

            // GRID

            ctx.strokeStyle = "#cccccc";

            ctx.strokeRect(
                px,
                py,
                cellSize,
                cellSize
            );
        }
    }


    // EXIT

    ctx.fillStyle = "#00c853";

    ctx.fillRect(
        exit.x * cellSize + 5,
        exit.y * cellSize + 5,
        cellSize - 10,
        cellSize - 10
    );

    ctx.fillStyle = "white";

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "🚪",
        exit.x * cellSize + cellSize / 2,
        exit.y * cellSize + cellSize / 2
    );


    // PLAYER

    ctx.fillStyle = "#1976d2";

    ctx.beginPath();

    ctx.arc(
        player.x * cellSize + cellSize / 2,
        player.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // PLAYER FACE

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        player.x * cellSize + 14,
        player.y * cellSize + 16,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        player.x * cellSize + 26,
        player.y * cellSize + 16,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ================================
// GERAK PLAYER
// ================================

function movePlayer(dx, dy) {

    if (!gameRunning) return;

    const newX = player.x + dx;
    const newY = player.y + dy;


    // CEK BATAS

    if (
        newY < 0 ||
        newY >= maze.length ||
        newX < 0 ||
        newX >= maze[0].length
    ) {
        return;
    }


    // CEK TEMBOK

    if (maze[newY][newX] === 1) {
        return;
    }


    // PINDAHKAN PLAYER

    player.x = newX;
    player.y = newY;

    drawMaze();


    // CEK EXIT

    if (
        player.x === exit.x &&
        player.y === exit.y
    ) {

        finishGame();
    }
}


// ================================
// KEYBOARD
// ================================

document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;

    switch (event.key) {

        case "ArrowUp":
            movePlayer(0, -1);
            break;

        case "ArrowDown":
            movePlayer(0, 1);
            break;

        case "ArrowLeft":
            movePlayer(-1, 0);
            break;

        case "ArrowRight":
            movePlayer(1, 0);
            break;
    }
});


// ================================
// TIMER
// ================================

function startTimer() {

    startTime = Date.now();

    clearInterval(timerInterval);

    timerInterval = setInterval(function() {

        const elapsed =
            (Date.now() - startTime) / 1000;

        document.getElementById("timer")
            .textContent = elapsed.toFixed(2);

    }, 50);
}


// ================================
// SELESAI GAME
// ================================

function finishGame() {

    gameRunning = false;

    clearInterval(timerInterval);

    const finalTime =
        (Date.now() - startTime) / 1000;

    const roundedTime =
        finalTime.toFixed(2);


    document.getElementById("resultName")
        .textContent = username;

    document.getElementById("resultTime")
        .textContent = roundedTime;


    // SIMPAN LEADERBOARD

    saveScore(
        username,
        whatsapp,
        parseFloat(roundedTime)
    );


    document.getElementById("gameScreen")
        .classList.add("hidden");

    document.getElementById("resultScreen")
        .classList.remove("hidden");
}


// ================================
// SIMPAN SCORE
// ================================

function saveScore(name, phone, time) {

    let scores =
        JSON.parse(
            localStorage.getItem("mazeScores")
        ) || [];


    scores.push({
        name: name,
        phone: phone,
        time: time,
        date: new Date().toLocaleDateString("id-ID")
    });


    // URUTKAN WAKTU TERCEPAT

    scores.sort(function(a, b) {
        return a.time - b.time;
    });


    // HANYA SIMPAN TOP 20

    scores = scores.slice(0, 20);


    localStorage.setItem(
        "mazeScores",
        JSON.stringify(scores)
    );
}


// ================================
// LEADERBOARD
// ================================

function showLeaderboard() {

    document.getElementById("menu")
        .classList.add("hidden");

    document.getElementById("resultScreen")
        .classList.add("hidden");

    document.getElementById("leaderboardScreen")
        .classList.remove("hidden");


    const container =
        document.getElementById("leaderboardList");


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


    scores.forEach(function(score, index) {

        const div =
            document.createElement("div");

        div.className = "rank";

        let medal = "";

        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";
        else medal = index + 1;


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
    });
}


// ================================
// KEMBALI MENU
// ================================

function backToMenu() {

    document.getElementById("leaderboardScreen")
        .classList.add("hidden");

    document.getElementById("menu")
        .classList.remove("hidden");
}


// ================================
// MAIN LAGI
// ================================

function restartGame() {

    document.getElementById("resultScreen")
        .classList.add("hidden");

    document.getElementById("gameScreen")
        .classList.remove("hidden");


    player.x = 1;
    player.y = 1;

    startTimer();

    gameRunning = true;

    drawMaze();
}


// ================================
// KEAMANAN OUTPUT USERNAME
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
                          }

function resetPosition() {

    if (!gameRunning) return;

    player.x = 1;
    player.y = 1;

    drawMaze();
}
