import GroupData from './GroupData';

export default class RowData extends GroupData {
  /**
   * Sets an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set colindex(val) {
    this._reactProps['aria-colindex'] = val;
  }

  /**
   * Gives an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get colindex() {
    return this._reactProps['aria-colindex'];
  }

  /**
   * Sets an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set rowindex(val) {
    this._reactProps['aria-rowindex'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get rowindex() {
    return this._reactProps['aria-rowindex'];
  }
  /**
   * Sets an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set level(val) {
    this._reactProps['aria-level'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get level() {
    return this._reactProps['aria-level'];
  }
}
