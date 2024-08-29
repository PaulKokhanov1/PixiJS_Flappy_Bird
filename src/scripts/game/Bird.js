import * as PIXI from "pixi.js";
import * as Matter from 'matter-js';
import { App } from '../system/App';

export class Bird {
    constructor() {
        this.createSprite();
        this.score = 0;

        this.createBody();
        App.app.ticker.add(this.update, this);

        this.dy = App.config.bird.jumpSpeed;
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(
            this.sprite.x + this.sprite.width / 2, 
            this.sprite.y + this.sprite.height / 2, 
            this.sprite.width, 
            this.sprite.height,
             {friction: 0, 
                render: {
                    fillStyle: '#ffffff',
                    strokeStyle: 'pink',
                    lineWidth: 10   //NOT WORKING FOR SOME REASON

        }});
        Matter.World.add(App.physics.world, this.body);
        this.body.gameBird = this;
    }

    update() {
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;
        this.sprite.rotation = this.body.angle;
        console.log("Score: %d", this.score);
        //if sprite outside of screen
        if(this.sprite.x < 0 || this.sprite.x >window.innerWidth ||this.sprite.y < 0 || this.sprite.y > window.innerHeight){
            this.sprite.emit("offscreen");
        }

    }

    createSprite() {
        this.sprite = new PIXI.AnimatedSprite([
            App.res("flyingPixie")
        ]);

        this.sprite.x = App.config.bird.position.x;
        this.sprite.y = App.config.bird.position.y;
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }

    
    startJump() {
        Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
    }

    DeathSequence(column) {
        this.column = column;
        console.log("Bird SHould die NOW");
        this.sprite.emit("die");
    }

    incrementScore(trigger) {
        ++this.score;
        //Matter.World.remove(App.physics.world, trigger.body); //causing issues, look into it later when have time, not game breaking atm
        this.sprite.emit("score");
    }

    destroy() {
        App.app.ticker.remove(this.update, this);
        Matter.World.remove(App.physics.world, this.body);
        this.sprite.destroy();
    }

}