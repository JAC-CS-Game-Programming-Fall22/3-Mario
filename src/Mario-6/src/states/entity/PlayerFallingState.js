import { keys } from "../../globals.js";
import { PlayerStateName } from "../../enums.js";
import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";

export default class PlayerFallingState extends State {
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([2], 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update(dt) {
		this.player.velocity.add(this.player.gravityForce, dt);

		if (this.player.position.y > this.player.groundHeight) {
			this.player.position.y = this.player.groundHeight;
			this.player.velocity.y = 0;
			this.player.changeState(PlayerStateName.Idle);
		}
		else if (keys.a) {
			this.player.moveLeft();
			this.player.checkLeftCollisions();
		}
		else if (keys.d) {
			this.player.moveRight();
			this.player.checkRightCollisions();
		}
		else {
			this.player.stop();
		}
	}
}
