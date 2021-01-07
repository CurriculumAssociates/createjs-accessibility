import MenuItemData from './MenuItemData';

export default class MenuItemCheckBoxData extends MenuItemData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    this._reactProps['aria-checked'] = false;
  }

  /**
   * Sets whether the element is checked
   * @access public
   * @param {boolean} check - true if the element is checked,
   * false if the element is unchecked, mixed if the element
   * mixture of checked and unchecked values.
   */
  set checked(check) {
    this._reactProps['aria-checked'] = check;
  }

  /**
   * Retrieves whether the element is checked
   * @access public
   * @returns {boolean}  - true if the element is checked,
   * false if the element is unchecked, mixed if the element
   * mixture of checked and unchecked values.
   */
  get checked() {
    return this._reactProps['aria-checked'];
  }

  /**
   * Sets whether the element is editable or not
   * @access public
   * @param {boolean} value - true if the element should be read only, false for read and editable
   */
  set readOnly(value) {
    this._reactProps['aria-readonly'] = value;
  }

  /**
   * Retrieves whether the element is editable or not
   * @access public
   * @returns {boolean} true if the element should be read only, false for read and editable
   */
  get readOnly() {
    return this._reactProps['aria-readonly'];
  }
}
