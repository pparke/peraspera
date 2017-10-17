const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const g = 9.8;
const mousetrap = Mousetrap;
let paused = false;

class Ball {
	constructor(ctx) {
		this.ctx = ctx;
		this.color = "#0000ff";
		this.radius = 20;
		this.pos = {
			x: 50,
			y: 50
		};
		this.vel = {
			x: 10,
			y: 0
		};
	}

	update(dt) {
		this.move(dt);
		this.bounce();
		this.wrap();
		this.draw();
	}

	move(dt) {
		this.vel.y += g;
		this.pos.x += this.vel.x * dt;
		this.pos.y += this.vel.y * dt;
	}

	bounce() {
		if (this.pos.y > canvas.height - this.radius) {
			// reposition ball at ground
			this.pos.y = canvas.height - this.radius;
			// reverse and reduce vetical speed
			this.vel.y *= -0.8;
		}
	}

	wrap() {
		if (this.pos.x > canvas.width + this.radius) {
			this.pos.x = -this.radius;
		}
	}

	draw() {
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI, true);
		this.ctx.closePath();
		this.ctx.fill();
	}
};

const balls = [];

const time = {
	paused: false,
	lastFrame: 0,

	loop: function(){},

	togglePause() {
		this.paused = !this.paused;
		this.lastFrame = Date.now();
		this.update();
	},

	update() {
		if (this.paused) {
			return;
		}
		requestAnimationFrame(this.update.bind(this));
		const now = Date.now();
		const dt = 0.001 * (now - this.lastFrame);
		this.lastFrame = now;
		this.loop(dt);
	}
}

function randomColor() {
	const r = Math.floor(Math.random() * 255).toString(16);
	const g = Math.floor(Math.random() * 255).toString(16);
	const b = Math.floor(Math.random() * 255).toString(16);
	return `#${r}${g}${b}`;
}

window.onload = init;

function init () {
	balls.push(new Ball(ctx));
	mousetrap.bind('p', time.togglePause.bind(time));
	canvas.addEventListener('mousedown', e => {
		let b = new Ball(ctx);
		b.pos.x = e.x;
		b.pos.y = e.y;
		b.color = randomColor();
		b.vel.x = Math.random() * 100;
		balls.push(b);
	}, false);
	time.loop = mainLoop;
	time.update();
}

function mainLoop(dt) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	balls.forEach(ball => ball.update(dt));
}
