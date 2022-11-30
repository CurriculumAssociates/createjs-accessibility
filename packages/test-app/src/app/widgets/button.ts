import {
  DisplayObjectTreeNode,
  registerTreeNode,
  Role,
} from '@curriculumassociates/accessibility-createjs-adapter';

export default class Button extends createjs.Container {
  accessible: DisplayObjectTreeNode;
  callBack: (evt: Event) => void;
  text: createjs.Text;
  focusIndicator: createjs.Shape;
  background: createjs.Shape;
  _options: any;
  type: any;
  value: any;
  width: any;
  height: any;
  _enabled: any;

  constructor(options, tabIndex, callBack?: (evt: Event) => void) {
    super();
    this.callBack = callBack;
    this.addEventListener('focus', this._onFocus);
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('click', this._onClick);
    this.addEventListener('keyboardClick', this._onClick);

    this.accessible = registerTreeNode({
      viewObject: this,
      role: Role.button,
      eventListeners: {
        focus: { listener: this._onFocus },
        blur: { listener: this._onBlur },
        keyboardClick: { listener: this._onClick },
      },
      attributes: {
        tabIndex,
        ...options,
      },
    });

    // AccessibilityModule.register({
    //   displayObject: this,
    //   accessibleOptions: options,
    //   role: AccessibilityModule.ROLES.BUTTON,
    //   events: [
    //     {
    //       eventName: 'focus',
    //       listener: this._onFocus,
    //     },
    //     {
    //       eventName: 'blur',
    //       listener: this._onBlur,
    //     },
    //     {
    //       eventName: 'keyboardClick',
    //       listener: this._onClick,
    //     },
    //   ],
    // });

    this._options = options;
    this.enabled = options.enabled;
    this.name = options.name;
    this.type = options.type;
    this.value = options.value;
    this.width = options.width || 300;
    this.height = options.height || 60;

    this._addBackground();
    this._addFocusIndicator();
    this._addText();
    this.accessible.attributes.ariaLabel = this.text.text;
    this.accessible.attributes.ariaPressed = options.pressed;
  }

  set pressed(val) {
    this.accessible.attributes.ariaPressed = val;
  }

  get pressed() {
    return this.accessible.attributes.ariaPressed;
  }

  set enabled(value) {
    this.mouseEnabled = value;
    this.alpha = this.mouseEnabled ? 1 : 0.5;
    this._enabled = value;
    this.accessible.attributes.disabled = !value;
  }

  get enabled() {
    return this._enabled;
  }

  _onFocus = (evt) => {
    this.focusIndicator.visible = true;
  }

  _onBlur = (evt) => {
    this.focusIndicator.visible = false;
  }

  _onClick = (evt) => {
    this.accessible.requestFocus();
    this.callBack(evt);
  }

  _addBackground() {
    this.background = new createjs.Shape();
    this.background.name = 'background';
    this.background.graphics
      .beginStroke('black')
      .drawRect(0, 0, this.width, this.height);
    this.addChild(this.background);
  }

  _addFocusIndicator() {
    this.focusIndicator = new createjs.Shape();
    this.focusIndicator.name = 'focusIndicator';
    this.focusIndicator.graphics
      .setStrokeStyle(5)
      .beginStroke('#5FC1FA')
      .drawRect(-2.5, -2.5, this.width + 5, this.height + 5);
    this.addChild(this.focusIndicator);
    this.focusIndicator.visible = false;
  }

  _addText() {
    this.text = new createjs.Text(this.value, 'bold 24px Arial', '#000');
    this.text.textAlign = 'center';
    this.text.textBaseline = 'middle';
    this.text.x = this.width / 2;
    this.text.y = this.height / 2;
    this.addChild(this.text);
  }
}
