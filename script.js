// キャンバス設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 320;

// テスト: 赤い四角を描く
ctx.fillStyle = "red";
ctx.fillRect(50, 50, 100, 100);


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;

// ボールの設定
const ballImage = new Image();
ballImage.src = "rome.png"; // ここに画像ファイルを指定

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 2,
    dy: -2
};

// パドルの設定
const paddle = {
    width: 75,
    height: 10,
    x: (canvas.width - 75) / 2,
    dx: 7
};

// キーボード操作
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// 描画関数
function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function drawPaddle() {
    ctx.fillStyle = "#09f";
    ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
}

// ゲームループ
function update() {
    // ボール移動
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 壁の反射
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
    if (ball.y - ball.radius < 0) ball.dy *= -1;

    // パドルとの衝突
    if (ball.y + ball.radius > canvas.height - paddle.height && 
        ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy *= -1;
    }

    // ゲームオーバー
    if (ball.y + ball.radius > canvas.height) {
        document.location.reload();
    }

    // パドル移動
    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += paddle.dx;
    if (leftPressed && paddle.x > 0) paddle.x -= paddle.dx;
}

// ループ処理
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    update();
    requestAnimationFrame(gameLoop);
}

// ゲーム開始
ballImage.onload = () => {
    gameLoop();
};
