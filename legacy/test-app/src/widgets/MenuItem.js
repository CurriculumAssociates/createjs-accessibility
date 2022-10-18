import _ from 'lodash';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';

/**
 * See https://www.w3.org/TR/wai-aria/roles#menuitem
 */
export default class MenuItem extends createjs.Container {
  constructor(label, tabIndex) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur');

    this._label = new createjs.Text(label, '16px Arial');
    this.addChild(this._label);

    this.setupFocusIndicator();

    const bounds = this._label.getBounds();
    this._label.hitArea = new createjs.Shape();
    this._label.hitArea.graphics
      .beginFill('#ff0000')
      .drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

    AccessibilityModule.register({
      accessibleOptions: { tabIndex, text: label },
      displayObject: this,
      role: AccessibilityModule.ROLES.MENUITEM,
      events: [
        {
          eventName: 'focus',
          listener: this.onFocus,
        },
        {
          eventName: 'blur',
          listener: this.onBlur,
        },
      ],
    });
  }

  setupFocusIndicator() {
    const bounds = this.getBounds();
    this._focusIndicator = new createjs.Shape();
    this._focusIndicator.visible = false;
    this._focusIndicator.graphics
      .clear()
      .setStrokeStyle(5)
      .beginStroke('#5FC1FA')
      .drawRect(-2.5, -2.5, bounds.width + 5, bounds.height + 5);
    this.addChild(this._focusIndicator);
  }

  onFocus() {
    this._focusIndicator.visible = true;
  }

  onBlur() {
    this._focusIndicator.visible = false;
  }
}
