import SectionData from './SectionData';
import { ROLES } from '../Roles';

/**
 * Class for role objects that use the ol HTML tag.
 */
export default class OrderedListData extends SectionData {
  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.LISTITEM) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.LISTITEM}`);
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.LISTITEM) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.LISTITEM}`);
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Sets whether the list order should be descending
   * @access public
   * @param {boolean} reverse - true if reversed should be enabled, false otherwise
   */
  set reversed(reverse) {
    this._reactProps.reversed = reverse;
  }

  /**
   * Retrieves whether reversed is enabled
   * @access public
   * @returns {boolean} true if reversed is enabled, false otherwise, undefined
   *  if this field is unset
   */
  get reversed() {
    return this._reactProps.reversed;
  }

  /**
   * Sets the starting value of the ordered list
   * @access public
   * @param {number} start - number representing the starting position of the list
   */
  set start(start) {
    this._reactProps.start = start;
  }

  /**
   * Retrieves the starting value of the ordered list
   * @access public
   * @returns {number} number representing the starting position of the list,
   * undefined if this field is unset
   */
  get start() {
    return this._reactProps.start;
  }

  /**
   * Sets the type of marker to be used
   * @access public
   * @param {String} str - type of marker (1, A, a, I, i)
   */
  set type(str) {
    this._reactProps.type = str;
  }

  /**
   * Retrieves the type of marker to be used
   * @access public
   * @returns {String} type of marker, undefined if this field is unset
   */
  get type() {
    return this._reactProps.type;
  }
}
