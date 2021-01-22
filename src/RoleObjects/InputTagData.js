import AccessibilityObject from './AccessibilityObject';

/**
 * Base class for role objects that use the input HTML tag.
 * This contains only setters/getters for fields that are common to all input
 * tags regardless of the type attribute.
 */
export default class InputTagData extends AccessibilityObject {
  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    throw new Error(`${this.role} cannot have children`);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    throw new Error(`${this.role} cannot have children`);
  }

  /**
   * Sets whether the element should get focus on page load
   * @access public
   * @param {boolean} enable - true if autofocus should be enabled, false otherwise
   */
  set autofocus(enable) {
    this._reactProps.autofocus = enable ? 'autofocus' : undefined;
  }

  /**
   * Retrieves whether autofocus is enabled
   * @access public
   * @returns {boolean} true if autofocus is enabled, false otherwise
   */
  get autofocus() {
    return this._reactProps.autofocus === 'autofocus';
  }

  /**
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled, false if
   * the element should be disabled.  undefined to unset the field.
   */
  set enabled(enable) {
    this._reactProps.disabled = enable !== false ? undefined : 'disabled';
    super.enabled = enable;
  }

  /**
   * Retrieves whether the element is enabled
   * @access public
   * @returns {boolean} true if the element is enabled, false if the element is disabled.
   * undefined if the field is unset.
   */
  get enabled() {
    return super.enabled;
  }

  /**
   * Sets the name of the text input field
   * @access public
   * @param {String} str - name of the field
   */
  set name(str) {
    this._reactProps.name = str;
  }

  /**
   * Retrieves the name of the text input field
   * @access public
   * @returns {String} name of the field
   */
  get name() {
    return this._reactProps.name;
  }
}
