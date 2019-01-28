import AccessibilityObject from './AccessibilityObject.js';

export default class DialogData extends AccessibilityObject {
  /**
  * Sets whether the element should get expanded
  * @access public
  * @param {boolean} val - true if expanded, false if not expanded, undefined if the field is unset
  */
  set expanded(val) {
    this._reactProps['aria-expanded'] = val;
  }

  /**
  * Retrieves whether expanded
  * @access public
  * @returns {boolean} true if expanded, false if not expanded, undefined if the field is unset
  */
  get expanded() {
    return this._reactProps['aria-expanded'];
  }
}
