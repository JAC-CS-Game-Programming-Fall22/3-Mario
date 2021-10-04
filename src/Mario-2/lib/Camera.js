import { keys } from "../src/globals.js";
import Vector from "./Vector.js";

export default class Camera {
	/**
	 * The "camera" in video games boils down to a small section of the space the player can look at
	 * at any given time. The camera's position is used to translate the canvas based on where the
	 * subject currently is in the scene.
	 */
	constructor() {
		this.position = new Vector(0, 0);
		this.speed = 300;
	}

	update(dt) {
		/**
		 * Since speed * dt gives us a floating point number, we must floor
		 * that value because we need to translate the canvas position by integer values.
		 */
		if (keys.a) {
			this.position.x -= Math.floor(this.speed * dt);
		}
		else if (keys.d) {
			this.position.x += Math.floor(this.speed * dt);
		}
	}
}
