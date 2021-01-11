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
   * @inheritdoc
   */
  _updateTargetDataLeft(targetData) {
    if (targetData.displayObject.accessible.role === ROLES.ROW) {
      const rowData = targetData.displayObject.accessible;
      if (!rowData.expanded) {
        // non-exandable rows move focus to the previous level's row, if there is one
        // collapsed exandable rows do the same
      } else {
        // expanded exandable rows collapse
        const collapseEvent = new createjs.Event('collapseRow', false, false);
        collapseEvent.rowDisplayObject = targetData.displayObject;
        this._displayObject.dispatchEvent(collapseEvent);
        return false;
      }
    } else {
      targetData.colIndex--;

      // if on the first cell of the row and the row can receive focus,
      // then focus moves to the row
      if (targetData.colIndex < 0 && !_.isUndefined(targetData.displayObject.accessible.parent.tabIndex)) { // eslint-disable-line max-len
        // todo
      }
    }

    return true;
  }

  /**
   * @inheritdoc
   */
  _updateTargetDataRight(targetData) {
    // todo
    return super._updateTargetDataRight(targetData);
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
}
