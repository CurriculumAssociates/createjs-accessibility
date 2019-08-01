import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

export default class Button extends createjs.Container {
  constructor(options, tabIndex, callBack = _.noop) {
    super();
    _.bindAll(this, '_onFocus', '_onBlur', '_onMouseDown', '_onMouseUp');
    this.callBack = callBack;
    this.addEventListener('focus', this._onFocus);
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('mousedown', this._onMouseDown);
    this.addEventListener('mouseup', this._onMouseUp);
    this.addEventListener('keyboardClick', this._onMouseDown);

    options.tabIndex = tabIndex;
    AccessibilityModule.register({
      displayObject: this,
      accessibleOptions: options,
      role: AccessibilityModule.ROLES.BUTTON,
      events: [
        {
          eventName: 'focus',
          listener: this._onFocus,
        },
        {
          eventName: 'blur',
          listener: this._onBlur,
        },
        {
          eventName: 'mousedown',
          listener: this._onMouseDown,
        },
        {
          eventName: 'mouseup',
          listener: this._onMouseUp,
        },
        {
          eventName: 'keyboardClick',
          listener: this._onMouseDown,
        },
      ],
    });

    this._options = options;
    this.enabled = options.enabled;
    this.name = options.name;
    this.type = options.type;
    this.value = options.value;
    this.width = options.width || 300;
    this.height = options.height || 60;

    this.background = new createjs.Shape();
    this.background.name = 'background';
    this.background.graphics.beginStroke('black').beginFill('#fff').drawRect(0, 0, this.width, this.height);
    this.addChild(this.background);

    this.focusRect = new createjs.Shape();
    this.focusRect.name = 'focusRect';
    this.focusRect.graphics.beginStroke('black').setStrokeStyle(3).beginFill('#fff').drawRect(0, 0, this.width, this.height);
    this.addChild(this.focusRect);
    this.focusRect.visible = false;

    this.text = new createjs.Text(this.value, 'bold 24px Arial', '#000');
    this.text.textAlign = 'center';
    this.text.textBaseline = 'middle';
    this.text.x = this.width / 2;
    this.text.y = this.height / 2;
    this.addChild(this.text);
    this.accessible.text = this.text.text;
    this.accessible.pressed = options.pressed;
  }

  set pressed(val) {
    this.accessible.pressed = val;
  }

  get pressed() {
    return this.accessible.pressed;
  }

  set enabled(value) {
    this.mouseEnabled = value;
    this.alpha = this.mouseEnabled ? 1 : 0.5;
    this._enabled = value;
    this.accessible.enabled = value;
  }

  get enabled() {
    return this._enabled;
  }

  _onFocus() {
    this.accessible.requestFocus();
    this.focusRect.visible = true;
  }

  _onBlur() {
    this.focusRect.visible = false;
  }

  _onMouseDown() {
    this.accessible.requestFocus();
    this.callBack();
  }

  _onMouseUp() {
    this.background.visible = true;
  }
}
