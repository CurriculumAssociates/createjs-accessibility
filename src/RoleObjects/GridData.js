import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import TableData from './TableData';
import { ROLES } from '../Roles';

export default class GridData extends TableData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onKeyDown');
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  set enableKeyEvents(enable) {
    super.enableKeyEvents = enable;
    // the keydown listener is needed for this role to function per WAI-ARIA practices
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  get enableKeyEvents() {
    return super.enableKeyEvents;
  }

  /**
   * hierarchical level of the grid within other structures
   * @access public
   * @param {Number} val - aria-level is an integer greater than or equal to 1
   */
  set level(val) {
    this._reactProps['aria-level'] = val;
  }

  /**
   * hierarchical level of the grid within other structures
   * @access public
   * @param {Number} val - aria-level is an integer greater than or equal to 1
   */
  get level() {
    return this._reactProps['aria-level'];
  }

  /**
   * user may select more then one item from the current grid
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

  /**
   * @inheritdoc
   */
  _onKeyDown(event) {
    if (this.enableKeyEvents) {
      super._onKeyDown(event);
    }

    const {
      up, down, right, left, home, end,
    } = KeyCodes;
    if ([up, down, right, left, home, end].indexOf(event.keyCode) !== -1) {
      const targetData = this._focusableElemToTargetData(event.target);
      if (targetData) {
        // eslint-disable-next-line max-len
        // todo: handle expandable rows without relying on the non-standard expandedArrow and collapsedArrow fields on the DisplayObject instance

        let rowArr = this.children[targetData.sectionIndex].accessible.children;

        switch (event.keyCode) {
          case KeyCodes.up:
            targetData.rowIndex--;
            if (targetData.rowIndex < 0 && targetData.sectionIndex > 0) {
              targetData.sectionIndex--;
              targetData.rowIndex = this.children[targetData.sectionIndex].accessible.children.length - 1; // eslint-disable-line max-len
              rowArr = this.children[targetData.sectionIndex].accessible.children;
            }
            break;
          case KeyCodes.down:
            targetData.rowIndex++;
            if (targetData.rowIndex >= rowArr.length && targetData.sectionIndex < (this.children.length - 1)) { // eslint-disable-line max-len
              targetData.sectionIndex++;
              targetData.rowIndex = 0;
              rowArr = this.children[targetData.sectionIndex].accessible.children;
            }
            break;
          case KeyCodes.left:
            if (targetData.displayObject.accessible.role === ROLES.ROW) {
              const rowData = targetData.displayObject.accessible;
              if (!rowData.expanded) {
                // non-exandable rows move focus to the previous level's row, if there is one
                // collapsed exandable rows do the same
              } else {
                // expanded exandable rows collapse
                const collapseEvent = new createjs.Event('collapseRow', false, false);
                collapseEvent.rowDisplayObject = targetData.displayObject;
                this._displayObject.dispatchEvent(event);
                return;
              }
            } else {
              targetData.colIndex--;

              // if on the first cell of the row and the row can receive focus,
              // then focus moves to the row
              if (targetData.colIndex < 0 && !_.isUndefined(targetData.displayObject.accessible.parent.tabIndex)) { // eslint-disable-line max-len
                // todo
              }
            }
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

        const nextTarget = this._findNextTarget(targetData);
        this._focusToNextTarget(nextTarget, targetData.displayObject, event);
      }
    }
  }

  /**
   * For targetData that has been updated based on which keycode was pressed,
   * this finds the DisplayObject that should get focus next.
   * @access protected
   *
   * @param {!TargetData} targetData - the updated target data based on what
   * currently has focus and which key was pressed
   * @returns {?createjs.DisplayObject} the DisplayObject that should receive
   * focus.  null if there is no DisplayObject that focus should move to.
   */
  _findNextTarget(targetData) {
    let nextTarget = null;

    const rowArr = this.children[targetData.sectionIndex].accessible.children;
    if (rowArr[targetData.rowIndex]) {
      const colArr = rowArr[targetData.rowIndex].accessible.children;
      const cellDisplayObject = colArr[targetData.colIndex];
      if (cellDisplayObject) {
        if (!_.isUndefined(cellDisplayObject.accessible.tabIndex)) {
          nextTarget = cellDisplayObject;
        } else if (cellDisplayObject.accessible.children.length > 0) {
          nextTarget = cellDisplayObject.accessible.children[0];
        }
      }
    }

    return nextTarget;
  }

  /**
   * Sends focus to the specified target, along with updating the tabIndex of the
   * target and the DisplayObject that currently has focus in order to maintain
   * proper tab order according to WAI-ARIA practices.
   * @access private
   *
   * @param {?createjs.DisplayObject} nextTarget - DisplayObject to send focus to.
   * null if focus should not be moved.
   * @param {!createjs.DisplayObject} prevTarget - the DisplayObject that currently
   * has focus
   * @param {!SyntheticEvent} evt - React event
   */
  _focusToNextTarget(nextTarget, prevTarget, evt) {
    if (nextTarget) {
      nextTarget.accessible.tabIndex = prevTarget.accessible.tabIndex;
      prevTarget.accessible.tabIndex = -1;
      nextTarget.accessible.requestFocus();
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

  /**
   * Converts the element that currently has focus to TargetData describing is
   * position within the grid.
   * @access protected
   *
   * @param {!DOMElement} elem - element that currently has focus
   * @returns {?TargetData} target data for the DisplayObject that currently has
   * focus. null if there is no match.
   */
  _focusableElemToTargetData(elem) {
    let matchingData = null;

    const id = elem.getAttribute('id');
    _.forEach(this.children, (tableSectionDisplayObject, sectionIndex) => {
      matchingData = this._searchSection(id, tableSectionDisplayObject, sectionIndex);
      return !matchingData;
    });

    return matchingData;
  }

  /**
   * Searches a table section for the DisplayObject whose AccessibilityObject domId
   * matches the specified id.
   * @access protected
   *
   * @param {!string} id - id to search for
   * @param {createjs.DisplayObject} tableSectionDisplayObject - DisplayObject
   * for the table section to search
   * @param {Number} sectionIndex - index of which table section to search
   * @returns {?TargetData} target data for the DisplayObject that currently has
   * focus. null if there is no match.
   */
  _searchSection(id, tableSectionDisplayObject, sectionIndex) {
    let matchingData = null;

    _.forEach(tableSectionDisplayObject.accessible.children, (rowDisplayObject, rowIndex) => {
      matchingData = this._searchRow(id, rowDisplayObject, sectionIndex, rowIndex);
      return !matchingData;
    });

    return matchingData;
  }

  /**
   * Searches a row for the DisplayObject whose AccessibilityObject domId
   * matches the specified id.
   * @access protected
   *
   * @param {!string} id - id to search for
   * @param {createjs.DisplayObject} rowDisplayObject - DisplayObject
   * for the row to search
   * @param {Number} sectionIndex - index of which table section is being searched
   * @param {Number} rowIndex - index of which row to search
   * @returns {?TargetData} target data for the DisplayObject that currently has
   * focus. null if there is no match.
   */
  _searchRow(id, rowDisplayObject, sectionIndex, rowIndex) {
    let matchingData = null;

    _.forEach(rowDisplayObject.accessible.children, (cellDisplayObject, colIndex) => {
      matchingData = this._searchCell(id, cellDisplayObject, sectionIndex, rowIndex, colIndex);
      return !matchingData;
    });

    return matchingData;
  }

  /**
   * Searches a cell for the DisplayObject whose AccessibilityObject domId
   * matches the specified id.
   * @access protected
   *
   * @param {!string} id - id to search for
   * @param {createjs.DisplayObject} cellDisplayObject - DisplayObject
   * for the cell to search
   * @param {Number} sectionIndex - index of which table section is being searched
   * @param {Number} rowIndex - index of which row being search
   * @param {Number} colIndex - index of which column to search
   * @returns {?TargetData} target data for the DisplayObject that currently has
   * focus. null if there is no match.
   */
  _searchCell(id, cellDisplayObject, sectionIndex, rowIndex, colIndex) {
    let matchingData = null;
    if (cellDisplayObject.accessible.domId === id) {
      matchingData = {
        displayObject: cellDisplayObject,
        sectionIndex,
        rowIndex,
        colIndex,
        cellChildIndex: -1,
      };
    } else {
      _.forEach(cellDisplayObject.accessible.children, (cellChildDisplayObject, cellChildIndex) => { // eslint-disable-line max-len
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
    }

    return matchingData;
  }
}

/**
 * @typedef {Object} TargetData
 * @property {createjs.DisplayObject} displayObject - DisplayObject that currently
 * has focus
 * @property {Number} sectionIndex - index into the GridData's children array for
 * which section of the table contains the DisplayObject that currently or should
 * receive focus
 * @property {Number} rowIndex - index into the table section's AccessibilityObject
 * children array for which row contains the DisplayObject that currently or should
 * receive focus
 * @property {Number} colIndex - index into the row's AccessibilityObject children
 * array for which table cell either has or contains the DIsplayObject that
 * currently or should receive focus.  -1 if the row itself has or should receive
 * focus (this value is only applicable to treegrid role).
 * @property {Number} cellChildIndex - index into the cell's AccessibilityObject
 * children array for which has focus.  -1 if the cell itself has focus, which
 * should only occur in the case of the cell having a tabIndex set and therefore
 * this child elements should not be focusable.
 */
