import _ from 'lodash';
import { ROLES } from '../Roles';
import GridData from './GridData';

export default class TreeGridData extends GridData {
  /**
   * Sets the orientation
   * @access public
   * @param {String} str - "horizontal" for a horizontal tree
   * "vertical" for a vertical tree
   * undefined to unset this field
   */
  set orientation(str) {
    this._reactProps['aria-orientation'] = str;
  }

  /**
   * Retrieves the orientation
   * @access public
   * @returns  {String} str "horizontal" for a horizontal tree
   * "vertical" for a vertical tree
   * undefined if the field is unset
   */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  /**
   * Sets whether user input is required or not
   * @access public
   * @param {boolean} value - true if the element is required, false otherwise,
   * undefined to unset this field
   */
  set required(value) {
    this._reactProps['aria-required'] = value;
  }

  /**
   * Retrieves whether user input is required or not
   * @access public
   * @returns {boolean} true if the element is required, false otherwise,
   * undefined if this field is unset
   */
  get required() {
    return this._reactProps['aria-required'];
  }

  /**
   * Finds a row DisplayObject that is previous to the specified one, visible,
   * and is a minimally higher level conceptually (which means a lower number
   * for the level property of the corresponding RowData instance)
   * @access private
   *
   * @param {!createjs.DisplayObject} rowDisplayObject - DisplayObject to find
   * the higher level row relative to
   * @returns {?TargetData} target data for the higher level visible row's DisplayObject,
   * null if no match is found
   */
  _findPrevRowAtHigherLevel(rowDisplayObject) {
    let targetData = null;

    const rowLevel = rowDisplayObject.accessible.level;
    let sectionIndex = _.findIndex(this.children, rowDisplayObject.accessible.parent.displayObject);
    for (; sectionIndex >= 0 && !targetData; sectionIndex--) {
      const tableSectionDisplayObject = this.children[sectionIndex];
      let rowIndex = _.findIndex(tableSectionDisplayObject.accessible.children, rowDisplayObject);
      if (rowIndex < 0) {
        rowIndex = tableSectionDisplayObject.accessible.children.length - 1;
      }
      const higherLevelRowIndex = _.findLastIndex(
        tableSectionDisplayObject.accessible.children,
        testRow => testRow.accessible.visibleWithInference && testRow.accessible.level < rowLevel,
        rowIndex,
      );

      if (higherLevelRowIndex !== -1) {
        targetData = {
          displayObject: tableSectionDisplayObject.accessible.children[higherLevelRowIndex],
          sectionIndex,
          rowIndex: higherLevelRowIndex,
          colIndex: -1,
          cellChildIndex: -1,
        };
      }
    }

    return targetData;
  }

  /**
   * @inheritdoc
   */
  _updateTargetDataLeft(targetData) {
    if (targetData.displayObject.accessible.role === ROLES.ROW) {
      const rowData = targetData.displayObject.accessible;
      if (!rowData.expanded) {
        // non-exandable rows move focus to the previous level's row, if there is one
        // collapsed exandable rows do the same

        const toRow = this._findPrevRowAtHigherLevel(targetData.displayObject);
        if (toRow) {
          toRow.displayObject = targetData.displayObject;
          targetData = toRow;
        }
      } else {
        // expanded exandable rows collapse
        const evt = new createjs.Event('collapseRow', false, false);
        evt.rowDisplayObject = targetData.displayObject;
        this._displayObject.dispatchEvent(evt);
        return false;
      }
    } else {
      super._updateTargetDataLeft(targetData);

      // if on the first cell of the row and the row can't receive focus, then focus should not move
      if (targetData.colIndex < 0 && _.isUndefined(targetData.displayObject.accessible.parent.tabIndex)) { // eslint-disable-line max-len
        return false;
      }
    }

    return true;
  }

  /**
   * @inheritdoc
   */
  _updateTargetDataRight(targetData) {
    let allowFocusUpdate = true;

    if (targetData.displayObject.accessible.role === ROLES.ROW) {
      if (targetData.displayObject.accessible.expanded === false) {
        // collapsed expandable rows get expanded
        const evt = new createjs.Event('expandRow', false, false);
        evt.rowDisplayObject = targetData.displayObject;
        this._displayObject.dispatchEvent(evt);
        allowFocusUpdate = false;
      } else {
        // non-expandable rows have focus move to their first cell
        // expanded expandable rows do the same
        targetData.colIndex = 0;
      }
    } else {
      allowFocusUpdate = super._updateTargetDataRight(targetData);
    }

    return allowFocusUpdate;
  }

  /**
   * @inheritdoc
   */
  _updateTargetDataUp(targetData) {
    let allowFocusUpdate = true;

    if (targetData.displayObject.accessible.role === ROLES.ROW) {
      let sectionIndex = targetData.sectionIndex;
      let gotoRowIndex = _.findLastIndex(
        this.children[sectionIndex].accessible.children,
        testRow => !_.isUndefined(testRow.accessible.tabIndex)
          && testRow.accessible.visibleWithInference,
        targetData.rowIndex - 1,
      );
      if (gotoRowIndex === -1) {
        for (sectionIndex = targetData.sectionIndex - 1;
          sectionIndex >= 0 && gotoRowIndex === -1;
          sectionIndex--) {
          gotoRowIndex = _.findLastIndex(
            this.children[sectionIndex].accessible.children,
            testRow => !_.isUndefined(testRow.accessible.tabIndex)
               && testRow.accessible.visibleWithInference,
          );
        }
      }
      if (gotoRowIndex === -1) {
        allowFocusUpdate = false;
      } else {
        targetData.currFocusRowIndex = targetData.rowIndex;
        targetData.currFocusSectionIndex = targetData.sectionIndex;
        targetData.rowIndex = gotoRowIndex;
        targetData.sectionIndex = sectionIndex;
      }
    } else {
      targetData.currFocusRowIndex = targetData.rowIndex;
      targetData.currFocusSectionIndex = targetData.sectionIndex;
      allowFocusUpdate = super._updateTargetDataUp(targetData);
    }

    return allowFocusUpdate;
  }

  /**
   * @inheritdoc
   */
  _updateTargetDataDown(targetData) {
    let allowFocusUpdate = true;

    if (targetData.displayObject.accessible.role === ROLES.ROW) {
      let sectionIndex = targetData.sectionIndex;
      let gotoRowIndex = _.findIndex(
        this.children[sectionIndex].accessible.children,
        testRow => !_.isUndefined(testRow.accessible.tabIndex)
          && testRow.accessible.visibleWithInference,
        targetData.rowIndex + 1,
      );
      if (gotoRowIndex === -1) {
        for (sectionIndex = targetData.sectionIndex + 1;
          sectionIndex < this.children.length && gotoRowIndex === -1;
          sectionIndex++) {
          gotoRowIndex = _.findIndex(
            this.children[sectionIndex].accessible.children,
            testRow => !_.isUndefined(testRow.accessible.tabIndex)
              && testRow.accessible.visibleWithInference,
          );
        }
      }
      if (gotoRowIndex === -1) {
        allowFocusUpdate = false;
      } else {
        targetData.currFocusRowIndex = targetData.rowIndex;
        targetData.currFocusSectionIndex = targetData.sectionIndex;
        targetData.rowIndex = gotoRowIndex;
        targetData.sectionIndex = sectionIndex;
      }
    } else {
      targetData.currFocusRowIndex = targetData.rowIndex;
      targetData.currFocusSectionIndex = targetData.sectionIndex;
      allowFocusUpdate = super._updateTargetDataDown(targetData);
    }

    return allowFocusUpdate;
  }

  /**
   * @inheritdoc
   */
  _searchRow(id, rowDisplayObject, sectionIndex, rowIndex) {
    let matchingData = null;

    // Since treegrid rows can be expandable, they can receive focus and therefore
    // need to be checked if they are what currently has focus instead of just
    // going through the cells.
    if (rowDisplayObject.accessible.domId === id) {
      matchingData = {
        displayObject: rowDisplayObject,
        sectionIndex,
        rowIndex,
        colIndex: -1,
        cellChildIndex: -1,
      };
    } else {
      _.forEach(rowDisplayObject.accessible.children, (cellDisplayObject, colIndex) => {
        matchingData = this._searchCell(id, cellDisplayObject, sectionIndex, rowIndex, colIndex);
        return !matchingData;
      });
    }

    return matchingData;
  }

  /**
   * @inheritdoc
   */
  _findNextTarget(targetData) {
    let nextTarget = null;

    if (targetData.colIndex === -1) {
      // allow focus going to a row
      const rows = this.children[targetData.sectionIndex].accessible.children;
      nextTarget = rows[targetData.rowIndex];
    } else {
      nextTarget = super._findNextTarget(targetData);
    }

    return nextTarget;
  }

  /**
   * @inheritdoc
   */
  _focusToNextTarget(nextTarget, targetData, evt) {
    if (nextTarget) {
      if (!_.isUndefined(targetData.currFocusRowIndex)) {
        // The row containing the focused element (including the row itself) should
        // be in the tab order.  Other rows, if they can receive focus should get a
        // tabIndex of -1 (and due to the way focus works, only the row losing it
        // needs to be udpated).
        if (targetData.currFocusRowIndex !== targetData.rowIndex
          || targetData.currFocusSectionIndex !== targetData.sectionIndex) {
          const currSection = this.children[targetData.currFocusSectionIndex];
          const nextSection = this.children[targetData.sectionIndex];
          const currRow = currSection.accessible.children[targetData.currFocusRowIndex];
          const nextRow = nextSection.accessible.children[targetData.rowIndex];
          nextRow.accessible.tabIndex = currRow.accessible.tabIndex;
          currRow.accessible.tabIndex = -1;
        }
      }

      // When putting focus on a cell (as in the case of it not having interactable
      // contents), need to set the tabIndex so that the cell can receive focus.
      if (nextTarget.accessible.role === ROLES.GRIDCELL) {
        nextTarget.accessible.tabIndex = 0;
      }
      // If a cell is losing focus, it loses its tabIndex setting
      if (targetData.displayObject.accessible.role === ROLES.GRIDCELL) {
        targetData.displayObject.accessible.tabIndex = undefined;
      }

      nextTarget.accessible.requestFocus();
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
}
