import { GameObjects, Scene } from "phaser";
import CrtPipelinePlugin from "phaser3-rex-plugins/plugins/crtpipeline-plugin.js";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  logoTween: Phaser.Tweens.Tween | null;

  constructor() {
    super("MainMenu");
  }

  init() {
    //  Pixelated fade in effect
    this.cameras.main.fadeIn(100);
    const fxCamera = this.cameras.main.postFX.addPixelate(40);
    this.add.tween({
        targets: fxCamera,
        duration: 500,
        amount: -1,
    });

    // // Add a tween to rock the scene back and forth
    this.add.tween({
      targets: this.cameras.main,
      rotation: { from: -0.00872665, to: 0.00872665 },
      duration: 20 * 1000,
      yoyo: true,
      repeat: -1,
    });

    // Add CRT effect
    // This TS hack is needed until https://github.com/rexrainbow/phaser3-rex-notes/issues/500 is fixed
    const crtPlugin = this.plugins.get('rexCrtPipeline') as (CrtPipelinePlugin & {
      add: (
        target: Phaser.GameObjects.GameObject | Phaser.Cameras.Scene2D.Camera,
        config: {
          warpX?: number, warpY?: number,
          scanLineStrength?: number,
        },
      ) => void;
    }) | undefined;
    
    if (crtPlugin) {
      crtPlugin.add(this.cameras.main, {
        scanLineStrength: 0.1,
        warpX: 0.05,
        warpY: 0.05,
      });
    }
  }

  create() {
    this.background = this.add.image(0, 0, this.registry.get("menuBackground"));
    this.background.setDisplaySize(this.scale.width, this.scale.height);
    this.background.setOrigin(0, 0);

    // Center coordinates
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Center the logo and ensure it does not exceed the screen width
    this.logo = this.add.image(centerX, centerY - 100, "logo").setDepth(100);
    this.logo.setScale(250 / this.logo.width);
    if (this.logo.width > this.scale.width) {
      this.logo.setScale(this.scale.width / this.logo.width);
    }

    // Center the title and ensure it does not exceed the screen width
    this.title = this.add
      .text(centerX, centerY + 60, "Company Manager", {
        fontFamily: "Pixelify",
        fontSize: 48,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
        wordWrap: { width: this.scale.width - 20 } // Add some padding
      })
      .setOrigin(0.5)
      .setDepth(100);

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    if (this.logoTween) {
      this.logoTween.stop();
      this.logoTween = null;
    }

    this.scene.start("Game");
  }

  moveLogo(reactCallback: ({ x, y }: { x: number; y: number }) => void) {
    if (this.logoTween) {
      if (this.logoTween.isPlaying()) {
        this.logoTween.pause();
      } else {
        this.logoTween.play();
      }
    } else {
      this.logoTween = this.tweens.add({
        targets: this.logo,
        x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
        y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
        yoyo: true,
        repeat: -1,
        onUpdate: () => {
          if (reactCallback) {
            reactCallback({
              x: Math.floor(this.logo.x),
              y: Math.floor(this.logo.y),
            });
          }
        },
      });
    }
  }
}
