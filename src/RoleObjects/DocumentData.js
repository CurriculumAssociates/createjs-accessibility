import AccessibilityObject from './AccessibilityObject';

export default class DocumentData extends AccessibilityObject {
  /**
   * Sets whether the document is expanded or collapsed.  If the document is not expandable, then this should be set to undefined.
   * @access public
   * @param {boolean} val - true if the document is expanded, false if it is collapsed, undefined if the document is not expandable
   */
  set expanded(val) {
    this._reactProps['aria-expanded'] = val;
  }

  /**
   * Retrieves whether the document is expanded, collapsed, or not expandable.
   * @access public
   * @returns {boolean} - true if the document is expanded, false if the document is collapsed, undefined if it is not expandable
   */
  get expanded() {
    return this._reactProps['aria-expanded'];
  }
}
