import { ImageName, TileType } from "../enums.js";
import { images } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "../objects/Tile.js";
import Tilemap from "../objects/Tilemap.js";

export default class LevelMaker {
	static DEFAULT_LEVEL_WIDTH = 45;
	static DEFAULT_LEVEL_HEIGHT = 18;
	static GROUND_HEIGHT = LevelMaker.DEFAULT_LEVEL_HEIGHT - 4;

	static generateLevel(width = LevelMaker.DEFAULT_LEVEL_WIDTH, height = LevelMaker.DEFAULT_LEVEL_HEIGHT) {
		const tiles = new Array();
		const sprites = LevelMaker.generateSprites();

		// Initialize the tiles with empty arrays.
		for (let i = 0; i < height; i++) {
			tiles.push([]);
		}

		// Loop through the map dimension slots and add a new tile per slot.
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const tileType = y < LevelMaker.GROUND_HEIGHT ? TileType.Sky : TileType.Ground;

				tiles[y].push(new Tile(x, y, tileType, sprites));
			}
		}

		return new Tilemap(width, height, tiles);
	}

	static generateSprites() {
		return [
			new Sprite(images.get(ImageName.Tiles), 0, 0, Tile.SIZE, Tile.SIZE),
			new Sprite(images.get(ImageName.Tiles), Tile.SIZE, 0, Tile.SIZE, Tile.SIZE),
		];
	}
}
