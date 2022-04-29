import GroupData from './GroupData';
import { ROLES } from '../Roles';

export default class RowData extends GroupData {
  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (
      !displayObject.accessible
      || (displayObject.accessible.role !== ROLES.CELL
        && displayObject.accessible.role !== ROLES.GRIDCELL
        && displayObject.accessible.role !== ROLES.COLUMNHEADER
        && displayObject.accessible.role !== ROLES.ROWHEADER)
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.CELL}, ${ROLES.GRIDCELL}, ${ROLES.COLUMNHEADER}, or ${ROLES.ROWHEADER}`
      );
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (
      !displayObject.accessible
      || (displayObject.accessible.role !== ROLES.CELL
        && displayObject.accessible.role !== ROLES.GRIDCELL
        && displayObject.accessible.role !== ROLES.COLUMNHEADER
        && displayObject.accessible.role !== ROLES.ROWHEADER)
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.CELL}, ${ROLES.GRIDCELL}, ${ROLES.COLUMNHEADER}, or ${ROLES.ROWHEADER}`
      );
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Sets an element's column index or position with respect to the total number
   * of columns within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set colIndex(val) {
    this._reactProps['aria-colindex'] = val;
  }

  /**
   * Gives an element's column index or position with respect to the total number of
   * columns within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get colIndex() {
    return this._reactProps['aria-colindex'];
  }

  /**
   * Sets an element's row index or position with respect to the total number of
   * rows within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set rowIndex(val) {
    this._reactProps['aria-rowindex'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total number of rows
   *  within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get rowIndex() {
    return this._reactProps['aria-rowindex'];
  }

  /**
   * Sets an element's row index or position with respect to the total number of rows
   * within a table, grid, or treegrid.
   * @access public
   * @param {Number} val - Positive number
   */
  set level(val) {
    this._reactProps['aria-level'] = val;
  }

  /**
   * Gives an element's row index or position with respect to the total number of rows
   * within a table, grid, or treegrid.
   * @access public
   * @returns {Number} - Positive number
   */
  get level() {
    return this._reactProps['aria-level'];
  }
}
