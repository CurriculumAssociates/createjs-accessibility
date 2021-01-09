import SectionData from './SectionData';

export default class CellData extends SectionData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
  }

  /**
   * Sets an element's column index or position with respect to the total number
   * of columns within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - positive number for column index.  undefined to unset the field.
   */
  set colindex(val) {
    this._reactProps['aria-colindex'] = val;
  }

  /**
   * Gives an element's column index or position with respect to the total
   * number of columns within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - column index.  undefined if the field is unset
   */
  get colindex() {
    return this._reactProps['aria-colindex'];
  }

  /**
   * Sets the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - number of columns spanned by this cell.  undefined to unset the field
   */
  set colspan(val) {
    this._reactProps['colspan'] = val;
  }

  /**
   * Gives the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - number of columns spanned by the cell.  undefined if the field is unset
   */
  get colspan() {
    return this._reactProps['colspan'];
  }

  /**
   * Sets an element's row index or position with respect to the total
   * number of rows within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set rowindex(val) {
    this._reactProps['aria-rowindex'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total
   * number of rows within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get rowindex() {
    return this._reactProps['aria-rowindex'];
  }

  /**
   * Sets the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - number of rows spanned by this cell.  undefined to unset the field
   */
  set rowspan(val) {
    this._reactProps['rowspan'] = val;
  }

  /**
   * Gives the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - number of rows spanned by the cell.  undefined if the field is unset
   */
  get rowspan() {
    return this._reactProps['rowspan'];
  }
}
