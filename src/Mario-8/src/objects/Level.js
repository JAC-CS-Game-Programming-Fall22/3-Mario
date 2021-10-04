import Entity from "../entities/Entity.js";
import { timer } from "../globals.js";

export default class Level {
	constructor(tilemap, entities = []) {
		this.tilemap = tilemap;
		this.entities = entities;
	}

	update(dt) {
		this.clear();

		timer.update(dt);

		this.tilemap.update(dt);

		this.entities.forEach((entity) => {
			entity.update(dt);
		});
	}

	render() {
		this.tilemap.render();

		this.entities.forEach((entity) => {
			entity.render();
		});
	}

	clear() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
	}

	/**
	 * @param {Entity} entity
	 */
	addEntity(entity) {
		this.entities.push(entity);
	}
}
