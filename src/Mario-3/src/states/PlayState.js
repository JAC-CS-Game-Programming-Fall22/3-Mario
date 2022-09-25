import Camera from "../../lib/Camera.js";
import State from "../../lib/State.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context } from "../globals.js";
import Tile from "../objects/Tile.js";
import LevelMaker from "../services/LevelMaker.js";

export default class PlayState extends State {
	constructor() {
		super();

		this.map = LevelMaker.generateLevel();

		this.player = new Player(
			new Vector(Player.WIDTH, Player.HEIGHT),
			new Vector(CANVAS_WIDTH / 2, LevelMaker.GROUND_HEIGHT * Tile.SIZE - Player.HEIGHT),
		);

		this.camera = new Camera(this.player, new Vector(CANVAS_WIDTH, CANVAS_HEIGHT));
	}

	update(dt) {
		this.player.update(dt);
		this.camera.update();
	}

	render() {
		this.renderViewport();
		this.renderGameParameters();
		this.renderLine();
	}

	renderViewport() {
		context.save();
		context.translate(-this.camera.position.x, this.camera.position.y);
		this.map.render();
		this.player.render();
		context.restore();
	}

	renderGameParameters() {
		context.fillStyle = 'white';
		context.font = '20px Joystix';
		context.fillText(`Camera Position: ${this.camera.position.x}`, 10, 25);
		context.fillText(`Player Position: (${Math.floor(this.player.position.x)}, ${Math.floor(this.player.position.y)})`, 10, 50);
	}

	renderLine() {
		for (let i = 0; i < 15; i++) {
			context.fillStyle = 'red';
			context.fillRect(CANVAS_WIDTH / 2, i * 20, 1, 10);
		}
	}
}
