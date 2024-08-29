import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class LabelGameOver extends PIXI.Text {
    constructor() {
        super();
        this.x = App.config.gameOver.x;
        this.y = App.config.gameOver.y;
        this.anchor.set(App.config.gameOver.anchor);
        this.style = App.config.gameOver.style;
        //this.renderText();
    }

    renderText() {
        this.text = `GAME OVER!`;
    }
}