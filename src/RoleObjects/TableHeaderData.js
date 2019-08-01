import CellData from './CellData';

export default class TableHeaderData extends CellData {
  /**
   * Sets the value.
   * @access public
   * @param {Token} val - ascending, descending, none or other.
   */
  set sort(val) {
    this._reactProps['aria-sort'] = val;
  }

  /**
   * Indicates if items in a table or grid are sorted in ascending or descending order.
   * @access public
   * @returns {Token} val - ascending, descending, none or other.
   */
  get sort() {
    return this._reactProps['aria-sort'];
  }
}
