import GridData from './GridData';

export default class TreeGridData extends GridData {
  /**
   * Sets the orientation
   * @access public
   * @param {String} str - "horizontal" for a horizontal tree
   * "vertical" for a vertical tree
   * undefined to unset this field
   */
  set orientation(str) {
    this._reactProps['aria-orientation'] = str;
  }

  /**
   * Retrieves the orientation
   * @access public
   * @returns  {String} str "horizontal" for a horizontal tree
   * "vertical" for a vertical tree
   * undefined if the field is unset
   */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  /**
   * Sets whether user input is required or not
   * @access public
   * @param {boolean} value - true if the element is required, false otherwise,
   * undefined to unset this field
   */
  set required(value) {
    this._reactProps['aria-required'] = value;
  }

  /**
   * Retrieves whether user input is required or not
   * @access public
   * @returns {boolean} true if the element is required, false otherwise,
   * undefined if this field is unset
   */
  get required() {
    return this._reactProps['aria-required'];
  }
}
