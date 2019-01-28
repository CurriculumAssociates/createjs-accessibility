import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import { ROLES } from '../Roles.js';
import AccessibilityObject from './AccessibilityObject.js';

export default class MultiLineTextBoxData extends AccessibilityObject {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onChange', '_onSelect');
    this._reactProps['aria-multiline'] = true;
    this._reactProps.value = '';
    this._reactProps.onChange = this._onChange;
    this._reactProps.onSelect = this._onSelect;
  }

  addChild(displayObject) {
    throw new Error(`${this.role} cannot have children`);
  }

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
   * @param {boolean} enable - true if the element should be enabled, false otherwise
   */
  set enabled(enable) {
    this._reactProps.disabled = enable ? undefined : 'disabled';
  }

  /**
   * Retrieves whether the element is enabled
   * @access public
   * @returns {boolean} true if the element is enabled, false otherwise
   */
  get enabled() {
    return this._reactProps.disabled !== 'disabled';
  }

  /**
   * Sets which form the textarea belongs to
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject that represents the form.  null or undefined to clear it
   */
  set form(displayObject) {
    if (displayObject && (!displayObject.accessible || displayObject.accessible.role !== ROLES.FORM)) {
      throw new Error(`The form property of a ${this.role} must be a DisplayObject with a role of ${ROLES.FORM}`);
    }
    this._form = displayObject;
    this._reactProps.form = displayObject ? displayObject.accessible.domId : undefined;
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
    this._reactProps.value = str;
  }

  /**
   * Retrieves the value of the text input field
   * @access public
   * @returns {String} string value for the text input field
   */
  get value() {
    return this._reactProps.value;
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
   * React event handler for when the value of the textarea tag changes
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onChange(evt) {
    this._reactProps.value = evt.target.value;

    const event = new createjs.Event('valueChanged', false, false);
    event.newValue = this._reactProps.value;
    this._displayObject.dispatchEvent(event);
  }

  /**
   * React event handler for when the selection changes
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onSelect(evt) {
    const event = new createjs.Event('selectionChanged', false, false);
    event.selectionStart = evt.currentTarget.selectionStart;
    event.selectionEnd = evt.currentTarget.selectionEnd;
    event.selectionDirection = evt.currentTarget.selectionDirection;
    this._displayObject.dispatchEvent(event);
  }
}
