import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class CheckBox extends createjs.Container {
  constructor(width, height, tabIndex, callBack = () => {}) {
    super();
    this.width = width;
    this.height = height;
    this.callBack = callBack;
    this.checked = false;
    AccessibilityModule.register({
      accessibleOptions: { tabIndex },
      displayObject: this,
      role: AccessibilityModule.ROLES.CHECKBOX,
    });
    this._createAsset();
  }

  _createAsset() {
    this._addBoxArea();
    this._addCheckMark();
    this._addInteraction();
  }

  _addBoxArea() {
    const box = new createjs.Shape();
    box.graphics
      .setStrokeStyle(1)
      .beginFill('#DEDEDE')
      .beginStroke('#424242')
      .drawRect(0, 0, this.width, this.height);
    box.setBounds(0, 0, this.width, this.height);
    this.addChild(box);

    const focusRect = new createjs.Shape();
    focusRect.graphics
      .setStrokeStyle(5)
      .beginStroke('#5FC1FA')
      .drawRect(-2.5, -2.5, this.width + 5, this.height + 5);
    focusRect.setBounds(0, 0, this.width + 5, this.height + 5);
    this.addChild(focusRect);
    focusRect.visible = false;

    this.focusRect = focusRect;
  }

  _addCheckMark() {
    const checkMark = new createjs.Shape();
    checkMark.graphics
      .setStrokeStyle(this.width / 4)
      .beginStroke('#424242')
      .moveTo(0, this.height * 0.4)
      .lineTo(this.width * 0.3, this.height - 8)
      .lineTo(this.width - 6, 0);
    this.addChild(checkMark);

    checkMark.set({ x: 2, y: 2 });

    checkMark.visible = false;
    this.checkMark = checkMark;
  }

  _addInteraction() {
    this.addEventListener('mousedown', this.onChange.bind(this));
    this.addEventListener('keyboardClick', this.onChange.bind(this));
    this.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('blur', this.onBlur.bind(this));
  }

  onChange() {
    this.accessible.requestFocus();
    this.checked = !this.checked;
    this.checkMark.visible = this.checked;
    this.accessible.checked = this.checked;
    this.callBack();
  }

  onFocus() {
    this.focusRect.visible = true;
  }

  onBlur() {
    this.focusRect.visible = false;
  }
}
