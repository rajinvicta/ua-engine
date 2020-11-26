class Colors {
    private constructor() { }

    // LEGACY, TIGHTLY COUPLED TO PHASER tween tint a sprite from color X to color Y
    /* public static tweenTint(spriteToTween: Phaser.GameObjects.Sprite, startColor: Phaser.Display.Color, endColor: Phaser.Display.Color, duration: number, scene: Phaser.Scene): void {
        var colorBlend = { step: 0 };
        let rgb = Phaser.Display.Color.Interpolate.ColorWithColor(startColor, endColor, 100);
        let seed = "" + rgb.r + rgb.g + rgb.b;
        scene.tweens.add({
            tint: Number(seed),
            targets: spriteToTween,
            duration: duration
        });
    } */
}

export default Colors;