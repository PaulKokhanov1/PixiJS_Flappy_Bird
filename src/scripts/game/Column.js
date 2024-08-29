import * as PIXI from "pixi.js";
import * as Matter from 'matter-js';
import { App } from '../system/App';

//Working on implementing the columns atm, still need to refactor code so that we just use an x and y offset instead of # of "columns"
export class Column {
    constructor(yOffset, xOffset) {
        this.width = PIXI.Texture.from("column").width;
        this.height = PIXI.Texture.from("column").height;

        this.createContainer(yOffset, xOffset);
        this.createTile(true);
        this.createTile(false);
        this.xOffset = xOffset;
        this.yOffset = yOffset;

  

        // specify the speed of the platform
        this.dx = App.config.columns.moveSpeed;
        this.gap = App.config.columns.gap;
        this.createBody();
        //Used for counting score for each column pass
        this.createTrigger();

    }

    createBody() {
        // create a physical body, NEED TO MAKE TWO
        //in matter js, the x and y refers to the objects center
        this.body_top = Matter.Bodies.rectangle(this.width / 2 + this.container.x, this.height / 2 + this.container.y, this.width, this.height, {friction: 0, isStatic: true});
        this.body_bot = Matter.Bodies.rectangle(this.width / 2 + this.container.x, (this.height / 2 + this.container.y) + this.gap + this.height, this.width, this.height, {friction: 0, isStatic: true});
        // add the created body to the engine
        Matter.World.add(App.physics.world, this.body_top);
        Matter.World.add(App.physics.world, this.body_bot);

        // save a reference to the object itself for further access from the physical body object
        this.body_top.gameColumn = this; //WILL NEED TO EDIT THIS IF WE USE IT LATER
        this.body_bot.gameColumn = this; //WILL NEED TO EDIT THIS IF WE USE IT LATER
    }

    createTrigger(){
        this.trigger = Matter.Bodies.rectangle(this.width / 2 + this.container.x, (this.height + this.container.y) + this.gap/2, this.width/2, this.gap, {friction: 0, isStatic: true});
        this.trigger.gameTrigger = this;
        this.trigger.isSensor = true;
        Matter.World.add(App.physics.world, this.trigger);
    }

    move() {
        if (this.body_top && this.body_bot) {
            //this is where I could add moving of the y column if I feel like it
            Matter.Body.setPosition(this.body_top, {x: this.body_top.position.x + this.dx, y: this.body_top.position.y});
            Matter.Body.setPosition(this.body_bot, {x: this.body_bot.position.x + this.dx, y: this.body_bot.position.y});
            Matter.Body.setPosition(this.trigger, {x: this.trigger.position.x + this.dx, y: this.trigger.position.y});


            this.container.x = this.body_top.position.x - this.width / 2;   //Bug w/ img versus physical body, I think I need to add the Xoffset
            this.container.y = this.body_top.position.y - this.height / 2;
        }
    }

    createTile(top) {
        const gap = 300;
        const texture = "column"
        const column = App.sprite(texture);
        this.container.addChild(column);
        if (top){
            column.x = 0; 
            column.y = 0;
        } else{
            column.x = 0;
            column.y = gap + column.height;
            
        }

    }

    createContainer(yOffset, xOffset) {
        this.container = new PIXI.Container();
        this.container.x = xOffset;
        this.container.y = -200 - yOffset/2;
    }

    destroy() {
        Matter.World.remove(App.physics.world, this.body_top);
        Matter.World.remove(App.physics.world, this.body_bot);
        Matter.World.remove(App.physics.world, this.trigger);
        this.container.destroy();
    }

}