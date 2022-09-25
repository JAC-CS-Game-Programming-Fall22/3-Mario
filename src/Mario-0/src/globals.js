import Images from "../lib/Images.js";
import StateMachine from "../lib/StateMachine.js";

export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();
export const CANVAS_WIDTH = 576;
export const CANVAS_HEIGHT = 288;

export const images = new Images(context);
export const stateMachine = new StateMachine();
