var Canvas = document.getElementById("canvas");
var ctx = Canvas.getContext("2d");

var gridSize = 120;
var startAngle = (2*Math.PI);
var endAngle = (Math.PI*1.5);
var centerX = (Math.floor((Canvas.width/2)/gridSize) * gridSize) + gridSize/2;
var centerY = (Math.floor((Canvas.height/2)/gridSize) * gridSize) + gridSize/2;
var currentAngle = 0;
var radius = 200;
var mass = 200;
var G = 6.67408e-11;
var velocity = 0.0001;
updateVelocity();

var oldTime = getTime();

function getTime() {
  return (new Date()).getTime();
}


var raf = window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

function updateRadius() {
  radius = document.getElementById('radius').value;
  updateVelocity();
}

function updateMass() {
  mass = document.getElementById('mass').value;
  updateVelocity();
}

function updateVelocity() {
  velocity = Math.sqrt((G*mass)/radius);
  console.log(velocity);
}

document.getElementById('radius').onchange = updateRadius;
document.getElementById('mass').onchange = updateMass;

function Update(){
    var newTime = getTime(),
        diff = newTime - oldTime;

    oldTime = newTime;

    var x = radius * Math.cos(currentAngle) + centerX;
    var y = radius * Math.sin(currentAngle) + centerY;



    //Clears
    ctx.clearRect(0,0,Canvas.width,Canvas.height);

    //Planet
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      20,
      0,
      2 * Math.PI,
      false
     );

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 11.0;
    ctx.stroke();
    ctx.fillStyle = '#339977';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      30,
      0,
      2 * Math.PI,
      false
    );

    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.floor(x / gridSize) * gridSize, Math.floor(y / gridSize) * gridSize, gridSize, gridSize);

    ctx.strokeStyle = "orange";
    ctx.lineWidth = 11.0;
    ctx.stroke();
    ctx.fillStyle = '#cc6611';
    ctx.fill();

    drawGrid();

    currentAngle += diff * velocity;

    currentAngle %= 2 * Math.PI;

    document.getElementById("angle").innerHTML=currentAngle;
    raf(Update);
}

function drawGrid() {
  ctx.strokeStyle = '#dadada';
  ctx.lineWidth = 1;
  for (let x = 0; x < Canvas.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, Canvas.height);
  }
  for (let y = 0; y < Canvas.width; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(Canvas.width, y);
  }
  ctx.stroke();
}
raf(Update);
