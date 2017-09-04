import MainLoop from './MainLoop';
import Viewport from './Viewport';
import Input from './Input';
import System from './System';
import Galaxy from './Galaxy';
import { randomColor } from './util';

window.onload = init;

const viewport = new Viewport(document.body.scrollWidth, document.body.scrollHeight);
const mainLoop = new MainLoop();

const systems = {};
let currentSystem = null;

const galaxy = new Galaxy();
viewport.addToRender(galaxy);

const input = new Input(
	viewport.canvas,
	{
		p: {
			keydown: () => {
				mainLoop.togglePause();
				console.log('toggled pause', mainLoop.paused);
			}
		},
		right: {
			keydown: () => viewport.move(10, 0)
		},
		left: {
			keydown: () => viewport.move(-10, 0)
		},
		up: {
			keydown: () => viewport.move(0, -10)
		},
		down: {
			keydown: () => viewport.move(0, 10)
		},
		b: {
			keydown: () => {
				currentSystem.star.systemView = false;
				mainLoop.removeToUpdate(currentSystem);
				viewport.removeToRender(currentSystem);
				viewport.addToRender(galaxy);
			}
		}
	},
	{
		left: {
			ondown: (mouse) => {
				viewport.onDragStart(mouse.pos.x, mouse.pos.y);
				console.log(`mouse pos in canvas coords x: ${mouse.pos.x} y: ${mouse.pos.y}`);
				const { x, y } = viewport.toWorldCoords(mouse.pos.x, mouse.pos.y);
				const star = galaxy.findStarAt(x, y);
				console.log(`x: ${x} y: ${y} viewport position: ${JSON.stringify(viewport.position)} star: ${JSON.stringify(star)}`);
			}
		},
		middle: {},
		right: {},
		mousemove: (mouse) => {
			if (mouse.buttons.left.pressed) {
				viewport.onDrag(mouse);
			}
		},
		mousewheel: (mouse) => {
			viewport.zoom(mouse.wheelDelta, mouse.pos.x, mouse.pos.y);
		}
	}
);
mainLoop.addToUpdate(viewport);

// debug
viewport.addToDebug(input.mouse);

function init() {
	console.log('init');
	document.body.appendChild(viewport.canvas);
	mainLoop.start();
}
