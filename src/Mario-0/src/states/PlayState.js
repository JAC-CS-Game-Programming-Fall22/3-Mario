import State from "../../lib/State.js";
import LevelMaker from "../services/LevelMaker.js";

export default class PlayState extends State {
	constructor() {
		super();

		this.level = LevelMaker.generateLevel();
	}

	render() {
		this.level.render();
	}
}
