import AccessibilityModule from 'createjs-accessibility';

export default class Switch extends createjs.Container {
  constructor(width, height, tabIndex, callBack = _.noop) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur', 'onChange');
    this.width = width;
    this.height = height;
    this.callBack = callBack;
    this.checked = false;

    AccessibilityModule.register({
      accessibleOptions: { tabIndex },
      displayObject: this,
      role: AccessibilityModule.ROLES.SWITCH,
    });

    this._createAsset();
    this.addEventListener('focus', this.onFocus);
    this.addEventListener('blur', this.onBlur);
    this.addEventListener('mousedown', this.onChange);
    this.addEventListener('keyboardClick', this.onChange);
  }

  _createAsset() {
    const focusRect = new createjs.Shape();
    focusRect.graphics
      .setStrokeStyle(5)
      .beginStroke('#5FC1FA')
      .drawRect(-2.5, -2.5, this.width + 5, this.height + 5);
    focusRect.setBounds(0, 0, this.width + 5, this.height + 5);
    this.addChild(focusRect);
    focusRect.visible = false;

    this.focusRect = focusRect;

    const background = new createjs.Shape();
    background.graphics.beginStroke('black').beginFill('#fff').drawRect(0, 0, this.width, this.height);
    background.setBounds(0, 0, this.width, this.height);
    this.addChild(background);


    this.offCircle = new createjs.Shape();
    this.offCircle.graphics.beginFill('#FF830F').drawCircle(0, 0, 11);
    this.offCircle.x = 15;
    this.offCircle.y = this.height * 0.5;
    this.offCircle.visible = true;
    this.addChild(this.offCircle);

    this.offText = new createjs.Text('0.5', 'bold 24px Arial', '#FF830F');
    this.offText.x = 30;
    this.offText.y = this.height * 0.20;
    this.offText.visible = true;
    this.addChild(this.offText);
    AccessibilityModule.register({
      displayObject: this.offText,
      parent: this,
      role: AccessibilityModule.ROLES.NONE,
    });

    this.onCircle = new createjs.Shape();
    this.onCircle.graphics.beginFill('#FF0400').drawCircle(0, 0, 11);
    this.onCircle.x = 60;
    this.onCircle.y = this.height * 0.5;
    this.onCircle.visible = false;
    this.addChild(this.onCircle);


    this.onText = new createjs.Text('1', 'bold 24px Arial', '#FF0400');
    this.onText.x = 10;
    this.onText.y = this.height * 0.20;
    this.onText.visible = false;
    this.addChild(this.onText);
    AccessibilityModule.register({
      displayObject: this.onText,
      parent: this,
      role: AccessibilityModule.ROLES.NONE,
    });
  }

  onChange() {
    this.accessible.requestFocus();
    this.checked = !this.checked;
    this.accessible.checked = this.checked;
    this.switchOn = this.checked;
    this.switchOff = !this.checked;
    this.callBack(this.checked);
  }

  set switchOn(value) {
    this.onCircle.visible = value;
    this.onText.visible = value;
  }

  set switchOff(value) {
    this.offCircle.visible = value;
    this.offText.visible = value;
  }
  onFocus() {
    this.focusRect.visible = true;
  }

  onBlur() {
    this.focusRect.visible = false;
  }
}
