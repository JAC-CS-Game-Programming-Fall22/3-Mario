import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import { Direction, ImageName, PlayerStateName } from "../enums.js";
import { context, images } from "../globals.js";
import Tile from "../objects/Tile.js";
import Tilemap from "../objects/Tilemap.js";
import LevelMaker from "../services/LevelMaker.js";
import PlayerFallingState from "../states/entity/PlayerFallingState.js";
import PlayerIdleState from "../states/entity/PlayerIdleState.js";
import PlayerJumpingState from "../states/entity/PlayerJumpingState.js";
import PlayerWalkingState from "../states/entity/PlayerWalkingState.js";

/**
 * After 12 hours straight battling with this class trying to make it
 * work with both velocity and acceleration vectors, I'm throwing in the
 * towel. This is probably what physics engines are for... Go figure.
 *
 * The physcis implementation in this class is rudimentary at best. I've
 * given up trying to make acceleration vectors work. At this point, I'm
 * simply manipulating the position vector straight, and only using the
 * velocity vector for gravity.
 */
export default class Player {
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
	 * @param {Tilemap} map
	 */
	constructor(dimensions, position, velocityLimit, map) {
		this.dimensions = dimensions;
		this.position = position;
		this.velocity = new Vector(0, 0);
		this.velocityLimit = velocityLimit;

		this.jumpForce = new Vector(0, -325);
		this.gravityForce = new Vector(0, 1000);
		this.speedScalar = 5;
		this.frictionScalar = 0.95;
		this.groundHeight = LevelMaker.GROUND_HEIGHT * Tile.TILE_SIZE - this.dimensions.y;

		this.direction = Direction.Right;
		this.sprites = Player.generateSprites();
		this.map = map;
		this.currentAnimation = null;

		this.stateMachine = new StateMachine();
		this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		this.stateMachine.add(PlayerStateName.Jumping, new PlayerJumpingState(this));
		this.stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
		this.stateMachine.add(PlayerStateName.Falling, new PlayerFallingState(this));
	}

	changeState(state, parameters) {
		this.stateMachine.change(state, parameters);
	}

	update(dt) {
		this.checkLeftCollisions();
		this.checkRightCollisions();

		this.position.add(this.velocity, dt);

		this.stateMachine.update(dt);
	}

	render() {
		/**
		 * Draw character, this time getting the current frame from the animation.
		 * We also check for our direction and scale by -1 on the X axis if we're facing left.
		 */
		if (this.direction === Direction.Left) {
			context.save();
			context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context.scale(-1, 1);
			this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0);
			context.restore();
		}
		else {
			this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(this.position.x), Math.floor(this.position.y));
		}
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
	}

	checkRightCollisions() {
		if (this.position.x > this.map.canvasDimensions.x - this.dimensions.x) {
			this.velocity.x = 0;
			this.position.x = this.map.canvasDimensions.x - this.dimensions.x;
		}
	}
}
