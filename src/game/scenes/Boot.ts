import { Scene } from "phaser";
import assets from "../assets";
import WebFont from "webfontloader";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  init() {
    //  Inject our CSS
    const element = document.createElement("style");
    document.head.appendChild(element);

    const sheet = element.sheet;
    let styles =
      '@font-face { font-family: "Pixelify"; src: url("assets/fonts/Pixelify.ttf") format("truetype"); }\n';
    sheet?.insertRule(styles, 0);
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    // Random menu background
    const backgrounds = Object.keys(assets.bg).map(
      (key) => assets.bg[key as keyof typeof assets.bg]
    );
    const menuBackground =
      backgrounds[Phaser.Math.Between(0, backgrounds.length - 1)];

    // Store background in registry
    this.registry.set("menuBackground", menuBackground);

    // Load the background image
    this.load.image(menuBackground, menuBackground);
  }

  create() {
    WebFont.load({
      custom: {
        families: ["Pixelify"],
      },
      active: () => {
        this.scene.start("Preloader");
      },
    });
  }
}
