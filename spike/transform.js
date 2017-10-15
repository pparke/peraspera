// the demo function

function createCanvas() {
    var canvas = document.getElementById("canv");
    if(canvas !== null){
        document.body.removeChild(canvas);
    }
    // creates a blank image with 2d context
    canvas = document.createElement("canvas");
    canvas.id = "canv";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = 1000;
    canvas.ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    return canvas;
}

var demo = function(){
    /** fullScreenCanvas.js begin **/
    // create a full document canvas on top
    var canvas = createCanvas();
    var ctx = canvas.ctx;

    /** fullScreenCanvas.js end **/
    /** MouseFull.js begin **/
    // get the mouse data . This is a generic mouse handler I use  so a little over kill for this example
    var canvasMouseCallBack = undefined;  // if needed
    var mouse = (function(){
        var mouse = {
            x : 0, y : 0, w : 0, alt : false, shift : false, ctrl : false,
            interfaceId : 0, buttonLastRaw : 0,  buttonRaw : 0,
            over : false,  // mouse is over the element
            bm : [1, 2, 4, 6, 5, 3], // masks for setting and clearing button raw bits;
            getInterfaceId : function () { return this.interfaceId++; }, // For UI functions
            startMouse:undefined,
        };
        function mouseMove(e) {
            var t = e.type, m = mouse;
            m.x = e.offsetX; m.y = e.offsetY;
            if (m.x === undefined) { m.x = e.clientX; m.y = e.clientY; }
            m.alt = e.altKey;m.shift = e.shiftKey;m.ctrl = e.ctrlKey;
            if (t === "mousedown") { m.buttonRaw |= m.bm[e.which-1];
            } else if (t === "mouseup") { m.buttonRaw &= m.bm[e.which + 2];
            } else if (t === "mouseout") { m.buttonRaw = 0; m.over = false;
            } else if (t === "mouseover") { m.over = true;
            } else if (t === "mousewheel") { m.w = e.wheelDelta;
            } else if (t === "DOMMouseScroll") { m.w = -e.detail;}
            if (canvasMouseCallBack) { canvasMouseCallBack(m.x, m.y); }
            e.preventDefault();
        }
        function startMouse(element){
            if(element === undefined){
                element = document;
            }
            "mousemove,mousedown,mouseup,mouseout,mouseover,mousewheel,DOMMouseScroll".split(",").forEach(
            function(n){element.addEventListener(n, mouseMove);});
            element.addEventListener("contextmenu", function (e) {e.preventDefault();}, false);
        }
        mouse.mouseStart = startMouse;
        return mouse;
    })();
    if(typeof canvas === "undefined"){
        mouse.mouseStart();
    }else{
        mouse.mouseStart(canvas);
    }
    /** MouseFull.js end **/


    // some stuff to draw a grid
    var gridStart= -(canvas.width/10)*4;
    var gridEnd = (canvas.width/10)*14;
    var gridStepMajor = canvas.width/10;
    var gridStepMinor = canvas.width/20;
    var minorCol = "#999";
    var majorCol = "#000";
    var minorWidth = 1;
    var majorWidth = 3;

    // some stuf to animate the transformation
    var timer = 0;
    var timerStep = 0.01;


    //----------------------------------------------------------------------------
    // the code from the answer
    var matrix = [1, 0, 0, 1, 0, 0];      // normal matrix
    var invMatrix = [1, 0, 0, 1];   // inverse matrix
    function createMatrix(x, y, scale, rotate){
        var m = matrix; // just to make it easier to type and read
        var im = invMatrix; // just to make it easier to type and read
        // create the scale and rotation part of the matrix
        m[3] =   m[0] = Math.cos(rotate) * scale;
        m[2] = -(m[1] = Math.sin(rotate) * scale);
        // translation
        m[4] = x;
        m[5] = y;

        // calculate the inverse transformation
        // first get the cross product of x axis and y axis
        cross = m[0] * m[3] - m[1] * m[2];
        // now get the inverted axies
        im[0] =  m[3] / cross;
        im[1] = -m[1] / cross;
        im[2] = -m[2] / cross;
        im[3] =  m[0] / cross;
     }

    // function to transform to world space
    function toWorld(x,y){
        var xx, yy, m;
        m = invMatrix;
        xx = x - matrix[4];
        yy = y - matrix[5];
        return {
           x:   xx * m[0] + yy * m[2] ,
           y:   xx * m[1] + yy * m[3]
        }
    }
    //----------------------------------------------------------------------------


    // center of canvas
    var cw = canvas.width / 2;
    var ch = canvas.height / 2;


    // the main loop
    function update(){
        var i,x,y,s;
        ctx.setTransform(1, 0, 0, 1, 0, 0);  // reset the transform so we can clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear the canvas


        // animate the transformation
        timer += timerStep;
        x = Math.cos(timer) * gridStepMajor * 5 + cw;  // position
        y = Math.sin(timer) * gridStepMajor * 5 + ch;
        s = Math.sin(timer/1.2) + 1.5;            // scale


        //----------------------------------------------------------------------
        // create the matrix at x,y scale = s and rotation time/3
        createMatrix(x,y,s,timer/3);

        // use the created matrix to set the transformation
        var m = matrix;
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
        //----------------------------------------------------------------------------



        //draw a grid
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = majorCol ;
        ctx.lineWidth = majorWidth;
        for(i = gridStart; i <= gridEnd; i+= gridStepMajor){
            ctx.moveTo(gridStart, i);
            ctx.lineTo(gridEnd, i);
            ctx.moveTo(i, gridStart);
            ctx.lineTo(i, gridEnd);
        }
        ctx.stroke();
        ctx.strokeStyle = minorCol ;
        ctx.lineWidth = minorWidth;
        for(i = gridStart+gridStepMinor; i < gridEnd; i+= gridStepMinor){
            ctx.moveTo(gridStart, i);
            ctx.lineTo(gridEnd, i);
            ctx.moveTo(i, gridStart);
            ctx.lineTo(i, gridEnd);
        }
        ctx.stroke();

        //---------------------------------------------------------------------
        // get the mouse world coordinates
        var mouseWorldPos = toWorld(mouse.x, mouse.y);
        //---------------------------------------------------------------------


        // marke the location with a cross and a circle;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mouseWorldPos.x - gridStepMajor, mouseWorldPos.y)
        ctx.lineTo(mouseWorldPos.x + gridStepMajor, mouseWorldPos.y)
        ctx.moveTo(mouseWorldPos.x, mouseWorldPos.y - gridStepMajor)
        ctx.lineTo(mouseWorldPos.x, mouseWorldPos.y + gridStepMajor)
        ctx.stroke();


        ctx.fillStyle = "red";
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(mouseWorldPos.x, mouseWorldPos.y, 6, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "Blue";
        ctx.setTransform(1,0,0,1,0,0);

        ctx.font = "18px Arial";
        var str = "Mouse canvas X: "+ mouse.x + " Y: " +  mouse.y;
        ctx.fillText(str , 10 ,18);
        var str = "Mouse word X: "+ mouseWorldPos.x.toFixed(2) + " Y: " +  mouseWorldPos.y.toFixed(2);
        ctx.fillText(str , 10 ,36);


        // if not over request a new animtion frame
        if(!endItAll){
           requestAnimationFrame(update);
        }else{
            // if done remove the canvas
            var can = document.getElementById("canv");
            if(can !== null){
                document.body.removeChild(can);
            }
            // flag that we are ready to start again
            endItAll = false;
        }
    }
    update(); // start the animation
}

// Flag to indicate that the current execution should shut down
var endItAll = false;
// resizes but waits for the current running animnation to shut down
function resizeIt(){
    endItAll = true;
    function waitForIt(){
        if(!endItAll){
            demo();
        }else{
            setTimeout(waitForIt, 100);
        }
    }
    setTimeout(waitForIt, 100);
}


// starts the demo
demo();
// listen to resize events and resize canvas if needed
window.addEventListener("resize",resizeIt)
