import AccessibilityObject from './AccessibilityObject';

export default class SectionData extends AccessibilityObject {
  /**
   * Sets whether the section is expanded or collapsed.
   If the section is not expandable, then this should be set to undefined.
   * @access public
   * @param {boolean} val - true if the section is expanded,
   false if it is collapsed, undefined if the item is not expandable
   */
  set expanded(val) {
    this._reactProps['aria-expanded'] = val;
  }

  /**
   * Retrieves whether the section is expanded, collapsed, or not expandable.
   * @access public
   * @returns {boolean} - true if the item is expanded,
   false if the item is collapsed, undefined if it is not expandable
   */
  get expanded() {
    return this._reactProps['aria-expanded'];
  }
}
