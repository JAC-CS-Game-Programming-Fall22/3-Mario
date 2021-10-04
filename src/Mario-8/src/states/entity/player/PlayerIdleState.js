import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import { Direction, PlayerStateName } from "../../../enums.js";
import { keys } from "../../../globals.js";

export default class PlayerIdleState extends State {
	/**
	 * In this state, the player is stationary unless
	 * left or right are pressed, or if there is no
	 * collision below.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([0], 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update(dt) {
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		this.player.checkEntityCollisions();
		this.player.chargeJump(dt);

		if (!this.isTileCollisionBelow()) {
			this.player.changeState(PlayerStateName.Falling);
		}

		if (keys.a || keys.d) {
			this.player.changeState(PlayerStateName.Walking);
		}

	}

	isTileCollisionBelow() {
		return this.player.didCollideWithTiles([Direction.BottomLeft, Direction.BottomRight]);
	}
}
