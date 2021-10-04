import GameObject from "./GameObject.js";
import Coin from "./Coin.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";

export default class Block extends GameObject {
	static WIDTH = Tile.TILE_SIZE;
	static HEIGHT = Tile.TILE_SIZE;
	static TOTAL_SPRITES = 5;
	static NOT_HIT = 1;
	static HIT = 4;

	/**
	 * A "box" that the player can hit from beneath to reveal a coin.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

		this.sprites = Block.generateSprites();
		this.currentFrame = Block.NOT_HIT;
	}

	static generateSprites() {
		const sprites = [];

		// Only grabbing the first sprite from each row, but this can be altered to grab all the sprites.
		for (let y = 0; y < Block.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Blocks),
				0,
				y * Block.HEIGHT,
				Block.WIDTH,
				Block.HEIGHT
			));
		}

		return sprites;
	}

	onCollision(objects) {
		if (this.wasCollided) {
			sounds.play(SoundName.EmptyBlock);
			return;
		}

		const coin = new Coin(
			new Vector(Coin.WIDTH, Coin.HEIGHT),
			new Vector(this.position.x, this.position.y),
		);

		// make the block move up and down
		timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
			timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
		});

		// make the coin move up from the block and play a sound
		timer.tween(coin.position, ['y'], [this.position.y - Coin.HEIGHT], 0.1);
		sounds.play(SoundName.Reveal);

		// Since we want the coin to appear like it's coming out of the block,
		// We add the coin to the beginning of the objects array. This way,
		// when the objects are rendered, the coins will be rendered first,
		// and the blocks will be rendered after.
		objects.unshift(coin);

		this.wasCollided = true;
		this.currentFrame = Block.HIT;
	}
}
