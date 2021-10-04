import Camera from "../../lib/Camera.js";
import State from "../../lib/State.js";
import { CANVAS_WIDTH, context } from "../globals.js";
import LevelMaker from "../services/LevelMaker.js";

export default class PlayState extends State {
	constructor() {
		super();

		this.map = LevelMaker.generateLevel();
		this.camera = new Camera();
	}

	update(dt) {
		this.camera.update(dt);
	}

	render() {
		this.renderViewport();
		this.renderGameParameters();
		this.renderLine();
	}

	renderViewport() {
		context.save();

		/**
		 * Translate scene by camera scroll amount. Negative value shifts have
		 * the effect of making it seem like we're actually moving right and vice-versa.
		 */
		context.translate(-this.camera.position.x, this.camera.position.y);

		this.map.render();
		context.restore();
	}

	renderGameParameters() {
		context.fillStyle = 'white';
		context.font = '20px Joystix';
		context.fillText(`Camera Position: ${this.camera.position.x}`, 10, 25);
	}

	renderLine() {
		for (let i = 0; i < 15; i++) {
			context.fillStyle = 'red';
			context.fillRect(CANVAS_WIDTH / 2, i * 20, 1, 10);
		}
	}
}
