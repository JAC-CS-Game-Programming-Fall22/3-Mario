/**
 * Mario-9
 * The "Coin" Update
 *
 * Original Lua by: Colton Ogden (cogden@cs50.harvard.edu)
 * Adapted to JS by: Vikram Singh (vikram.singh@johnabbott.qc.ca)
 *
 * Super Mario Bros. was instrumental in the resurgence of video
 * games in the mid-80s, following the infamous crash shortly after the
 * Atari age of the late 70s. The goal is to navigate various levels from
 * a side perspective, where jumping onto enemies inflicts damage and
 * jumping up into blocks typically breaks them or reveals a power-up.
 *
 * Art
 * https://opengameart.org/content/kenney-16x16
 * https://draconimous.itch.io/free-platform-tileset
 *
 * Music
 * https://freesound.org/people/Sirkoto51/sounds/393818/
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/game/PlayState.js";
import TitleScreenState from "./states/game/TitleScreenState.js";

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
	// @ts-ignore
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.Play, new PlayState());
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
