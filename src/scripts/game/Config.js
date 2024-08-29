import { Game } from "./Game";
import { Tools } from "../system/Tools";


//basically here we specify the assest location and which file types we'd like to accept and laod
export const Config = {
    bgSpeed: 2,
    gameOver: {
        x: window.innerWidth/2,
        y: window.innerHeight/2,
        anchor: 0.5,
        style: {
            fontFamily: "Fredoka One",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#FFFFFF"]
        }
    },
    score: {
        x: 10,
        y: 10,
        anchor: 0,
        style: {
            fontFamily: "Fredoka One",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#FFFFFF"]
        }
    },
    columns: {
        moveSpeed: -2,
        gap: 300,
        ranges: {
            xoffset: {
                min: 300,
                max: 400
            },
            yoffset: {
                min: 0,
                max: 400
            }
        }
    },
    bird: {
        jumpSpeed: 17,
        position: {
            x: 350,
            y: 300
        }
    },
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    scenes: {
        "Game": Game
    }
};