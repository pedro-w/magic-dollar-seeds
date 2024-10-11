import { Scene } from 'phaser';
import { FloorTile } from '../FloorTile';
import { Player } from '../Player';
import { unmapxy, valid_move } from '../util';

const MINSPEND=40

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    tiles: FloorTile[] = []
    player: Player
    score: Phaser.GameObjects.Text
    spend: Phaser.GameObjects.Image
    stuck: Phaser.GameObjects.Image
    _dollars = 0

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x101010);

        this.background = this.add.image(512, 384, 'background').setDepth(-1).setScrollFactor(0);
        this.background.setAlpha(0.5);
        this.score = this.add.text(15, 15, "Score", { fontFamily: "sans-serif", fontSize: 48, strokeThickness: 4, stroke: '#000', color: '#fff' }).setScrollFactor(0).setDepth(1)
        this.spend = this.add.image(920, 50, 'spend').setDepth(1).setScrollFactor(0).setVisible(false).setInteractive()
        this.spend.on('pointerdown', () => { this.onSpend() })
        this.stuck = this.add.image(500, 100, 'stuck').setDepth(1).setScrollFactor(0).setVisible(false).setInteractive()
        for (let j = 0; j < 15; ++j) {
            for (let i = 0; i < 30; ++i) {
                const name = `TILE-${i + 30 * j}`
                const tile = new FloorTile(this, i, j);
                this.tiles.push(tile)
                tile.name = name
            }

        }
        this.dollars = 0
        this.player = new Player(this, 15, 7);
        this.camera.startFollow(this.player.image)
        this.input.on('pointerdown', () => { this.onClick() })
    }
    onSpend() {
        if (this.dollars >= MINSPEND) {
            this.dollars -= MINSPEND
            this.dollarSurround()
            const x = this.player.tileX
            const y = this.player.tileY
            const tile = this.getTile(x, y)
            tile?.setHasSeed(false)
        }

    }
    onClick() {
        const pointer = this.input.activePointer
        // Where did we click?
        const { x: tileX, y: tileY } = unmapxy(pointer.worldX, pointer.worldY)

        if (tileX != null && tileY != null) {
            const newx = Math.round(tileX)
            const newy = Math.round(tileY)
            if (valid_move(this.player.tileX, this.player.tileY, newx, newy)) {
                const new_tile = this.getTile(newx, newy)
                if (!new_tile?.hole) {
                    this.add.tween({ targets: this.player, props: { tileX: newx, tileY: newy }, duration: 500, onComplete: () => this.onMoveComplete() })
                    const tile = this.getTile(this.player.tileX, this.player.tileY)
                    tile?.setHasSeed(true)
                }
            }
        }
    }
    isStuck() {
        const neighbours = this.getNeighbours()
        return neighbours.every((n) => n == null || n.hole)
    }
    dollarSurround() {
        const neighbours = this.getNeighbours()
        for (const neighbour of neighbours) {
            neighbour?.setHole(false).setHasSeed(false).setHasDollar(true)
        }
    }
    getNeighbours(): (FloorTile | undefined)[] {
        const x = this.player.tileX
        const y = this.player.tileY
        const tileLeft = this.getTile(x - 1, y)
        const tileRight = this.getTile(x + 1, y)
        const tileUp = this.getTile(x, y - 1)
        const tileDown = this.getTile(x, y + 1)
        return [tileLeft, tileRight, tileDown, tileUp]
    }
    onMoveComplete() {
        const x = this.player.tileX
        const y = this.player.tileY
        const tile = this.getTile(x, y)
        if (tile != null) {
            const neighbours = this.getNeighbours()
            // Collect dollars
            if (tile.hasDollar) {
                tile.hasDollar = false
                this.dollars += 10
            }
            // Create dollars
            else if (tile.hasSeed) {
                tile.hasSeed = false
                this.dollarSurround()
            }
            // Make some holes, two times
            for (let i = 0; i < 2; ++i) {
                const pick = Phaser.Utils.Array.GetRandom(neighbours)
                pick?.setHole(true).setHasDollar(false).setHasSeed(false)
            }
            if (this.isStuck() && this.dollars < MINSPEND) {
                this.stuck.setVisible(true)
                this.add.tween({ targets: this.stuck, props: { alpha: [0, 1] } })
                this.stuck.once('pointerdown', () => this.scene.start('MainMenu'))
            }
        }
    }
    getTile(tileX: number | undefined, tileY: number | undefined): FloorTile | undefined {
        if (tileX != null && tileY != null) {
            const x = Math.round(tileX)
            const y = Math.round(tileY)
            if (x >= 0 && x < 30 && y >= 0 && y < 15) {
                return this.tiles[x + 30 * y]
            }
        }
        return undefined
    }
    set dollars(v) {
        this.tweens.addCounter({ from: this._dollars, to: v, onUpdate: (t) => { const v = Math.round(t.getValue()); this.score.setText(`$${v}`) } })
        if (this._dollars>=MINSPEND && v < MINSPEND) {
            // can't spend any more
            this.add.tween({targets: this.spend, props:{alpha: 0}, onComplete: ()=>{this.spend.setVisible(false)}})
        }
        if (this._dollars < MINSPEND && v >=MINSPEND) {
            // we can spend
            this.spend.setVisible(true)
            this.add.tween({targets: this.spend, props:{alpha: 1}})
        }
        this._dollars = v
    }
    get dollars() { return this._dollars }
}
