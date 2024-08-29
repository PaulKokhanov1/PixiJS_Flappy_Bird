import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class PlayButton{
    constructor() {
        this.texture = PIXI.Texture.from("playButton");
        this.createSprite();
    }

    createSprite() { 
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.x = window.innerWidth/2;
        this.sprite.y = window.innerHeight/2;

        // Make the button interactive...
        this.sprite.eventMode = 'static';
        this.sprite.cursor = 'pointer';

        App.app.stage.addChild(this.sprite);

    }

    onButtonDown()
    {
        this.sprite.emit("start"); 
    }

    playGame() {
        App.app.ticker.start();
        App.physics.gravity.scale = 0.0028;
        this.sprite.destroy();
    }

    update(){
    }
}