import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import MenuItem from './MenuItem';
import CheckBox from './CheckBox';

/**
 * See https://www.w3.org/TR/wai-aria/#menuitemcheckbox
 */

export default class MenuItemCheckBox extends MenuItem {
  constructor(label, tabIndex, callBack = () => {}) {
    super(label, tabIndex);
    this.checkBox = new CheckBox(25, 25, tabIndex, callBack);
    this.addChild(this.checkBox);
    AccessibilityModule.register({
      accessibleOptions: {
        tabIndex,
        text: label,
      },
      displayObject: this,
      role: AccessibilityModule.ROLES.MENUITEMCHECKBOX,
    });
    this.addEventListener('keyboardClick', () => {
      this.checkBox.dispatchEvent('keyboardClick');
    });

    const checkBoxBounds = this.checkBox.getBounds();
    this._label.x = checkBoxBounds.x + checkBoxBounds.width + 2;
    this._label.y = checkBoxBounds.y + 5;
    this.checkBox.callBack = () => {
      this.accessible.checked = this.checkBox.checked;
      callBack(this);
    };
  }
}
