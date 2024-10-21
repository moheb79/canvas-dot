var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var resetButton = document.getElementById("reset");
var AddDotsButton = document.getElementById("AddDots");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let Gbest = undefined;

class Dot {
  constructor() {
    this.x = Math.floor(Math.random() * (window.innerWidth - 10));
    this.y = Math.floor(Math.random() * (window.innerHeight - 10));
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.radius = Math.floor(Math.random() * 3) + 3;
    this.x_speed = 0;
    this.y_speed = 0;
    this.initial_x = this.x;
    this.initial_y = this.y;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  move() {
    if (Gbest) {
      if (Math.abs(Gbest.x - this.x) < 5 && Math.abs(Gbest.y - this.y) < 5) {
        this.x = this.initial_x;
        this.y = this.initial_y;
        this.speed();
        return;
      }
      if (Gbest.x < this.x) {
        this.x_speed = Math.abs(this.x_speed) * -1;
      } else if (Gbest.x > this.x) {
        this.x_speed = Math.abs(this.x_speed);
      }
    }
    this.x += this.x_speed;
    let y_position;
    if (Gbest) {
      if (Gbest.y < this.y) {
        this.y_speed = Math.abs(this.y_speed) * -1;
        y_position = "top";
      } else if (Gbest.y > this.y) {
        this.y_speed = Math.abs(this.y_speed);
        y_position = "bottom";
      }
    }
    this.y += this.y_speed;
    if (
      (y_position === "top" && Gbest.y > this.y) ||
      (y_position === "bottom" && Gbest.y < this.y)
    ) {
      this.y_speed = Math.floor(this.y_speed / 2);
    }
  }
  speed() {
    let x_distance = Math.abs(Gbest.x - this.x);
    let y_distance = Math.abs(Gbest.y - this.y);
    let min_speed = Math.min(y_distance / x_distance, x_distance / y_distance);
    if (min_speed === y_distance / x_distance) {
      this.y_speed = (y_distance / x_distance) * 2;
      this.x_speed = (x_distance / y_distance) * this.y_speed;
    } else {
      this.x_speed = (x_distance / y_distance) * 2;
      this.y_speed = (y_distance / x_distance) * this.x_speed;
    }
  }
}

let dots = [];

function initializeDots() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  dots = [];
  Gbest = undefined;
  for (let i = 0; i < 100; i++) {
    dots.push(new Dot());
  }
  dots.forEach((item) => {
    item.draw();
  });
}

function addDots() {
  for (let i = 0; i < 10; i++) {
    const newDot = new Dot();
    dots.push(newDot);
    newDot.draw();
    if (Gbest) {
      newDot.speed();
      newDot.move();
    }
  }
}

initializeDots();

resetButton.addEventListener("click", initializeDots);
document.addEventListener("keypress", addDots);

var animationRequestId;

function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (Gbest) {
    ctx.beginPath();
    ctx.arc(Gbest.x, Gbest.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }
  dots.forEach((item) => {
    item.draw();
  });
  dots.forEach((item) => {
    item.move();
  });
  animationRequestId = requestAnimationFrame(animate);
}
let clickFlag = false;
canvas.addEventListener("mousemove", (event) => {
  // if (!Gbest) {
  Gbest = {
    x: event.pageX,
    y: event.pageY,
  };
  dots.forEach((item) => item.speed());
  // setTimeout(() => {
  //   Gbest = {
  //     x: event.pageX,
  //     y: event.pageY + 200,
  //   };
  //   dots.forEach((item) => item.speed());
  // }, 3000);
  // }
  // if (!clickFlag) {
  //   animationRequestId = requestAnimationFrame(animate);
  //   clickFlag = true;
  //   return;
  // } else {
  //   cancelAnimationFrame(animationRequestId);
  //   clickFlag = false;
  //   return;
  // }
});

requestAnimationFrame(animate);
