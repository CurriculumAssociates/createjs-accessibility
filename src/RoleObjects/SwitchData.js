import ButtonData from './ButtonData.js';

/**
 *   This contains only setters/getters for SwitchData class.
 */
export default class SwitchData extends ButtonData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    this._reactProps['aria-checked'] = false;
  }

  /**
   * Sets whether the element is checked
   * @access public
   * @param {boolean} check - true if the element is checked, false otherwise
   */
  set checked(check) {
    this._reactProps['aria-checked'] = check;
  }

  /**
   * Retrieves whether the element is checked
   * @access public
   * @returns {boolean} true if the element is checked, false otherwise
   */
  get checked() {
    return this._reactProps['aria-checked'];
  }
}
