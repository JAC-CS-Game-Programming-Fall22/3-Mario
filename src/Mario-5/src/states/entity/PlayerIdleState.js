import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import { PlayerStateName } from "../../enums.js";
import { keys } from "../../globals.js";

export default class PlayerIdleState extends State {
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([0], 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update() {
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();

		if (keys[' ']) {
			this.player.changeState(PlayerStateName.Jumping);
		}

		if (keys.a || keys.d) {
			this.player.changeState(PlayerStateName.Walking);
		}
		else {
			this.player.stop();
		}
	}
}
