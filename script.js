// ================================
// KONFIGURASI GAME
// ================================

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 40;

// 1 = tembok
// 0 = jalan
// P = pemain
// E = exit

const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];


// POSISI AWAL PLAYER

let player = {
    x: 1,
    y: 1
};


// POSISI EXIT

const exit = {
    x: 11,
    y: 9
};


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
