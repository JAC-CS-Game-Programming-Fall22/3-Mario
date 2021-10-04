import Vector from "../../lib/Vector.js";
import Sprite from "../../lib/Sprite.js";
import { ImageName } from "../enums.js";
import { images } from "../globals.js";

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
	 */
	constructor(dimensions, position) {
		this.dimensions = dimensions;
		this.position = position;
		this.sprites = Player.generateSprites();
	}

	render() {
		this.sprites[0].render(this.position.x, this.position.y);
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
}
