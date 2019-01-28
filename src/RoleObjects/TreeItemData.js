import ListItemData from './ListItemData.js';
import KeyCodes from 'keycodes-enum';

/**
 * Class for role objects that are child items for tree role.
 */
export default class TreeItemData extends ListItemData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, 'onKeyDown');
    this._reactProps.onKeyDown = this.onKeyDown;
  }

  /**
   * Sets the position in the current set of items
   * @access public
   * @param {Number} num - One based index for the position in the current set of items.  Or undefined to clear the field
   */
  set positionInSet(num) {
    this._reactProps['aria-posinset'] = num;
  }

  /**
   * Retrieves the position in the current set of items
   * @access public
   * @returns {Number} One based index for the position in the current set of items
   */
  get positionInSet() {
    return this._reactProps['aria-posinset'];
  }

  /**
   * Sets the number of items in the current set of items
   * @access public
   * @param {Number} num - Number of items in the current set.  Or undefined to clear the field
   */
  set setSize(num) {
    this._reactProps['aria-setsize'] = num;
  }

  /**
   * Retrieves the number of items in the current set of items
   * @access public
   * @returns {Number} the number of items in the current set of items
   */
  get setSize() {
    return this._reactProps['aria-setsize'];
  }

  /**
   * @access public
   * @param {boolean} value - true if the element is selected, false otherwise
   */
  set selected(value) {
    this._reactProps['aria-selected'] = value;
  }

  /**
   * @access public
   * @returns {boolean} true if the element is selected, false otherwise
   */
  get selected() {
    return this._reactProps['aria-selected'];
  }

  /**
   * Sets whether the element is checked
   * @access public
   * @param {boolean} check - true if the element is checked, false otherwise
   */
  set checked(check) {
    this._reactProps.checked = check;
  }

  /**
   * Retrieves whether the element is checked
   * @access public
   * @returns {boolean} true if the element is checked, false otherwise
   */
  get checked() {
    return this._reactProps.checked;
  }

  /**
   * Keydown listener for an tree item
   * @access private
   */
  onKeyDown(evt) {
    if (evt.keyCode === KeyCodes.enter) {
      const event = new createjs.Event('keyboardClick', false, evt.cancelable);
      const skipPreventDefault = this._displayObject.dispatchEvent(event);
      if (!skipPreventDefault) {
        evt.preventDefault();
      }
      evt.stopPropagation();
    }
  }
}
