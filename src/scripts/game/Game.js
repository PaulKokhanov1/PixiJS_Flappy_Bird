import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Scene } from "../system/Scene";
import { Background } from "./Background";
import { Bird } from "./Bird";
import { Columns } from "./Columns";
import { LabelScore } from './LabelScore';
import { PlayButton } from './PlayButton';
import { LabelGameOver } from './LabelGameOver';

export class Game extends Scene {
    create() {
        this.createBackground();
        this.createBird();
        this.createPlayButton();
        this.createColumns();
        this.setEvents();
        this.createUI();
        this.initalStart = true;
    }

    createUI() {
        this.labelScore = new LabelScore();
        this.labelGameOver = new LabelGameOver();
        this.container.addChild(this.labelScore);
        this.container.addChild(this.labelGameOver);
        this.bird.sprite.on("score", () => {
            this.labelScore.renderScore(this.bird.score);
        });
    }

    //creates event whenever two physics bodies collide
    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    onCollisionStart(event) {
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB]; //get both bodies of collision
        const bird = colliders.find(body => body.gameBird);
        const column = colliders.find(body => body.gameColumn);

        const trigger = colliders.find(body => body.gameTrigger);

        if (bird && trigger) {
            this.bird.incrementScore(trigger.gameTrigger);
        }

        if (bird && column) {
            this.container.off("pointerdown");
            //TODO MAKE DEATH SEQUENCE
            //this.bird.DeathSequence(column.gameColumn);
        }
    }

    
    createBird() {
        this.bird = new Bird();
        this.container.addChild(this.bird.sprite);

        //Event listener for causing bird to jump
        this.container.interactive = true;
        this.container.on("pointerdown", () => {
            this.bird.startJump();
        });
        this.bird.sprite.once("die", () => {
            App.scenes.start("Game");
        });

        this.bird.sprite.once("offscreen", () => {
            this.deathSequence();
        });
    }

    test() {
        console.log("test CALLED");
    }

    deathSequence(){
        this.labelGameOver.renderText();
        setTimeout(() => {
            App.scenes.start("Game");
        }, 3000);
    }

    
    createPlayButton() {
        this.button = new PlayButton();
        this.container.addChild(this.button.sprite);
        this.button.sprite.once("start", () => {
            this.button.playGame();
        });

        //Not the cleanest way of managing the start button but otherwise, we'd be getting a null reference if we directly called to destroy the button
        this.container.on("pointerdown", () => {
            this.button.sprite.emit("start");
        });
    }


    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        App.app.ticker.remove(this.update, this);
        this.bg.destroy();
        this.bird.destroy();
        this.columns.destroy();
        this.labelScore.destroy();
    }

    createColumns() {
        this.columns = new Columns();
        this.container.addChild(this.columns.container);
    }



    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    //Used to Continously update game
    update(dt) {
        //Used to initially pause the Game While we wait for player to press the play button
        if(this.initalStart){
            App.physics.gravity.scale = 0;
            App.app.ticker.stop();
            this.initalStart = false;
        }
        this.bg.update(dt);
        this.columns.update(dt);
    }
}
