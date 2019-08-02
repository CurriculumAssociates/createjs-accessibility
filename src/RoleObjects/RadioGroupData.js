import SelectData from './SelectData';

export default class RadioGroupData extends SelectData {
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

  /**
   * Sets whether user input is required or not
   * @access public
   * @param {boolean} value - true if the element is required, false otherwise
   */
  set required(value) {
    this._reactProps['aria-required'] = value;
  }

  /**
   * Retrieves whether user input is required or not
   * @access public
   * @returns {boolean} true if the element is required, false otherwise
   */
  get required() {
    return this._reactProps['aria-required'];
  }
}
