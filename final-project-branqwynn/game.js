let canvas;
let context;

const canvasWidth = 800;
const canvasHeight = 550;
const ballSize = 20;
const initialSpeed = 15;
const playerWidth = 15;
const playerHeight = 100;

let xLocation = canvasWidth / 2;
let yLocation = canvasHeight / 2;
let xSpeed = initialSpeed;
let ySpeed = initialSpeed;

let player1XLocation = ballSize + playerWidth * 2;
let player2XLocation = canvasWidth - ballSize - playerWidth * 3;
let player1YLocation = canvasHeight / 2 - playerHeight / 2;
let player2YLocation = canvasHeight / 2 - playerHeight / 2;
const playerSpeed = 17;

let player1Score = 3;
let player2Score = 3;

let isUpKeyPressed = false;
let isDownKeyPressed = false;

let prevPlayer2Location;
let isGameOnGoing = false;

let loop;
let replayLoop;

window.onload = () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.font = "48px arial";
  context.fillRect(xLocation, yLocation, ballSize, ballSize);
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillText("Press any key or click to play", 150, 250, 500, 500);
  addKeyControls();
  addSwipeControls();
  loop = setInterval(gameLoop, 1000 / 30);
};

function gameLoop() {
  if (!isGameOnGoing) return;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  movePlayer2();
  movePlayer1();
  moveBall();
  checkForCollision();
  drawScore();
  checkForPoint();
  checkForWin();
}

function checkForWin() {
  if (player2Score === 0 || player1Score === 0) {
    isGameOnGoing = false;
    clearInterval(loop);
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillText(
      "Press any key or click to play again",
      150,
      325,
      500,
      500
    );
    if (player2Score === 0) {
      context.fillText("You Win!", 300, 250, 500, 500);
    } else if (player1Score === 0) {
      context.fillText("You Lose", 300, 250, 500, 500);
    }
    xLocation = canvasWidth / 2;
    yLocation = canvasHeight / 2;
    player1XLocation = ballSize + playerWidth * 2;
    player2XLocation = canvasWidth - ballSize - playerWidth * 3;
    player1YLocation = canvasHeight / 2 - playerHeight / 2;
    player2YLocation = canvasHeight / 2 - playerHeight / 2;
    player1Score = 3;
    player2Score = 3;
    replayLoop = setInterval((e) => {
      if (isGameOnGoing) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawScore();
        context.fillRect(
          player1XLocation,
          player1YLocation,
          playerWidth,
          playerHeight
        );
        context.fillRect(
          player2XLocation,
          player2YLocation,
          playerWidth,
          playerHeight
        );
        context.fillRect(xLocation, yLocation, ballSize, ballSize);
        setTimeout((e) => (loop = setInterval(gameLoop, 1000 / 30)), 1000);
        clearInterval(replayLoop);
      }
    });
  }
}

function addSwipeControls() {
  let initialPosition = null;

  document.addEventListener(
    "touchstart",
    (e) => {
      initialPosition = e.touches[0].clientY;
    },
    false
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      let newPosition = e.touches[0].clientY;

      if (newPosition < initialPosition) {
        isDownKeyPressed = false;
        isUpKeyPressed = true;
      } else {
        isUpKeyPressed = false;
        isDownKeyPressed = true;
      }
      xDown = null;
      yDown = null;
    },
    false
  );
  document.addEventListener("touchend", (e) => {
    isDownKeyPressed = false;
    isUpKeyPressed = false;
  });
}

function checkForCollision() {
  if (xLocation <= player1XLocation + playerWidth) {
    if (
      yLocation >= player1YLocation &&
      yLocation <= player1YLocation + playerHeight
    ) {
      xSpeed = -xSpeed;
      if (isUpKeyPressed) ySpeed = initialSpeed + 8;
      if (isDownKeyPressed) ySpeed = -initialSpeed - 8;
    }
  }
  if (xLocation + ballSize >= player2XLocation) {
    if (
      yLocation >= player2YLocation &&
      yLocation <= player2YLocation + playerHeight
    ) {
      xSpeed = -xSpeed;
      if (prevPlayer2Location < player2YLocation) {
        ySpeed = -initialSpeed - 6;
      } else {
        ySpeed = initialSpeed + 6;
      }
    }
  }
  prevPlayer2Location = player2YLocation;
}

function drawScore() {
  if (!isGameOnGoing) return;
  context.fillText(player1Score, 10, 50, 500, 500);
  context.fillText(player2Score, canvasWidth - 40, 50, 500, 500);
}

function movePlayer1() {
  if (!isGameOnGoing) return;
  if (isUpKeyPressed && player1YLocation >= 0) player1YLocation -= playerSpeed;
  if (isDownKeyPressed && player1YLocation <= canvasHeight - playerHeight)
    player1YLocation += playerSpeed;
  context.fillRect(
    player1XLocation,
    player1YLocation,
    playerWidth,
    playerHeight
  );
}

function movePlayer2() {
  if (!isGameOnGoing) return;
  if (xSpeed === initialSpeed) {
    if (player2YLocation >= yLocation) {
      if (player2YLocation >= 0) player2YLocation -= playerSpeed;
    } else {
      if (player2YLocation <= canvasHeight - playerHeight)
        player2YLocation += playerSpeed;
    }
  }
  context.fillRect(
    player2XLocation,
    player2YLocation,
    playerWidth,
    playerHeight
  );
}

function addKeyControls() {
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") isUpKeyPressed = true;
    if (e.code === "ArrowDown") isDownKeyPressed = true;
  });
  document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowUp") isUpKeyPressed = false;
    if (e.code === "ArrowDown") isDownKeyPressed = false;
  });
  document.addEventListener("keydown", (e) => {
    if (!isGameOnGoing) isGameOnGoing = true;
  });
  document.addEventListener("click", (e) => {
    if (!isGameOnGoing) isGameOnGoing = true;
  });
}

function relocateBall() {
  xLocation = canvasWidth / 2;
  yLocation = canvasHeight / 2;
  if (Math.floor(Math.random(2) * 2) === 1) xSpeed = initialSpeed;
  else xSpeed = -initialSpeed;
  if (Math.floor(Math.random(2) * 2) === 1) ySpeed = initialSpeed;
  else ySpeed = -initialSpeed;
}

function checkForPoint() {
  if (xLocation + ballSize * 1.5 >= canvasWidth) {
    player2Score--;
    context.clearRect(xLocation, yLocation, ballSize, ballSize);
    context.clearRect(0, 0, 1000, 100);
    context.fillText(player1Score, 10, 50, 500, 500);
    context.fillText(player2Score, canvasWidth - 40, 50, 500, 500);
    xLocation = canvasWidth / 2 - ballSize;
    yLocation = canvasHeight / 2 - ballSize / 3;
    xSpeed = 0;
    ySpeed = 0;
    player2YLocation = canvasHeight / 2 - playerHeight / 2;
    setTimeout(relocateBall, 1000);
  }
  if (xLocation <= 0 + ballSize) {
    player1Score--;
    context.clearRect(xLocation, yLocation, ballSize, ballSize);
    context.clearRect(0, 0, 1000, 100);
    context.fillText(player1Score, 10, 50, 500, 500);
    context.fillText(player2Score, canvasWidth - 40, 50, 500, 500);
    xLocation = canvasWidth / 2 - ballSize;
    yLocation = canvasHeight / 2 - ballSize / 3;
    xSpeed = 0;
    ySpeed = 0;
    player2YLocation = canvasHeight / 2 - playerHeight / 2;
    setTimeout(relocateBall, 1000);
  }
}

function moveBall() {
  if (!isGameOnGoing) return;
  if (yLocation + ballSize >= canvasHeight) {
    if (ySpeed > 10) {
      ySpeed = initialSpeed - 0.5;
    } else {
      ySpeed = initialSpeed;
    }
  }
  if (yLocation <= 0) {
    if (ySpeed < -10) {
      ySpeed = -initialSpeed + 0.5;
    } else {
      ySpeed = -initialSpeed;
    }
  }
  xLocation += xSpeed;
  yLocation -= ySpeed;

  context.fillRect(xLocation, yLocation, ballSize, ballSize);
}
