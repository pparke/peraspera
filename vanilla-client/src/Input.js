import mousetrap from './mousetrap';

export default class Input {
	constructor(element, keys, mouse) {
		// the dom element that will respond to input
		this.element = element;

		this.keys = new Keys(element, keys);

		this.mouse = new Mouse(element, mouse);
	}
}

class Mouse {
	constructor(element, handlers) {
		const { mousemove, mousewheel } = handlers;
		this.element = element;
		this.mousemove = mousemove;
		this.mousewheel = mousewheel;

		this.bound = {};
		this.bound.mousedown = this.onMouseDown.bind(this);
		this.bound.mouseup = this.onMouseUp.bind(this);
		this.bound.mousemove = this.onMouseMove.bind(this);
		this.bound.mousewheel = this.onMouseWheel.bind(this);

		element.addEventListener('mousedown', this.bound.mousedown, false);
		element.addEventListener('mouseup', this.bound.mouseup, false);
		element.addEventListener('mousemove', this.bound.mousemove, false);
		element.addEventListener('wheel', this.bound.mousewheel, false);
		// last mouse pos
		this.lastPos = { x: 0, y: 0 };
		this.pos = { x: 0, y: 0 };
		// used to map 0, 1, 2 to buttons
		this.btnIndex = ['left', 'middle', 'right'];
		this.buttons = {
			left: { pressed: false, ondown: handlers.left.ondown, onup: handlers.left.onup },
			middle: { pressed: false, ondown: handlers.middle.ondown, onup: handlers.middle.onup },
			right: { pressed: false, ondown: handlers.right.ondown, onup: handlers.right.onup }
		};
	}

	button(i) {
		if (typeof i === 'string') {
			return this.buttons[i];
		}
		else if (typeof i === 'number') {
			return this.buttons[this.btnIndex[i]];
		}
	}

	getElemPos(event) {
		const elem = this.element;
		const rect = elem.getBoundingClientRect();
		const { offsetLeft, offsetTop, width, height } = elem;
		//const x = event.clientX - offsetLeft;
		//const y = event.clientY - offsetTop;
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		return { x, y };
	}

	debugText(viewport, x, y) {
		viewport.ctx.fillText(`Mouse Pos x: ${this.pos.x} y: ${this.pos.y}`, x, y);
		const { x: wx, y: wy } = viewport.toWorldCoords(this.pos.x, this.pos.y);
		viewport.ctx.fillText(`World Pos x: ${wx} y: ${wy}`, x, y + 20);
	}

	onMouseDown(e) {
		e.preventDefault();
		const btn = this.button(e.button);
		btn.pressed = true;
		if (typeof btn.ondown === 'function') {
			btn.ondown(this);
		}
	}

	onMouseUp(e) {
		e.preventDefault();
		const btn = this.button(e.button);
		btn.pressed = false;
		if (typeof btn.onup === 'function') {
			btn.onup(this);
		}
	}

	onMouseMove(e) {
		this.lastPos.x = this.pos.x;
		this.lastPos.y = this.pos.y;
		const { x, y } = this.getElemPos(e);
		this.pos.x = x;
		this.pos.y = y;
		if (typeof this.mousemove === 'function') {
			this.mousemove(this);
		}
	}

	onMouseWheel(e) {
		const delta = -e.deltaY || e.wheelDelta || -e.detail;
		this.wheelDelta = delta;
		if (typeof this.mousewheel === 'function') {
			this.mousewheel(this);
		}
	}
}

class Keys {
	constructor(element, keys) {
		this.element = element;
		// keys is a proxy that lazily creates each key
		// object as needed
		this.keys = new Proxy({}, {
			get(target, name) {
				if (!target.hasOwnProperty(name)) {
					target[name] = { pressed: false };
				}
				return target[name];
			}
		});

		this.bindKeys(keys);
	}

	bindKeys(keys) {
		mousetrap.reset();
		// bind each key
		for (const key in keys) {
			if (keys.hasOwnProperty(key)) {
				mousetrap.bind(key, () => this.keyDown(key), 'keydown');
				mousetrap.bind(key, () => this.keyUp(key), 'keyup');
				const { keydown, keyup } = keys[key];
				this.keys[key].keydown = keydown;
				this.keys[key].keyup = keyup;
			}
		}
	}

	keyDown(k) {
		const key = this.keys[k];
		key.pressed = true;
		if (typeof key.keydown === 'function') {
			key.keydown(this);
		}
		return false;
	}

	keyUp(k) {
		const key = this.keys[k];
		key.pressed = false;
		if (typeof key.keyup === 'function') {
			key.keyup(this);
		}
		return false;
	}
}
