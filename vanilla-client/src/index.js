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
				const { x, y } = viewport.toScreenCoords(mouse.pos.x, mouse.pos.y);
				const star = galaxy.findStarAt(x, y);
				console.log(`x: ${x} y: ${y} viewport position: ${JSON.stringify(viewport.position)} star: ${JSON.stringify(star)}`);
				let systemToDisplay = null;
				if (systems[star.id] !== undefined) {
					systemToDisplay = systems[star.id];
				}
				else {
					systemToDisplay = new System(star.id, star);
					systems[star.id] = systemToDisplay;
				}
				star.systemView = true;
				currentSystem = systemToDisplay;
				mainLoop.addToUpdate(systemToDisplay);
				viewport.removeToRender(galaxy);
				viewport.addToRender(systemToDisplay);
			}
		},
		middle: {},
		right: {}
	}
);
mainLoop.addToUpdate(viewport);

function init() {
	console.log('init');
	document.body.appendChild(viewport.canvas);
	mainLoop.start();
}
