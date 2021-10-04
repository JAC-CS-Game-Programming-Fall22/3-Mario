import Timer from "./Timer.js";

export default class Animation {
	/**
	 * Animations can be achieved by simply looping through a series of
	 * frames from a sprite sheet one after the other, akin to a flip book.
	 *
	 * @param {array} frames The indexes that reference sprites in a sprite sheet.
	 * @param {number} interval The frequency the animation should run.
	 */
	constructor(frames, interval = 1) {
		this.frames = frames;
		this.interval = interval;
		this.timer = new Timer();
		this.currentFrame = 0;

		this.startTimer();
	}

	update(dt) {
		// No need to update if animation is only one frame.
		if (this.frames.length === 1) {
			return;
		}

		this.timer.update(dt);
	}

	startTimer() {
		this.timer.addTask(() => {
			this.currentFrame = Math.max(0, (this.currentFrame + 1) % (this.frames.length));
		}, this.interval);
	}

	getCurrentFrame() {
		return this.frames[this.currentFrame];
	}
}
