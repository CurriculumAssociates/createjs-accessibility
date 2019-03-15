import AccessibilityObject from './AccessibilityObject';

export default class RangeData extends AccessibilityObject {
  /**
   * Set value
   * @access public
   * @param {Number} val - current value
   */
  set value(val) {
    this._reactProps['aria-valuenow'] = val;
  }

  /**
   * get value
   * @access public
   * @returns {Number}  current value
   */
  get value() {
    return this._reactProps['aria-valuenow'];
  }

  /**
   * Set min value
   * @access public
   * @param {Number} val - min value
   */
  set min(val) {
    this._reactProps['aria-valuemin'] = val;
  }

  /**
   * get min value
   * @access public
   * @returns {Number}  min value
   */
  get min() {
    return this._reactProps['aria-valuemin'];
  }

  /**
   * Set max value
   * @access public
   * @param {Number} val - max value
   */
  set max(val) {
    this._reactProps['aria-valuemax'] = val;
  }

  /**
   * get max value
   * @access public
   * @returns {Number} - max value
   */
  get max() {
    return this._reactProps['aria-valuemax'];
  }

  /**
   * If the valuetext attribute is set, authors SHOULD also set the value attribute,
   unless that value is unknown
   * Set the human readable text alternative of aria-valuenow for a range widget.
   * @access public
   * @param {String} val - text value
   */
  set valuetext(val) {
    this._reactProps['aria-valuetext'] = val;
  }

  /**
   * get text value
   * @access public
   */
  get valuetext() {
    return this._reactProps['aria-valuetext'];
  }
}
