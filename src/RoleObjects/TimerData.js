import AccessibilityObject from './AccessibilityObject';

export default class TimerData extends AccessibilityObject {
  /**
   * Sets the machine-readable time
   * @access public
   * @param {String} time - string containing the machine-readable time.
   * undefined to unset the field.
   */
  set dateTime(time) {
    this._reactProps.dateTime = time;
  }

  /**
   * Gets the machine-readable time
   * @access public
   * @returns {String} string containing the machine-readable time.
   * undefined if the field is unset.
   */
  get dateTime() {
    return this._reactProps.dateTime;
  }
}
