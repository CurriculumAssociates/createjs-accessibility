import AccessibilityModule from 'createjs-accessibility';

const tabHeight = 50;
export default class TabPanel extends createjs.Container {
  constructor(width = 800, height = 300) {
    super();
    this.width = width;
    this.height = height;
    this.setBounds(0, tabHeight, this.width, this.height);
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.TABPANEL,
    });

    const border = new createjs.Shape();
    border.graphics.setStrokeStyle('black');
    border.graphics.beginStroke('black');
    border.graphics.beginFill('#fff');
    border.graphics.drawRect(0, tabHeight, this.width, this.height);
    this.addChildAt(border, 0);
  }
}
