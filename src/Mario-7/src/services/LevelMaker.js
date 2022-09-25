import { ImageName, TileType } from "../enums.js";
import { images } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import Graphic from "../../lib/Graphic.js";
import Tile from "../objects/Tile.js";
import Tilemap from "../objects/Tilemap.js";
import { didSucceedChance, getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";

export default class LevelMaker {
	static TILE_SET_WIDTH = 5;
	static TILE_SET_HEIGHT = 4;
	static TILE_SETS_WIDTH = 6;
	static TILE_SETS_HEIGHT = 10;
	static TOPPER_SETS_WIDTH = 6;
	static TOPPER_SETS_HEIGHT = 18;
	static DEFAULT_LEVEL_WIDTH = 45;
	static DEFAULT_LEVEL_HEIGHT = 18;
	static GROUND_HEIGHT = LevelMaker.DEFAULT_LEVEL_HEIGHT - 4;
	static PILLAR_CHANCE = 0.2;
	static MAX_PILLAR_HEIGHT = LevelMaker.GROUND_HEIGHT - 6;
	static CHASM_CHANCE = 0.1;
	static MIN_CHASM_WIDTH = 2;
	static MAX_CHASM_WIDTH = 5;

	static generateLevel(width = LevelMaker.DEFAULT_LEVEL_WIDTH, height = LevelMaker.DEFAULT_LEVEL_HEIGHT) {
		const tiles = new Array();
		const tileSet = getRandomPositiveInteger(0, LevelMaker.TILE_SETS_WIDTH * LevelMaker.TILE_SET_HEIGHT - 1);
		const topperSet = getRandomPositiveInteger(0, LevelMaker.TOPPER_SETS_WIDTH * LevelMaker.TOPPER_SETS_HEIGHT - 1);

		/**
		 * Used to generate chasms of varying widths. In generateChasm(), this
		 * number gets set randomly. When it is > 0, chasms are generated sub-
		 * sequently until the counter reaches zero.
		 */
		let chasmCounter = 0;

		LevelMaker.initializeTilemap(tiles, height);

		for (let x = 0; x < width; x++) {
			LevelMaker.generateEmptySpace(tiles, x, tileSet, topperSet);

			chasmCounter = LevelMaker.generateChasm(tiles, x, height, tileSet, topperSet, chasmCounter);

			// If we want a chasm, then we want to skip generating a column.
			if (chasmCounter > 0) {
				continue;
			}

			LevelMaker.generateColumn(tiles, x, height, tileSet, topperSet);
		}

		const tileSets = LevelMaker.generateSprites(
			images.get(ImageName.Tiles),
			LevelMaker.TILE_SETS_WIDTH,
			LevelMaker.TILE_SETS_HEIGHT,
			LevelMaker.TILE_SET_WIDTH,
			LevelMaker.TILE_SET_HEIGHT
		);
		const topperSets = LevelMaker.generateSprites(
			images.get(ImageName.Toppers),
			LevelMaker.TOPPER_SETS_WIDTH,
			LevelMaker.TOPPER_SETS_HEIGHT,
			LevelMaker.TILE_SET_WIDTH,
			LevelMaker.TILE_SET_HEIGHT
		);

		return new Tilemap(
			width,
			height,
			tiles,
			tileSets,
			topperSets,
		);
	}

	/**
	 * Initialize the tiles array with empty arrays.
	 *
	 * @param {array} tiles
	 * @param {number} height
	 */
	static initializeTilemap(tiles, height) {
		for (let i = 0; i < height; i++) {
			tiles.push([]);
		}
	}

	/**
	 * Loops from the top of the map until the ground starts
	 * and fill those spaces with empty tiles.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} tileSet
	 * @param {number} topperSet
	 */
	static generateEmptySpace(tiles, x, tileSet, topperSet) {
		for (let y = 0; y < LevelMaker.GROUND_HEIGHT; y++) {
			tiles[y].push(new Tile(x, y, TileType.Empty, false, tileSet, topperSet));
		}
	}

	/**
	 * Randomly generates a chasm which is a column in the map
	 * that has no tiles which the player can fall down into.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} height
	 * @param {number} tileSet
	 * @param {number} topperSet
	 * @param {number} chasmCounter
	 * @returns A decremented, or randomly generated if zero, chasmCounter.
	 */
	static generateChasm(tiles, x, height, tileSet, topperSet, chasmCounter) {
		if (chasmCounter !== 0) {
			for (let y = LevelMaker.GROUND_HEIGHT; y < height; y++) {
				tiles[y].push(new Tile(x, y, TileType.Empty, false, tileSet, topperSet));
			}

			chasmCounter--;
		}
		else if (didSucceedChance(LevelMaker.CHASM_CHANCE)) {
			chasmCounter = getRandomPositiveInteger(LevelMaker.MIN_CHASM_WIDTH, LevelMaker.MAX_CHASM_WIDTH);
		}

		return chasmCounter;
	}

	/**
	 * Generates the ground that the player can walk on.
	 * Will randomly decide to generate a pillar which is simply
	 * just ground tiles higher than the base ground height.
	 *
	 * @param {array} tiles
	 * @param {number} x
	 * @param {number} height
	 * @param {number} tileSet
	 * @param {number} topperSet
	 */
	static generateColumn(tiles, x, height, tileSet, topperSet) {
		const isPillar = didSucceedChance(LevelMaker.PILLAR_CHANCE);
		const pillarHeight = getRandomPositiveInteger(LevelMaker.GROUND_HEIGHT, LevelMaker.MAX_PILLAR_HEIGHT);
		const columnStart = isPillar ? pillarHeight : LevelMaker.GROUND_HEIGHT;

		for (let y = columnStart; y < height; y++) {
			tiles[y][x] = new Tile(x, y, TileType.Ground, y === columnStart, tileSet, topperSet);
		}
	}

	/**
	 * Generates a 2D array populated with Sprite objects.
	 *
	 * @param {Graphic} spriteSheet
	 * @param {number} setsX
	 * @param {number} setsY
	 * @param {number} sizeX
	 * @param {number} sizeY
	 * @returns A 2D array of sprite objects.
	 */
	static generateSprites(spriteSheet, setsX, setsY, sizeX, sizeY) {
		const tileSets = new Array();
		let counter = -1;

		// for each tile set on the X and Y
		for (let tileSetY = 0; tileSetY < setsY; tileSetY++) {
			for (let tileSetX = 0; tileSetX < setsX; tileSetX++) {
				tileSets.push([]);
				counter++;

				for (let y = sizeY * tileSetY; y < sizeY * tileSetY + sizeY; y++) {
					for (let x = sizeX * tileSetX; x < sizeX * tileSetX + sizeX; x++) {
						tileSets[counter].push(new Sprite(
							spriteSheet,
							x * Tile.SIZE,
							y * Tile.SIZE,
							Tile.SIZE,
							Tile.SIZE,
						));
					}
				}
			}
		}

		return tileSets;
	}
}
