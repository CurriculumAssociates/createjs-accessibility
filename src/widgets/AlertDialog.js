import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import Button from './Button.js';

export default class AlertDialog extends createjs.Container {
  constructor({ tabIndex, doneCallback, cancelCallback }) {
    super();
    this.tabIndex = tabIndex;
    AccessibilityModule.register({
      displayObject: this,
      role: AccessibilityModule.ROLES.ALERTDIALOG,
    });
    this._createView(cancelCallback, doneCallback);
  }

  _createView(cancelCallback, doneCallback) {
    const blackTintBg = new createjs.Shape();
    blackTintBg.graphics.beginStroke('black').beginFill('black').drawRect(0, 0, 800, 600);
    blackTintBg.alpha = 0.7;
    this.addChild(blackTintBg);

    const dialogBox = new createjs.Container();
    AccessibilityModule.register({
      displayObject: dialogBox,
      parent: this,
      role: AccessibilityModule.ROLES.NONE,
    });
    dialogBox.x = 200;
    this.addChild(dialogBox);
    this.accessible.addChild(dialogBox);

    const bg = new createjs.Shape();
    bg.graphics.beginStroke('black').beginFill('white').setStrokeStyle(4).drawRoundRect(0, 0, 400, 250, 7);
    dialogBox.addChild(bg);

    const alertLabel = new createjs.Text('Do you want to reset form?', 'Bold 18px Arial', 'black');
    alertLabel.set({ x: 50, y: 50 });
    AccessibilityModule.register({
      displayObject: alertLabel,
      parent: dialogBox,
      role: AccessibilityModule.ROLES.NONE,
    });
    dialogBox.addChild(alertLabel);
    dialogBox.accessible.addChild(alertLabel);

    const cancelBtn = this._createButton('Cancel', cancelCallback);
    dialogBox.addChild(cancelBtn);
    dialogBox.accessible.addChild(cancelBtn);
    cancelBtn.set({ x: 20, y: 170 });
    const doneBtn = this._createButton('Yes', doneCallback);
    dialogBox.addChild(doneBtn);
    dialogBox.accessible.addChild(doneBtn);
    doneBtn.set({ x: 220, y: 170 });
  }

  _createButton(text, callback) {
    const btnData = {
      type: 'button',
      value: text,
      name: text,
      enabled: true,
      autoFocus: false,
      height: 60,
      width: 150,
    };
    return new Button(btnData, this.tabIndex++, callback);
  }
}
