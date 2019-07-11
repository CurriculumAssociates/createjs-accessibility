import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class PlainTextMath extends createjs.Container {
  constructor(options) {
    super();
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.MATH,
      accessibleOptions: {
        label:options.label
      },
    });
    this._options = options;
    this._image = new createjs.Bitmap(this._options.src);
    this._image.scaleX = this._options.cjsScaleX;
    this._image.scaleY = this._options.cjsScaleY;
    this.addChild(this._image);
  }
}
