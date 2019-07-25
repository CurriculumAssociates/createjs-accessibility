import AccessibilityObject from './AccessibilityObject';


export default class CompositeData extends AccessibilityObject {
  /**
    * Sets the currently active descendant of a composite widget
    * @access public
    * @param {String} str - str Identifies the currently active descendant of
    * a composite widget. Used to deal with multiple focusable children
    */
  set active(str) {
    this._reactProps['aria-activedescendant'] = str;
  }

  /**
    * Retrieves the currently active descendant of a composite widget
    * @access public
    * @returns  {String} str Identifies the currently active descendant of
    * a composite widget. Used to deal with multiple focusable children
    */
  get active() {
    return this._reactProps['aria-activedescendant'];
  }
}
