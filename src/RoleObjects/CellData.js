import SectionData from './SectionData';

export default class CellData extends SectionData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    // Setting Default value for colspan and rowspan to 1
    this.colspan = 1;
    this.rowspan = 1;
  }

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
   * Sets the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * This value must be at least 1 (default) and low enough to avoid overlap with other cells in the same row
   * @access public
   * @param {Number} val - number
   */
  set colspan(val) {
    this._reactProps['aria-colspan'] = val;
  }

  /**
   * Gives the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get colspan() {
    return this._reactProps['aria-colspan'];
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
   * Sets the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * This value must be at least 1 (default) and low enough to avoid overlap with next cell in the same column.
   * Setting the value to 0 indicates that the cell or gridcell is to span all the remaining rows in the row group.
   * @access public
   * @param {Number} val - Positive number
   */
  set rowspan(val) {
    this._reactProps['aria-rowspan'] = val;
  }

  /**
   * Gives the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get rowspan() {
    return this._reactProps['aria-rowspan'];
  }
}
