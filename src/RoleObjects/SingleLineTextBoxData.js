import _ from 'lodash';
import InputTagData from './InputTagData';

export default class SingleLineTextBoxData extends InputTagData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onChange', '_onSelect');
    this._reactProps.type = 'text';
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
      throw new Error('DisplayObject being set as the active descendant must have accessibility information');
    }
    this._active = displayObject;
    this._reactProps['aria-activedescendant'] = displayObject ? displayObject.accessible.domId : undefined;
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
   * Sets whether the form should have autocomplete enabled
   * @access public
   * @param {boolean} enable - true if autocomplete should be enabled, false otherwise
   */
  set autoComplete(enable) {
    this._reactProps.autoComplete = enable ? 'on' : 'off';
  }

  /**
   * Retrieves whether autocomplete is enabled
   * @access public
   * @returns {boolean} true if autocomplete is enabled, false otherwise
   */
  get autoComplete() {
    return this._reactProps.autoComplete === 'on';
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
    return this._reactProps.value;
  }

  /**
   * React event handler for when the value of the input tag changes
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onChange(evt) {
    const event = new createjs.Event('valueChanged', false, false);
    event.newValue = evt.target.value;
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
