import { Scene } from "phaser";
import { mapxy } from './util'
export class FloorTile {
    block: Phaser.GameObjects.Container
    plain: Phaser.GameObjects.Image
    seed: Phaser.GameObjects.Image
    dollar: Phaser.GameObjects.Image
    tileX: number
    tileY: number
    scene: Phaser.Scene
    name: string = "ANON"
    private _hole: boolean = false
    private _seed: boolean = false
    private _hasDollar: boolean = false
    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.tileX = x;
        this.tileY = y;
        const { x: px, y: py } = mapxy(x, y)
        this.plain = scene.add.image(0, 0, 'block')
        this.seed = scene.add.image(0, 0, 'seed-block')
        this.block = scene.add.container(px, py, [this.plain, this.seed])
        this.dollar = scene.add.image(px, py - 40, 'dollar')
        this.seed.alpha = 0.0
        this.dollar.alpha = 0.0
        this.dollar.active = false
    }
    // Property accessors - use the 'native' style,
    // this.prop = val
    // and the Phaser style
    // this.setProp(val)
    // Reason: the second form can be chained and used with elvis operator
    set hasSeed(yes: boolean) { this.setHasSeed(yes) }
    setHasSeed(yes: boolean): this {
        if (yes != this._seed) {
            if (yes) {
                this.scene.tweens.add({targets: this.seed, alpha: 1.0, duration: 1000})
                this._seed = true
            } else {
                this.seed.alpha = 0.0
                this._seed = false
            }
        }
        return this
    }
    get hasSeed(): boolean { return this._seed }
    set hasDollar(yes: boolean) { this.setHasDollar(yes) }
    setHasDollar(yes: boolean): this {
        if (yes != this._hasDollar) {
            let config: Phaser.Types.Tweens.TweenBuilderConfig
            if (yes) {
                this.dollar.active = true
                this.dollar.alpha = 0.0
                config = { targets: this.dollar, props: { 'alpha': 1.0 }, duration: 1000 }
            } else {
                this.dollar.alpha = 1.0
                config = { targets: this.dollar, props: { 'alpha': 0.0 }, duration: 1000, onComplete: () => { this.dollar.active = false } }

            }
            this.scene.add.tween(config)
            this._hasDollar = yes
        }
        return this
    }
    get hasDollar(): boolean { return this._hasDollar }
    set hole(yes: boolean) { this.setHole(yes) }
    setHole(yes: boolean): this {
        if (yes != this._hole) {
            let config: Phaser.Types.Tweens.TweenBuilderConfig
            if (yes) {
                const vec = mapxy(this.tileX, this.tileY, -3)
                config = { targets: this.block, props: { 'y': vec.y, 'alpha': 0 } }
            } else {
                const vec = mapxy(this.tileX, this.tileY, 0)
                config = { targets: this.block, props: { 'y': vec.y, 'alpha': 1 } }

            }
            this.scene.add.tween(config)
            this._hole = yes
        }
        return this
    }
    get hole() { return this._hole }
}