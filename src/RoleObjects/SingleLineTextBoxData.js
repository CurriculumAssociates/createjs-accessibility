import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import { ROLES } from '../Roles.js';
import InputTagData from './InputTagData.js';

export default class SingleLineTextBoxData extends InputTagData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onChange', '_onSelect');
    this._reactProps.type = 'text';
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
   * Sets whether the form should have autocomplete enabled
   * @access public
   * @param {boolean} enable - true if autocomplete should be enabled, false otherwise
   */
  set autocomplete(enable) {
    this._reactProps.autocomplete = enable ? 'on' : 'off';
  }

  /**
   * Retrieves whether autocomplete is enabled
   * @access public
   * @returns {boolean} true if autocomplete is enabled, false otherwise
   */
  get autocomplete() {
    return this._reactProps.autocomplete === 'on';
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
   * Sets the regex that the value of the text input field is checked against
   * @access public
   * @param {String} str - regex to validate the value
   */
  set pattern(str) {
    this._reactProps.pattern = str;
  }

  /**
   * Retrieves the regex that the value of the text input field is checked against
   * @access public
   * @returns {String} regex to validate the value
   */
  get pattern() {
    return this._reactProps.pattern;
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
   * Sets the width of the text field based on the number of characters
   * @access public
   * @param {Number} numChars - width of the text field in number of characters
   */
  set size(numChars) {
    this._reactProps.size = numChars;
  }

  /**
   * Retrieves the width of the text field based on the number of characters
   * @access public
   * @returns {Number} width of the text field in number of characters
   */
  get size() {
    return this._reactProps.size;
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
   * React event handler for when the value of the input tag changes
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
