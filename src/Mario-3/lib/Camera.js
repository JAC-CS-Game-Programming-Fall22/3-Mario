import Vector from "./Vector.js";

export default class Camera {
	/**
	 * The "camera" in video games boils down to a small section of the space the player can look at
	 * at any given time. The camera's position is used to translate the canvas based on where the
	 * subject currently is in the scene.
	 *
	 * @param {Object} subject The camera will follow the subject. Subject must have a position vector.
	 * @param {Vector} viewport How much of the scene the player can look at at any one time.
	 */
	constructor(subject, viewport) {
		this.subject = subject;
		this.viewport = viewport;
		this.position = new Vector(0, 0);
	}

	update() {
		this.position.x = this.getNewPosition();
	}

	/**
	 * Get the camera's new position based on the left edge
	 * to half the screen to the left of the player's center.
	 *
	 * @returns The camera's new position.
	 */
	getNewPosition() {
		return Math.floor(this.subject.position.x - (this.viewport.x / 2) + (this.subject.dimensions.x / 2));
	}
}
