import Img from './Img.js';
import AccessibilityModule from 'createjs-accessibility';

export default class Figure extends createjs.Container {
  constructor(option, caption) {
    super();
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.FIGURE,
    });

    // Image
    const imgHolder = new createjs.Container();
    AccessibilityModule.register({
      displayObject: imgHolder,
      parent: this,
      role: AccessibilityModule.ROLES.PRESENTATION,
    });
    this.addChild(imgHolder);

    const img = new Img(option, option.width, option.height);
    imgHolder.addChild(img);
    imgHolder.accessible.addChild(img);

    // Caption
    const figCaption = new createjs.Text(caption, '16px Arial');
    AccessibilityModule.register({
      displayObject: figCaption,
      parent: this,
      role: AccessibilityModule.ROLES.FIGCAPTION,
    });
    figCaption.x = img.x + (option.width - figCaption.getBounds().width) / 2;
    figCaption.y = img.y + option.height;
    this.addChild(figCaption);
  }
}
