import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import TableData from './TableData';

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
   * @param {boolean} val - aria-multiselectable is set to true, multiple items
   * in the grid can be selected. The default value is false
   */
  set multiselectable(val) {
    this._reactProps['aria-multiselectable'] = val;
  }

  /**
   * The user may select more then one item from the current grid
   * @access public
   * @param {boolean} val - aria-multiselectable is set to true, multiple items
   * in the grid can be selected. The default value is false
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
    const {
      up, down, right, left, home, end,
    } = KeyCodes;
    if ([up, down, right, left, home, end].indexOf(event.keyCode) !== -1) {
      const targetData = this._interactiveElemToGridData(event.target);
      if (targetData) {
        // todo: handle moving between sections
        // todo: handle expandable rows without relying on the non-standard expandedArrow and collapsedArrow fields on the DisplayObject instance

        const rowArr = this.children[targetData.sectionIndex].accessible.children;

        switch (event.keyCode) {
          case KeyCodes.up:
            targetData.rowIndex--;
            break;
          case KeyCodes.down:
            targetData.rowIndex++;
            break;
          case KeyCodes.left:
            targetData.colIndex--;
            break;
          case KeyCodes.right:
            targetData.colIndex++;
            break;
          case KeyCodes.home:
            targetData.colIndex = 0;
            break;
          case KeyCodes.end:
            targetData.colIndex = rowArr[targetData.rowIndex].accessible.children.length - 1;
            break;
          default:
            break;
        }

        let nextTarget = null;
        if (rowArr[targetData.rowIndex]) {
          const colArr = rowArr[targetData.rowIndex].accessible.children;
          if (colArr[targetData.colIndex] && colArr[targetData.colIndex].accessible.children.length > 0) {
            nextTarget = colArr[targetData.colIndex].accessible.children[0];
          }
        }
        if (nextTarget) {
          nextTarget.accessible.tabIndex = targetData.displayObject.accessible.tabIndex;
          targetData.displayObject.accessible.tabIndex = -1;
          nextTarget.accessible.requestFocus();
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  }

  _interactiveElemToGridData(elem) {
    let matchingData = null;

    const id = elem.getAttribute('id');
    _.forEach(this.children, (tableSectionDisplayObject, sectionIndex) => {
      _.forEach(tableSectionDisplayObject.accessible.children, (rowDisplayObject, rowIndex) => {
        _.forEach(rowDisplayObject.accessible.children, (cellDisplayObject, colIndex) => {
          _.forEach(cellDisplayObject.accessible.children, (cellChildDisplayObject, cellChildIndex) => {
            if (cellChildDisplayObject.accessible.domId === id) {
              matchingData = {
                displayObject: cellChildDisplayObject,
                sectionIndex,
                rowIndex,
                colIndex,
                cellChildIndex,
              };
            }

            return !matchingData;
          });

          return !matchingData;
        });

        return !matchingData;
      });

      return !matchingData;
    });

    return matchingData;
  }

  getRowIndex(target) {
    return Number(target.getAttribute('aria-rowindex'));
  }

  getColIndex(target) {
    return Number(target.getAttribute('aria-colindex'));
  }
}
