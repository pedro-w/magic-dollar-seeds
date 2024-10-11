import { Scene } from 'phaser';
// This code taken largely from the phaser.io "Create Game App" code
export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {

        this.load.image('background', 'assets/bg.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
