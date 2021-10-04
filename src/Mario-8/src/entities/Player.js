import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import { Direction, GameStateName, ImageName, PlayerStateName } from "../enums.js";
import { images, keys, stateMachine } from "../globals.js";
import Level from "../objects/Level.js";
import PlayerFallingState from "../states/entity/player/PlayerFallingState.js";
import PlayerIdleState from "../states/entity/player/PlayerIdleState.js";
import PlayerJumpingState from "../states/entity/player/PlayerJumpingState.js";
import PlayerWalkingState from "../states/entity/player/PlayerWalkingState.js";
import Entity from "./Entity.js";

export default class Player extends Entity {
	static WIDTH = 16;
	static HEIGHT = 20;
	static TOTAL_SPRITES = 11;
	static VELOCITY_LIMIT = 100;

	/**
	 * The hero character the player controls in the map.
	 * Has the ability to jump and will collide into tiles
	 * that are collidable.
	 *
	 * @param {Vector} dimensions The height and width of the player.
	 * @param {Vector} position The x and y coordinates of the player.
	 * @param {Vector} velocityLimit The maximum speed of the player.
	 * @param {Level} level The level that the player lives in.
	 */
	constructor(dimensions, position, velocityLimit, level) {
		super(dimensions, position, velocityLimit, level);

		this.gravityForce = new Vector(0, 1000);
		this.speedScalar = 5;
		this.frictionScalar = 0.9;

		this.jumpForce = new Vector(0, -325);
		this.jumpCharge = 0;
		this.jumpChargeMax = 0.1;
		this.isChargingJump = false;

		this.sprites = Player.generateSprites();

		this.stateMachine = new StateMachine();
		this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		this.stateMachine.add(PlayerStateName.Jumping, new PlayerJumpingState(this));
		this.stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
		this.stateMachine.add(PlayerStateName.Falling, new PlayerFallingState(this));

		this.changeState(PlayerStateName.Falling);
	}

	/**
	 * Loops through the character sprite sheet and
	 * retrieves each sprite's location in the sheet.
	 *
	 * @returns The array of sprite objects.
	 */
	static generateSprites() {
		const sprites = [];

		for (let i = 0; i < Player.TOTAL_SPRITES; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.Character),
				i * Player.WIDTH,
				0,
				Player.WIDTH,
				Player.HEIGHT,
			));
		}

		return sprites;
	}

	moveLeft() {
		this.direction = Direction.Left;
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar * this.frictionScalar, -this.velocityLimit.x);
	}

	moveRight() {
		this.direction = Direction.Right;
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar * this.frictionScalar, this.velocityLimit.x);
	}

	stop() {
		if (Math.abs(this.velocity.x) > 0) {
			this.velocity.x *= this.frictionScalar;
		}

		if (Math.abs(this.velocity.x) < 0.1) {
			this.velocity.x = 0;
		}
	}

	checkLeftCollisions() {
		if (this.position.x < 0) {
			this.velocity.x = 0;
			this.position.x = 0;
		}

		if (this.didCollideWithTiles([Direction.LeftBottom, Direction.LeftTop])) {
			const tileLeftTop = this.getTilesByDirection([Direction.LeftTop])[0];
			this.velocity.x = 0;

			if (tileLeftTop) {
				this.position.x = tileLeftTop.position.x * tileLeftTop.dimensions.x + tileLeftTop.dimensions.x - 1;
			}
		}
	}

	checkRightCollisions() {
		if (this.position.x > this.level.tilemap.canvasDimensions.x - this.dimensions.x) {
			this.velocity.x = 0;
			this.position.x = this.level.tilemap.canvasDimensions.x - this.dimensions.x;
		}

		if (this.didCollideWithTiles([Direction.RightBottom, Direction.RightTop])) {
			const tileRightTop = this.getTilesByDirection([Direction.RightTop])[0];
			this.velocity.x = 0;

			if (tileRightTop) {
				this.position.x = tileRightTop.position.x * tileRightTop.dimensions.x - this.dimensions.x;
			}
		}
	}

	/**
	 * Check if we've collided with any entities and die if so.
	 *
	 * @param {Entity} entity
	 */
	onEntityCollision(entity) {
		if (!entity.isDead) {
			this.isDead = true;
		}
	}

	/**
	 * Loops through all the entities in the current level and checks
	 * if the player collided with any of them. If so, run onCollision().
	 * If no onCollision() function was passed, use the one from this class.
	 *
	 * @param {function} onCollision What should happen when the collision occurs.
	 * @returns The collision objects returned by onCollision().
	 */
	checkEntityCollisions(onCollision = entity => this.onEntityCollision(entity)) {
		this.level.entities.forEach((entity) => {
			if (this === entity) {
				return;
			}

			if (entity.didCollideWithEntity(this)) {
				onCollision(entity);
			}
		});
	}

	chargeJump(dt) {
		if (keys[' ']) {
			this.isChargingJump = true;
		}

		if (this.isChargingJump && this.jumpCharge < this.jumpChargeMax) {
			this.jumpCharge += dt;
		}

		if ((!keys[' '] && this.isChargingJump) || this.jumpCharge >= this.jumpChargeMax) {
			this.changeState(PlayerStateName.Jumping, {
				jumpCharge: this.jumpCharge * 10,
			});

			this.jumpCharge = 0;
			this.isChargingJump = false;
		}
	}
}
