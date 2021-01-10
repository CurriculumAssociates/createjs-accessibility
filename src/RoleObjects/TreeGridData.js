import _ from 'lodash';
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
