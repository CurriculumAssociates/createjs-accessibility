import AccessibilityModule from 'createjs-accessibility';

export default class Img extends createjs.Container {
  constructor(options, width, height) {
    super();
    AccessibilityModule.register({
      accessibleOptions: {
        alt: options.alt,
        height,
        longdesc: options.longdesc,
        src: options.src,
        width,
      },
      displayObject: this, 
      role: AccessibilityModule.ROLES.IMG,
    });
    this._options = options;
    this._image = new createjs.Bitmap(this._options.src);
    this._image.scaleX = this._options.cjsScaleX;
    this._image.scaleY = this._options.cjsScaleY;
    this.addChild(this._image);
  }
}
