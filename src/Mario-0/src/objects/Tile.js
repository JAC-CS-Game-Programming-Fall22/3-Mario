import Vector from "../../lib/Vector.js";

export default class Tile {
	static TILE_SIZE = 16;

	/**
	 * Represents one tile in the Tilemap and on the screen.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} id Index for the sprites array.
	 * @param {array} sprites All textures this tile can have.
	 */
	constructor(x, y, id, sprites) {
		this.position = new Vector(x, y);
		this.id = id;
		this.sprites = sprites;
	}

	render() {
		this.sprites[this.id].render(this.position.x * Tile.TILE_SIZE, this.position.y * Tile.TILE_SIZE);
	}
}
