import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Column } from "./Column";

export class Columns {
    constructor() {
        this.columns = [];
        this.container = new PIXI.Container();

        this.createColumn({
            yOffset: 100,
            xOffset: 800
        });
    }

    createColumn(data) {
        const column = new Column(data.yOffset, data.xOffset);
        this.container.addChild(column.container);
        this.columns.push(column);
        this.current = column;
    }

    update() {
        //continue creating columns until last created column goes off screen
        if (this.current.container.x + this.current.container.width < window.innerWidth) {
            this.createColumn(this.randomData);
        }
        this.columns.forEach(column => column.move());

    }

    get randomData() {
        this.ranges = App.config.columns.ranges;
        let data = { xOffset: 0, yOffset: 0 };

        const offset_x = this.ranges.xoffset.min + Math.round(Math.random() * (this.ranges.xoffset.max - this.ranges.xoffset.min));
        const offset_y = this.ranges.yoffset.min + Math.round(Math.random() * (this.ranges.yoffset.max - this.ranges.yoffset.min));


        data.xOffset = this.current.container.x + this.current.container.width + offset_x;
        data.yOffset = this.current.container.y + this.current.container.width + offset_y;

        return data;
    }

    destroy() {
        this.columns.forEach(column => column.destroy());
        this.container.destroy();
    }
}