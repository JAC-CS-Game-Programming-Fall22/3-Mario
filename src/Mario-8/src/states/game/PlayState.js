import Camera from "../../../lib/Camera.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { GameStateName } from "../../enums.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, stateMachine } from "../../globals.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.level = parameters.level;
		this.player = parameters.player;

		this.camera = new Camera(
			this.player,
			this.level.tilemap.canvasDimensions,
			new Vector(CANVAS_WIDTH, CANVAS_HEIGHT),
		);

		this.level.addEntity(this.player);
	}

	update(dt) {
		this.level.update(dt);
		this.camera.update();

		if (this.player.isDead) {
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		this.renderViewport();
		this.renderGameParameters();
	}

	renderViewport() {
		context.save();
		context.translate(-this.camera.position.x, this.camera.position.y);
		this.level.render();
		context.restore();
	}

	renderGameParameters() {
		context.fillStyle = 'white';
		context.font = '16px Joystix';
		context.fillText(`Position: (${Math.floor(this.player.position.x)}, ${Math.floor(this.player.position.y)})`, 10, 25);
		context.fillText(`Velocity: (${Math.floor(this.player.velocity.x)}, ${Math.floor(this.player.velocity.y)})`, 10, 50);
		context.fillText(`State: ${this.player.stateMachine.currentState.name}`, 10, 75);
		context.fillText(`Enemies: ${this.level.entities.length - 1}`, 10, 100);
	}
}
