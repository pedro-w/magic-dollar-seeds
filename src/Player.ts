import { Scene } from "phaser"
import { mapxy } from "./util"

export class Player {
    image: Phaser.GameObjects.Image
    _tileX: number
    _tileY:number
    scene: Scene
    constructor(scene: Scene, tileX:number, tileY:number) {
        this._tileX=tileX
        this._tileY = tileY
        this.scene = scene
        const {x,y} = mapxy(tileX, tileY)
        this.image = scene.add.image(x, y,'player').setDepth(0.5)

        // This is because of how the Plaet Cute GFX are positioned in their tiles
        this.image.setOrigin(0.5, 0.75)
    }
    set tileX(v: number) {
        this._tileX = v
        const {x,y} = mapxy(this._tileX, this._tileY)
        this.image.setPosition(x, y)
    }
    get tileX():number { return this._tileX}
    set tileY(v: number) {
        this._tileY = v
        const {x,y} = mapxy(this._tileX, this._tileY)
        this.image.setPosition(x, y)
    }
    get tileY():number { return this._tileY}
}