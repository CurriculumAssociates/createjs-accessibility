import _ from 'lodash';
import AccessibilityModule from 'createjs-accessibility';

export default class Tab extends createjs.Container {
  /**
   * Initialize the class parameters & assign accessibilty role
   * @param {string} name - Name of Tab button
   * @param {string} value - value of Tab Button
   * @param {integer} position - position of the tab button in the tab list
   * @param {integer} size - size of the tab list
   */

  constructor({ name, value, width = 300, height = 50, position = 1, size = 1, tabIndex, callback = _.noop }) {
    super();
    this.data = { name, value };
    this.width = width;
    this.height = height;
    this.callBack = callback;
    this.setBounds(0, 0, this.width, this.height);

    // Assign accessibilty role
    AccessibilityModule.register({
      accessibleOptions: {
        position,
        selected: false,
        size,
        tabIndex,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.TAB,
    });

    _.bindAll(this, '_onFocus', '_onBlur', '_onMouseDown');
    this.addEventListener('focus', this._onFocus);
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('mousedown', this._onMouseDown);
    this.addEventListener('keyboardClick', this._onMouseDown);

    const tab = new createjs.Shape();
    tab.graphics.setStrokeStyle('black');
    tab.graphics.beginStroke('black');
    tab.graphics.beginFill('#fff');
    tab.graphics.drawRect(0, 0, this.width, this.height);
    this.addChild(tab);

    this.focusRect = new createjs.Shape();
    this.focusRect.graphics.beginStroke('black');
    this.focusRect.graphics.setStrokeStyle(3);
    this.focusRect.graphics.beginFill('#fff');
    this.focusRect.graphics.drawRect(0, 0, this.width, this.height);
    this.addChild(this.focusRect);
    this.focusRect.visible = false;

    const tabText = new createjs.Text(this.data.value, 'bold 24px Arial', '#000');
    const tabTextBounds = tabText.getBounds();
    tabText.x = this.width * 0.5 - tabTextBounds.width * 0.5;
    tabText.y = this.height * 0.5 - tabTextBounds.height * 0.5;
    tabText.lineWidth = this.width * 3 - 20;
    this.addChild(tabText);
    this.accessible.text = tabText.text;
  }

  _onFocus() {
    this.accessible.requestFocus();
    this.focusRect.visible = true;
  }

  _onBlur() {
    this.focusRect.visible = false;
    this.accessible.selected = false;
  }

  _onMouseDown() {
    this.accessible.requestFocus();
    this.accessible.selected = true;
    this.callBack(this);
  }
}
