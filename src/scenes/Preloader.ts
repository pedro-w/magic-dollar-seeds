import { Scene } from 'phaser';
// This code taken largely from the phaser.io "Create Game App" code
export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {

            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('player', 'Character Pink Girl.png')
        this.load.image('block', 'Brown Block.png')
        this.load.image('seed-block', 'Grass Block.png')
        this.load.image('dollar', 'Gem Blue.png')
        this.load.image('spend', 'Heart.png')
        this.load.image('stuck', 'stuck.png')
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
