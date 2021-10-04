import Vector from "../../lib/Vector.js";
import Tile from "./Tile.js";

export default class Tilemap {
	/**
	 * Contains all the tiles that comprise the map.
	 *
	 * @param {number} width How many tiles wide the map will be.
	 * @param {number} height How many tiles tall the map will be.
	 * @param {array} tiles The array of Tile objects that comprise the map.
	 */
	constructor(width, height, tiles) {
		this.dimensions = new Vector(width, height);
		this.canvasDimensions = new Vector(width * Tile.TILE_SIZE, height * Tile.TILE_SIZE);
		this.tiles = tiles;
	}

	render() {
		this.tiles.forEach((tileRow) => {
			tileRow.forEach((tile) => {
				tile.render();
			});
		});
	}
}
