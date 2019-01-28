import AccessibilityModule from 'createjs-accessibility';

export default class Separator extends createjs.Container {
  constructor(width, height, orientation = 'horizontal') {
    super();
    const separator = new createjs.Shape();
    separator.graphics.f('#000000').r(0, 0, width, height);
    AccessibilityModule.register({
      accessibleOptions: { orientation },
      displayObject: this,
      role: AccessibilityModule.ROLES.SEPARATOR,
    });
    this.setBounds(0, 0, width, height);
    this.addChild(separator);
  }
}
