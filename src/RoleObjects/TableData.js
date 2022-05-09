import SectionData from './SectionData';
import { ROLES } from '../Roles';

export default class TableData extends SectionData {
  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (
      !displayObject.accessible ||
      [ROLES.TABLEBODY, ROLES.TABLEFOOT, ROLES.TABLEHEAD].indexOf(
        displayObject.accessible.role
      ) === -1
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.TABLEBODY}, ${ROLES.TABLEFOOT}, or ${ROLES.TABLEHEAD}`
      );
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (
      !displayObject.accessible ||
      [ROLES.TABLEBODY, ROLES.TABLEFOOT, ROLES.TABLEHEAD].indexOf(
        displayObject.accessible.role
      ) === -1
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.TABLEBODY}, ${ROLES.TABLEFOOT}, or ${ROLES.TABLEHEAD}`
      );
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Sets the total number of rows in a table, grid or treegrid.
   * -1 if the total number of rows is unknown and also indicates that the value should
   * not be calculated by the user agent.
   * @access public
   * @param {Number} val - Positive number , -1 if its unknown.
   */
  set rowCount(val) {
    this._reactProps['aria-rowcount'] = val;
  }

  /**
   * Gives the total number of rows in a table, grid or treegrid.
   * -1 if the total number of rows is unknown and also indicates that the value should not
   * be calculated by the user agent.
   * @access public
   * @returns {Number} - Positive number , -1 if its unknown.
   */
  get rowCount() {
    return this._reactProps['aria-rowcount'];
  }

  /**
   * Sets the total number of columns in a table, grid or treegrid.
   * -1 if the total number of columns is unknown and also indicates that the value should
   * not be calculated by the user agent.
   * @access public
   * @param {Number} val - Positive number , -1 if its unknown.
   */
  set colCount(val) {
    this._reactProps['aria-colcount'] = val;
  }

  /**
   * Gives the total number of columns in a table, grid or treegrid.
   * -1 if the total number of columns is unknown and also indicates that the value should not
   * be calculated by the user agent.
   * @access public
   * @returns {Number} - Positive number , -1 if its unknown.
   */
  get colCount() {
    return this._reactProps['aria-colcount'];
  }
}
