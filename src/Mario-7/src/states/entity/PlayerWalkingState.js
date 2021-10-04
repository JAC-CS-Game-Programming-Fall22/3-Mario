import { keys } from "../../globals.js";
import { PlayerStateName } from "../../enums.js";
import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";
import { Direction } from "../../../../Mario-8/src/enums.js";

export default class PlayerWalkingState extends State {
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([9, 10], 0.2);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update(dt) {
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();

		if (!keys.a && !keys.d && Math.abs(this.player.velocity.x) === 0) {
			this.player.changeState(PlayerStateName.Idle);
		}
		else if (!this.isTileCollisionBelow()) {
			this.player.changeState(PlayerStateName.Falling);
		}
		else if (keys[' ']) {
			this.player.changeState(PlayerStateName.Jumping);
		}
		else if (keys.a) {
			this.player.moveLeft();
		}
		else if (keys.d) {
			this.player.moveRight();
		}
		else {
			this.player.stop();
		}
	}

	isTileCollisionBelow() {
		return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
	}
}
