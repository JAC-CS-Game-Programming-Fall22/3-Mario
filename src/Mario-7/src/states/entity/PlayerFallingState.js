import { CANVAS_HEIGHT, keys } from "../../globals.js";
import { Direction, PlayerStateName } from "../../enums.js";
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

		if (this.isTileCollisionBelowRight() || this.isTileCollisionBelowLeft()) {
			this.resolveCollision();
		}
		else if (this.player.position.y > CANVAS_HEIGHT) {
			this.player.position.y = 0;
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

	isTileCollisionBelowRight() {
		const tilesToCheck = this.player.getTilesByDirection([Direction.RightBottom, Direction.RightTop]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);

		return doTilesExist && tilesToCheck[0].isCollidable() && !tilesToCheck[1].isCollidable();
	}

	isTileCollisionBelowLeft() {
		const tilesToCheck = this.player.getTilesByDirection([Direction.LeftBottom, Direction.LeftTop]);
		const doTilesExist = tilesToCheck.every((tile) => tile != undefined);

		return doTilesExist && tilesToCheck[0].isCollidable() && !tilesToCheck[1].isCollidable();
	}

	resolveCollision() {
		const tileBottomRight = this.player.getTilesByDirection([Direction.BottomRight])[0];

		if (tileBottomRight) {
			this.player.position.y = tileBottomRight.position.y * tileBottomRight.dimensions.x - this.player.dimensions.y;
			this.player.velocity.y = 0;
		}

		// If we get a collision beneath us, go into either walking or idle.
		if (keys.a || keys.d || Math.abs(this.player.velocity.x) > 0) {
			this.player.changeState(PlayerStateName.Walking);
		}
		else {
			this.player.changeState(PlayerStateName.Idle);
		}
	}
}
