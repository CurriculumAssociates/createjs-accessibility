import TableData from './TableData.js';
import { ROLES } from '../Roles.js';
import KeyCodes from 'keycodes-enum';
import _ from 'lodash';

export default class GridData extends TableData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, 'onKeyDown');
    this._reactProps.onKeyDown = this.onKeyDown;
  }
  /**
   *  hierarchical level of the grid within other structures
   * @access public
   * @param {Number} val - aria-level is an integer greater than or equal to 1
   */

  set level(val) {
    this._reactProps['aria-level'] = val;
  }

  /**
   *  hierarchical level of the grid within other structures
   * @access public
   * @param {Number} val - aria-level is an integer greater than or equal to 1
   */
  get level() {
    return this._reactProps['aria-level'];
  }

  /**
   *  user may select more then one item from the current grid
   * @access public
   * @param {boolean} val - aria-multiselectable is set to true, multiple items in the grid can be selected. The default value is false
   */
  set multiselectable(val) {
    this._reactProps['aria-multiselectable'] = val;
  }

  /**
   * The user may select more then one item from the current grid
   * @access public
   * @param {boolean} val - aria-multiselectable is set to true, multiple items in the grid can be selected. The default value is false
   */
  get multiselectable() {
    return this._reactProps['aria-multiselectable'];
  }

  /**
   * Sets whether the grid is editable or not
   * @access public
   * @param {boolean} value - true if the element should be read only, false for read and editable
   */
  set readOnly(value) {
    this._reactProps['aria-readonly'] = value;
  }

  /**
   * Retrieves whether the grid is editable or not
   * @access public
   * @returns {boolean} true if the element should be read only, false for read and editable
   */
  get readOnly() {
    return this._reactProps['aria-readonly'];
  }

  onKeyDown(event) {
    if ([KeyCodes.up, KeyCodes.down, KeyCodes.right, KeyCodes.left, KeyCodes.home, KeyCodes.end].indexOf(event.keyCode) !== -1) {
      const target = event.target;
      const rowArr = this._children[0].accessible._children;
      let rowIndex = this.getRowIndex(target);
      let colIndex = this.getColIndex(target);
      const currentRowData = rowArr[rowIndex];
      const isExpandable = currentRowData.expandedArrow && currentRowData.expandedArrow.visible;
      const isCollapsable = currentRowData.collapsedArrow && currentRowData.collapsedArrow.visible;
      const rowClick = (e) => {
        const evt = new createjs.Event('keyboardClick', false, e.cancelable);
        const skipPreventDefault = currentRowData.dispatchEvent(evt);
        if (!skipPreventDefault) {
          e.preventDefault();
        }
        e.stopPropagation();
      };
      switch (event.keyCode) {
        case KeyCodes.up:
          rowIndex--;
          break;
        case KeyCodes.down:
          rowIndex++;
          break;
        case KeyCodes.left:
          isExpandable ? rowClick(event) : colIndex--;
          break;
        case KeyCodes.right:
          isCollapsable ? rowClick(event) : colIndex++;
          break;
        case KeyCodes.home:
          colIndex = 0;
          break;
        case KeyCodes.end:
          colIndex = currentRowData.cellCount - 1;
          break;
        default:
          break;
      }

      const getTarget = () => {
        if (rowArr[rowIndex]) {
          const colArr = rowArr[rowIndex].accessible._children;
          if (colArr[colIndex]) {
            return colArr[colIndex];
          }
          return null;
        }
        return null;
      };
      const nextTarget = getTarget();
      if (nextTarget) {
        nextTarget.accessible.requestFocus();
      }
    }
  }

  getRowIndex(target) {
    return Number(target.getAttribute('aria-rowindex'));
  }

  getColIndex(target) {
    return Number(target.getAttribute('aria-colindex'));
  }
}
