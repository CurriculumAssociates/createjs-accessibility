import AccessibilityObject from './AccessibilityObject';

export default class OptionData extends AccessibilityObject {
  addChild() {
    throw new Error(`${this.role} cannot have children`);
  }

  addChildAt() {
    throw new Error(`${this.role} cannot have children`);
  }

  /**
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled, false otherwise
   */
  set enabled(enable) {
    this._reactProps.disabled = enable ? undefined : 'disabled';
  }

  /**
   * Retrieves whether the element is enabled
   * @access public
   * @returns {boolean} true if the element is enabled, false otherwise
   */
  get enabled() {
    return this._reactProps.disabled !== 'disabled';
  }

  /**
   * Sets the position in the current set of items
   * @access public
   * @param {Number} num - One based index for the position in the current set of items.  Or undefined to clear the field
   */
  set positionInSet(num) {
    this._reactProps['aria-posinset'] = num;
  }

  /**
   * Retrieves the position in the current set of items
   * @access public
   * @returns {Number} One based index for the position in the current set of items
   */
  get positionInSet() {
    return this._reactProps['aria-posinset'];
  }

  /**
   * Sets the number of items in the current set of items
   * @access public
   * @param {Number} num - Number of items in the current set.  Or undefined to clear the field
   */
  set setSize(num) {
    this._reactProps['aria-setsize'] = num;
  }

  /**
   * Retrieves the number of items in the current set of items
   * @access public
   * @returns {Number} the number of items in the current set of items
   */
  get setSize() {
    return this._reactProps['aria-setsize'];
  }

  /**
   * Sets value used to identify the option
   * @access public
   * @param {String} str - value to identify the option
   */
  set value(str) {
    this._reactProps.value = str;
  }

  /**
   * Retrieves the value that identifies the option
   * @access public
   * @returns {String} value to identify the option
   */
  get value() {
    return this._reactProps.value;
  }
}
