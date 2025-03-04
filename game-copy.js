// キャンバスの取得
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 320;

// ボールの設定（画像を使用）
const ballImage = new Image();
ballImage.src = "BB.png";  // ボールの画像を指定
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 2,
    dy: -2,
    speed: 2
};

// パドルの設定
const paddle = {
    width: 75,
    height: 10,
    x: (canvas.width - 75) / 2,
    dx: 5
};

// ブロックの設定
const brick = {
    rowCount: 5,
    columnCount: 8,
    width: 50,
    height: 20,
    padding: 5,
    offsetTop: 30,
    offsetLeft: 20
};

// ブロックの作成
let bricks = [];
for (let c = 0; c < brick.columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brick.rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// ゲームの状態管理
let rightPressed = false;
let leftPressed = false;
let gameOver = false;
let gameClear = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keydown", retryGame);  // Enterキーでリトライ

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// ボールの描画（画像）
function drawBall() {
        let scale = 4; // ボールを4倍のサイズにする
        let newSize = ball.radius * 2 * scale; 
        ctx.drawImage(ballImage, ball.x - newSize / 2, ball.y - newSize / 2, newSize, newSize);
    
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

// パドルの描画
function drawPaddle() {
    ctx.fillStyle = "blue";
    ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
}

// ブロックの描画
function drawBricks() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
                let brickY = r * (brick.height + brick.padding) + brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.fillStyle = "green";
                ctx.fillRect(brickX, brickY, brick.width, brick.height);
            }
        }
    }
}

// 衝突判定
function collisionDetection() {
    let allBroken = true; // すべて壊れたか判定
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                allBroken = false;
                if (ball.x > b.x && ball.x < b.x + brick.width &&
                    ball.y > b.y && ball.y < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                }
            }
        }
    }
    if (allBroken) {
        gameClear = true;
    }
}

// ゲームの更新処理
function update() {
    if (gameOver || gameClear) return;

    // ボールの移動
    ball.x += ball.dx;
    ball.y += ball.dy;

    // ボールが壁に当たったときの反射
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.radius > canvas.height) {
        gameOver = true;
    }

    // パドルとの衝突
    if (ball.y + ball.radius > canvas.height - paddle.height &&
        ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
    }

    // パドルの移動
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }

    collisionDetection();
}

// 描画処理
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Press Enter to Retry", 100, 160);
    }

    if (gameClear) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Press Enter to Retry", 100, 160);
    }
}

// リトライ処理
function retryGame(e) {
    if (e.key === "Enter" && (gameOver || gameClear)) {
        resetGame();
    }
}

// ゲームリセット
function resetGame() {
    gameOver = false;
    gameClear = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 2;
    ball.dy = -2;
    
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            bricks[c][r].status = 1;
        }
    }

    gameLoop();
}

// ゲームループ
function gameLoop() {
    if (!gameOver && !gameClear) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        draw();
    }
}

gameLoop();
