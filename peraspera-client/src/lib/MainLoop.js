
export default class MainLoop {
	constructor() {
		this.paused = false;
		this.lastFrame = Date.now();
		this.toUpdate = new Set();
	}

	addToUpdate(item) {
		this.toUpdate.add(item);
	}

	removeToUpdate(item) {
		this.toUpdate.delete(item);
	}

	togglePause() {
		this.paused = !this.paused;
		this.start();
	}

	start() {
		this.lastFrame = Date.now();
		this.update();
	}

	update() {
		if (this.paused) {
			return;
		}
		requestAnimationFrame(this.update.bind(this));
		const now = Date.now();
		const dt = 0.001 * (now - this.lastFrame);
		this.lastFrame = now;
		try {
			for (const elem of this.toUpdate) {
				elem.update(dt);
			}
		}
		catch (err) {
			this.paused = true;
			throw err;
		}
	}
}
