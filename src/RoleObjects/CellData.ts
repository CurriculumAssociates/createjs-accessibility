import SectionData from './SectionData';

export default class CellData extends SectionData {
  /**
   * Sets an element's column index or position with respect to the total number
   * of columns within a table, grid, or treegrid.
   * @access public
   * @param {number} val - positive number for column index.  undefined to unset the field.
   */
  set colIndex(val: number) {
    this._reactProps['aria-colindex'] = val;
  }

  /**
   * Gives an element's column index or position with respect to the total
   * number of columns within a table, grid, or treegrid.
   * @access public
   * @returns {number} - column index.  undefined if the field is unset
   */
  get colIndex(): number {
    return <number>this._reactProps['aria-colindex'];
  }

  /**
   * Sets the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @param {number} val - number of columns spanned by this cell.  undefined to unset the field
   */
  set colSpan(val: number) {
    this._reactProps.colSpan = val;
  }

  /**
   * Gives the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @returns {number} - number of columns spanned by the cell.  undefined if the field is unset
   */
  get colSpan(): number {
    return <number>this._reactProps.colSpan;
  }

  /**
   * Sets an element's row index or position with respect to the total
   * number of rows within a table, grid, or treegrid.
   * @access public
   * @param {number} val - Positive number
   */
  set rowIndex(val: number) {
    this._reactProps['aria-rowindex'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total
   * number of rows within a table, grid, or treegrid.
   * @access public
   * @returns {number} - Positive number
   */
  get rowIndex(): number {
    return <number>this._reactProps['aria-rowindex'];
  }

  /**
   * Sets the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @param {number} val - number of rows spanned by this cell.  undefined to unset the field
   */
  set rowSpan(val: number) {
    this._reactProps.rowSpan = val;
  }

  /**
   * Gives the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @access public
   * @returns {number} - number of rows spanned by the cell.  undefined if the field is unset
   */
  get rowSpan(): number {
    return <number>this._reactProps.rowSpan;
  }
}
