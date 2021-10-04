import Vector from "../../lib/Vector.js";
import { TileType } from "../enums.js";

export default class Tile {
	static TILE_SIZE = 16;
	static COLLIDABLE_TILES = [
		TileType.Ground,
	];

	/**
	 * Represents one tile in the Tilemap and on the screen.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} id Index for the sprites array.
	 * @param {boolean} hasTopper Whether this tile should have a topper.
	 * @param {number} tileSet Which tile texture this tile should have.
	 * @param {number} topperSet Which topper texture this tile should have.
	 */
	constructor(x, y, id, hasTopper, tileSet, topperSet) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(Tile.TILE_SIZE, Tile.TILE_SIZE);
		this.id = id;
		this.hasTopper = hasTopper;
		this.tileSet = tileSet;
		this.topperSet = topperSet;
	}

	isCollidable() {
		return Tile.COLLIDABLE_TILES.some((tile) => tile === this.id);
	}

	render(tileSets, topperSets) {
		tileSets[this.tileSet][this.id].render(this.position.x * Tile.TILE_SIZE, this.position.y * Tile.TILE_SIZE);

		if (this.hasTopper) {
			topperSets[this.topperSet][this.id].render(this.position.x * Tile.TILE_SIZE, this.position.y * Tile.TILE_SIZE);
		}
	}
}
