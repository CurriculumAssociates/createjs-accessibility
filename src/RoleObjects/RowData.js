import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import GroupData from './GroupData';

export default class RowData extends GroupData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, 'onKeyDown');
    this._reactProps.onKeyDown = this.onKeyDown;
  }

  /**
   * Sets an element's column index or position with respect to the total number
     of columns within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set colindex(val) {
    this._reactProps['aria-colindex'] = val;
  }

  /**
   * Gives an element's column index or position with respect to the total number of
     columns within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get colindex() {
    return this._reactProps['aria-colindex'];
  }

  /**
   * Sets an element's row index or position with respect to the total number of
     rows within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set rowindex(val) {
    this._reactProps['aria-rowindex'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total number of rows
    within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get rowindex() {
    return this._reactProps['aria-rowindex'];
  }

  /**
   * Sets an element's row index or position with respect to the total number of rows
    within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set level(val) {
    this._reactProps['aria-level'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total number of rows
    within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get level() {
    return this._reactProps['aria-level'];
  }

  /**
   * Keydown listener for an row item
   * @access private
   */
  onKeyDown(evt) {
    if (evt.keyCode === KeyCodes.enter) {
      const event = new createjs.Event('keyboardClick', false, evt.cancelable);
      const skipPreventDefault = this._displayObject.dispatchEvent(event);
      if (!skipPreventDefault) {
        evt.preventDefault();
      }
      evt.stopPropagation();
    }
  }
}
