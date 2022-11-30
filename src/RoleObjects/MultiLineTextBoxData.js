import _ from 'lodash';
import { ROLES } from '../Roles';
import AccessibilityObject from './AccessibilityObject';

export default class MultiLineTextBoxData extends AccessibilityObject {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onChange', '_onSelect');
    this._reactProps['aria-multiline'] = true;
    this._reactProps.onChange = this._onChange;
    this._reactProps.onSelect = this._onSelect;
  }

  /**
   * @inheritdoc
   */
  addChild() {
    throw new Error(`${this.role} cannot have children`);
  }

  /**
   * @inheritdoc
   */
  addChildAt() {
    throw new Error(`${this.role} cannot have children`);
  }

  /**
   * Sets the currently active descendant of a composite widget
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject that is the active descendant
   * of this one.  undefined to unset the field.
   */
  set active(displayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error(
        'DisplayObject being set as the active descendant must have accessibility information'
      );
    }
    this._active = displayObject;
    this._reactProps['aria-activedescendant'] = displayObject
      ? displayObject.accessible.domId
      : undefined;
  }

  /**
   * Retrieves which DisplayObject is the current active descendant
   * @access public
   * @returns  {createjs.DisplayObject} DisplayObject that is the current active descendant
   */
  get active() {
    return this._active;
  }

  /**
   * Retrieves the DOM id for the tranlated DisplayObject that is the active descendant.
   * @access public
   * @returns {String} id for the translated DisplayObject that is the active descendant
   */
  get activeId() {
    return this._reactProps['aria-activedescendant'];
  }

  /**
   * Sets whether the element should get focus on page load
   * @access public
   * @param {boolean} enable - true if autofocus should be enabled, false otherwise
   */
  set autoFocus(enable) {
    this._reactProps.autoFocus = enable ? 'autofocus' : undefined;
  }

  /**
   * Retrieves whether autofocus is enabled
   * @access public
   * @returns {boolean} true if autofocus is enabled, false otherwise
   */
  get autoFocus() {
    return this._reactProps.autoFocus === 'autofocus';
  }

  /**
   * Sets the number of visible columns
   * @access public
   * @param {Number} num - number of visisble columns
   */
  set cols(num) {
    this._reactProps.cols = num;
  }

  /**
   * Retrieves the number of visible columns
   * @access public
   * @returns {Number} number of visisble columns
   */
  get cols() {
    return this._reactProps.cols;
  }

  /**
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled,
   * false if the element should be disabled.  undefined to unset the field.
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
   * Sets which form the textarea belongs to
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject that represents the form.
   * null or undefined to clear it
   */
  set form(displayObject) {
    if (
      displayObject &&
      (!displayObject.accessible ||
        displayObject.accessible.role !== ROLES.FORM)
    ) {
      throw new Error(
        `The form property of a ${this.role} must be a DisplayObject with a role of ${ROLES.FORM}`
      );
    }
    this._form = displayObject;
    this._reactProps.form = displayObject
      ? displayObject.accessible.domId
      : undefined;
  }

  /**
   * Retrieves which form the textarea belongs to
   * @access public
   * @returns {createjs.DisplayObject} DisplayObject that represents the form
   */
  get form() {
    return this._form;
  }

  /**
   * Retrieves the DOM id of which form the textarea belongs to
   * @access public
   * @returns {String} DOM id of which form the textarea belongs to
   */
  get formDomId() {
    return this._reactProps.form;
  }

  /**
   * Sets the maximum number of characters allowed in the text field
   * @access public
   * @param {Number} num - maximum number of characters allowed in the text field
   */
  set maxLength(num) {
    this._reactProps.maxLength = num;
  }

  /**
   * Retrieves the maximum number of characters allowed in the text field
   * @access public
   * @returns {Number} maximum number of characters allowed in the text field
   */
  get maxLength() {
    return this._reactProps.maxLength;
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

  /**
   * Sets the string to use as the placeholder value
   * @access public
   * @param {String} str - placeholder value
   */
  set placeholder(str) {
    this._reactProps.placeholder = str;
  }

  /**
   * Retrieves the string to use as the placeholder value
   * @access public
   * @returns {String} placeholder value
   */
  get placeholder() {
    return this._reactProps.placeholder;
  }

  /**
   * Sets the text input field is read only or also editable
   * @access public
   * @param {boolean} enable - true if the element should be read only, false for read and editable
   */
  set readOnly(enable) {
    this._reactProps.readOnly = enable;
  }

  /**
   * Retrieves whether the text input field is read only or also editable
   * @access public
   * @returns {boolean} true if the element should be read only, false for read and editable
   */
  get readOnly() {
    return this._reactProps.readOnly;
  }

  /**
   * Sets whether the text input field needs a value before a form is submitted
   * @access public
   * @param {boolean} enable - true if the element is required, false otherwise
   */
  set required(enable) {
    this._reactProps.required = enable;
  }

  /**
   * Retrieves whether the text input field needs a value before a form is submitted
   * @access public
   * @returns {boolean} true if the element is required, false otherwise
   */
  get required() {
    return this._reactProps.required;
  }

  /**
   * Sets the number of visible rows
   * @access public
   * @param {Number} num - number of visisble rows
   */
  set rows(num) {
    this._reactProps.rows = num;
  }

  /**
   * Retrieves the number of visible rows
   * @access public
   * @returns {Number} number of visisble rows
   */
  get rows() {
    return this._reactProps.rows;
  }

  /**
   * Sets the value of the text input field
   * @access public
   * @param {String} str - string value for the text input field
   */
  set value(str) {
    const elementId = this._reactProps.id;
    const element = document.getElementById(elementId);
    element.value = str;
  }

  /**
   * Retrieves the value of the text input field
   * @access public
   * @returns {String} string value for the text input field
   */
  get value() {
    const elementId = this._reactProps.id;
    const element = document.getElementById(elementId);
    return element.value;
  }

  /**
   * Sets which wrapping mode to use
   * @access public
   * @param {boolean} soft - true if soft wrapping should be used, false for hard wrapping
   */
  set wrap(soft) {
    this._reactProps.wrap = soft ? 'soft' : 'hard';
  }

  /**
   * Retrieves which wrapping mode to use
   * @access public
   * @returns {boolean} true if soft wrapping should be used, false for hard
   */
  get wrap() {
    return this._reactProps.wrap === 'soft';
  }

  /**
   * event handler for when the value of the textarea tag changes
   * @access private
   * @param {Event} evt - event
   */
  _onChange(evt) {
    const event = new createjs.Event('valueChanged', false, false);
    event.newValue = evt.target.value;
    this._displayObject.dispatchEvent(event);
  }

  /**
   * event handler for when the selection changes
   * @access private
   * @param {Event} evt - event
   */
  _onSelect(evt) {
    const event = new createjs.Event('selectionChanged', false, false);
    event.selectionStart = evt.currentTarget.selectionStart;
    event.selectionEnd = evt.currentTarget.selectionEnd;
    event.selectionDirection = evt.currentTarget.selectionDirection;
    this._displayObject.dispatchEvent(event);
  }
}
