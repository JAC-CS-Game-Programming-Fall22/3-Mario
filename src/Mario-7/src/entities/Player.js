import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import { Direction, ImageName, PlayerStateName } from "../enums.js";
import { context, images } from "../globals.js";
import Tilemap from "../objects/Tilemap.js";
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

		this.direction = Direction.Right;
		this.sprites = Player.generateSprites();
		this.map = map;
		this.currentAnimation = null;

		this.stateMachine = new StateMachine();
		this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		this.stateMachine.add(PlayerStateName.Jumping, new PlayerJumpingState(this));
		this.stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
		this.stateMachine.add(PlayerStateName.Falling, new PlayerFallingState(this));

		this.changeState(PlayerStateName.Falling);
	}

	changeState(state, parameters) {
		this.stateMachine.change(state, parameters);
	}

	update(dt) {
		this.currentAnimation.update(dt);
		this.position.add(this.velocity, dt);
		this.stateMachine.update(dt);
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
		if (this.position.x > this.map.canvasDimensions.x - this.dimensions.x) {
			this.velocity.x = 0;
			this.position.x = this.map.canvasDimensions.x - this.dimensions.x;
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
	 * @param {array} tileDirections An array of directions based on the Direction enum.
	 * @returns Whether this entity collided with any (not all) of the tiles in the specified directions.
	 */
	didCollideWithTiles(tileDirections) {
		const tiles = this.getCollisionTilesByDirection(tileDirections);

		if (tiles.length === 0) {
			return false;
		}

		const doTilesExist = tiles.every((tile) => tile != undefined);

		return doTilesExist;
	}

	/**
	 * @param {array} tileDirections An array of directions based on the Direction enum.
	 * @returns All tiles that the entity collided with in the specified directions.
	 */
	getCollisionTilesByDirection(tileDirections) {
		const tiles = this.getTilesByDirection(tileDirections);

		return tiles.filter(tile => tile?.isCollidable());
	}

	/**
	 * @param {array} tileDirections An array of directions based on the Direction enum.
	 * @returns All tiles in the specified directions relative to this entity.
	 */
	getTilesByDirection(tileDirections) {
		const tiles = [];

		tileDirections.forEach((direction) => {
			let x = 0;
			let y = 0;

			/**
			 * The offsets are needed based on which tile we're checking.
			 * For example, if we want to be able to fall through a gap that
			 * is one tile wide, then the offsets of the player have to be -1
			 * on both sides to allow for that clearance.
			 */
			switch (direction) {
				case Direction.TopLeft:
					x = this.position.x + 2;
					y = this.position.y;
					break;
				case Direction.TopRight:
					x = this.position.x + this.dimensions.x - 2;
					y = this.position.y;
					break;
				case Direction.RightTop:
					x = this.position.x + this.dimensions.x - 1;
					y = this.position.y + 1;
					break;
				case Direction.RightBottom:
					x = this.position.x + this.dimensions.x - 1;
					y = this.position.y + this.dimensions.y - 1;
					break;
				case Direction.BottomRight:
					x = this.position.x + this.dimensions.x - 1;
					y = this.position.y + this.dimensions.y;
					break;
				case Direction.BottomLeft:
					x = this.position.x + 1;
					y = this.position.y + this.dimensions.y;
					break;
				case Direction.LeftBottom:
					x = this.position.x + 1;
					y = this.position.y + this.dimensions.y - 1;
					break;
				case Direction.LeftTop:
					x = this.position.x + 1;
					y = this.position.y + 1;
					break;
			}

			const tile = this.map.pointToTile(x, y);

			tiles.push(tile);
		});

		return tiles;
	}
}
