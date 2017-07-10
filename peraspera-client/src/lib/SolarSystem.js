var Canvas = document.getElementById("canvas");
var ctx = Canvas.getContext("2d");

var startAngle = (2*Math.PI);
var endAngle = (Math.PI*1.5);
var currentAngle = 0;
var radius = 200;

var oldTime = getTime();

function getTime() {
return (new Date()).getTime();
}

var raf = window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

function Update(){
    var newTime = getTime(),
        diff = newTime - oldTime;

    oldTime = newTime;

    //Clears
    ctx.clearRect(0,0,Canvas.width,Canvas.height);

    //Planet
    ctx.beginPath();
    ctx.arc(
      radius * Math.cos(currentAngle) + Canvas.width/2,
      radius * Math.sin(currentAngle) + Canvas.height/2,
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
      Canvas.width/2,
      Canvas.height/2,
      30,
      0,
      2 * Math.PI,
      false
    );

    ctx.strokeStyle = "orange";
    ctx.lineWidth = 11.0;
    ctx.stroke();
    ctx.fillStyle = '#cc6611';
    ctx.fill();

    currentAngle += diff * 0.0001;

    currentAngle %= 2 * Math.PI;

    document.getElementById("angle").innerHTML=currentAngle;
    raf(Update);
}
raf(Update);
