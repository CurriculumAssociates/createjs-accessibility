import _ from 'lodash';
import AccessibilityModule from 'createjs-accessibility';

/**
 * See https://www.w3.org/TR/wai-aria/roles#menuitem
 */
export default class MenuItem extends createjs.Container {
  constructor(label, tabIndex) {
    super();
    _.bindAll(this, 'onFocus', 'onBlur');

    this._focusIndicator = new createjs.Shape();
    this._focusIndicator.visible = false;
    this.addChild(this._focusIndicator);

    this._label = new createjs.Text(label, '16px Arial');
    this.addChild(this._label);

    const bounds = this._label.getBounds();
    this._label.hitArea = new createjs.Shape();
    this._label.hitArea.graphics.beginFill('#ff0000').drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

    AccessibilityModule.register({
      accessibleOptions: { tabIndex, text: label },
      displayObject: this,
      role: AccessibilityModule.ROLES.MENUITEM,
    });

    this.addEventListener('focus', this.onFocus);
    this.addEventListener('blur', this.onBlur);
  }

  setMenuWidth(x, width) {
    const bounds = this.getBounds();
    this._focusIndicator.graphics
      .clear()
      .beginFill('#31c7ec')
      .drawRect(x, bounds.y, width, bounds.height)
    ;
  }

  onFocus() {
    this._focusIndicator.visible = true;
  }

  onBlur() {
    this._focusIndicator.visible = false;
  }
}
