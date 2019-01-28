import SectionData from './SectionData.js';

/**
 * Class for role objects that use the li HTML tag.
 */
export default class ListItemData extends SectionData {
  /**
   * Sets the value of the list item
   * @access public
   * @param {number} value - number representing the value of the list item
   */
  set value(value) {
    this._reactProps.value = value;
  }

  /**
   * Retrieves the value of the list item
   * @access public
   * @returns {number} number representing the value of the list item, undefined if this field is unset
   */
  get value() {
    return this._reactProps.value;
  }
}
