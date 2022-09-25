import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import { Direction, ImageName } from "../enums.js";
import { context, images, keys } from "../globals.js";
import Tile from "../objects/Tile.js";
import LevelMaker from "../services/LevelMaker.js";

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
		this.groundHeight = LevelMaker.GROUND_HEIGHT * Tile.SIZE - this.dimensions.y;

		this.direction = Direction.Right;
		this.sprites = Player.generateSprites();
		this.map = map;

		this.idleAnimation = new Animation([0]);
		this.movingAnimation = new Animation([9, 10], 0.2);
		this.jumpAnimation = new Animation([2]);
		this.currentAnimation = this.idleAnimation;
	}

	update(dt) {
		this.handleMovement(dt);
		this.handleJump(dt);

		this.position.add(this.velocity, dt);

		this.currentAnimation.update(dt);
	}

	/**
	 * Draw character, this time getting the current frame from the animation.
	 * We also check for our direction and scale by -1 on the X axis if we're facing left.
	 */
	render() {
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

	jump() {
		this.velocity.y = this.jumpForce.y;
	}

	moveLeft() {
		this.direction = Direction.Left;
		this.currentAnimation = this.movingAnimation;
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar * this.frictionScalar, -this.velocityLimit.x);
	}

	moveRight() {
		this.direction = Direction.Right;
		this.currentAnimation = this.movingAnimation;
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar * this.frictionScalar, this.velocityLimit.x);
	}

	stop() {
		if (Math.abs(this.velocity.x) > 0) {
			this.velocity.x *= this.frictionScalar;
		}

		if (Math.abs(this.velocity.x) < 0.1) {
			this.currentAnimation = this.idleAnimation;
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

	handleMovement(dt) {
		this.checkLeftCollisions();
		this.checkRightCollisions();

		// If the player wants to move left...
		if (keys.a) {
			this.moveLeft();
		}
		// If the player wants to move right...
		else if (keys.d) {
			this.moveRight();
		}
		// Otherwise, slow down the character gradually.
		else {
			this.stop();
		}
	}

	handleJump(dt) {
		if (keys[' '] && this.position.y === this.groundHeight) {
			this.jump();
		}

		// If the character is airborne, then apply gravity.
		if (Math.abs(this.velocity.y) > 0) {
			this.velocity.add(this.gravityForce, dt);
			this.currentAnimation = this.jumpAnimation;
		}

		// Don't go below the ground.
		if (this.position.y > this.groundHeight) {
			this.position.y = this.groundHeight;
			this.velocity.y = 0;
			this.currentAnimation = this.idleAnimation;
		}
	}
}
