import _ from 'lodash';
import AccessibilityObject from './AccessibilityObject';
import { doesRoleUseSemanticallyInteractiveTag } from '../utils/roleUtils';

export default class ButtonData extends AccessibilityObject {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onClick');
    this._reactProps.onClick = this._onClick;
  }

  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (
      !displayObject.accessible ||
      doesRoleUseSemanticallyInteractiveTag(displayObject.accessible.role) ||
      !_.isUndefined(displayObject.accessible.tabIndex)
    ) {
      throw new Error(`Children of ${this.role} cannot be interactive`);
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (
      !displayObject.accessible ||
      doesRoleUseSemanticallyInteractiveTag(displayObject.accessible.role) ||
      !_.isUndefined(displayObject.accessible.tabIndex)
    ) {
      throw new Error(`Children of ${this.role} cannot be interactive`);
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Sets whether the element should get pressed
   * @access public
   * @param {boolean} val - true if button pressed
   */
  set pressed(val) {
    this._reactProps['aria-pressed'] = val;
  }

  /**
   * Retrieves whether button pressed
   * @access public
   * @returns {boolean} true if button pressed
   */
  get pressed() {
    return this._reactProps['aria-pressed'];
  }

  /**
   * Sets whether the element should get expanded
   * @access public
   * @param {boolean} val - true if button expanded, false if button not expanded,
   *  undefined if the field is unset
   */
  set expanded(val) {
    this._reactProps['aria-expanded'] = val;
  }

  /**
   * Retrieves whether button expanded
   * @access public
   * @returns {boolean} true if button expanded, false if button not expanded,
   *  undefined if the field is unset
   */
  get expanded() {
    return this._reactProps['aria-expanded'];
  }

  /**
   * Sets whether the element should get focus
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
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled,
   *  false if the element should be disabled.  undefined to unset the field.
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
   * Set the form_id to on submission
   * @access public
   * @param {String} str - form_id submission URL
   */
  set form(str) {
    this._reactProps.form = str;
  }

  /**
   * Retrieves the form_id from button
   * @access public
   * @returns {String} form submission URL
   */
  get form() {
    return this._reactProps.form;
  }

  /**
   * Set the URL to send form data to on submission
   * @access public
   * @param {String} str - form submission URL
   */
  set formaction(str) {
    this._reactProps.formAction = str;
  }

  /**
   * Retrieves the URL to send form data to on submission
   * @access public
   * @returns {String} form submission URL
   */
  get formaction() {
    return this._reactProps.formAction;
  }

  /**
   * When method=post, sets how form data should be encoded when sending to the server
   * @access public
   * @param {String} str - encoding type
   */
  set formenctype(str) {
    this._reactProps.encType = str;
  }

  /**
   * Retrieves how form data should be encoded when sending to the server when method=post
   * @access public
   * @returns {String} encoding type
   */
  get formenctype() {
    return this._reactProps.encType;
  }

  /**
   * Sets the HTTP method to use for sending form data
   * @access public
   * @param {String} str - HTTP method
   */
  set formmethod(str) {
    this._reactProps.formMethod = str;
  }

  /**
   * Retrieves the HTTP method for sending form data
   * @access public
   * @returns {String} HTTP method
   */
  get formmethod() {
    return this._reactProps.formMethod;
  }

  /**
   * Sets whether the form should be validated or not when submitted
   * @access public
   * @param {boolean} enable - true for validation, false otherwise
   */
  set formnovalidate(enable) {
    this._reactProps.formNoValidate = !enable;
  }

  /**
   * Retrieves whether the form should be validated or not when submitted
   * @access public
   * @returns {boolean} true if it should be validated, false otherwise
   */
  get formnovalidate() {
    return !this._reactProps.formNoValidate;
  }

  /**
   * Sets where to display the response from submitting the form
   * @access public
   * @param {String} str - where to display the response
   */
  set formtarget(str) {
    this._reactProps.formTarget = str;
  }

  /**
   * Retrieves where to display the response from submitting the form
   * @access public
   * @returns {String} where to display the response
   */
  get formtarget() {
    return this._reactProps.formTarget;
  }

  /**
   * Sets the name of the form
   * @access public
   * @param {String} str - name of the form
   */
  set name(str) {
    this._reactProps.name = str;
  }

  /**
   * Retrieves the name of the form
   * @access public
   * @returns {String} name of the form
   */
  get name() {
    return this._reactProps.name;
  }

  /**
   * Sets the type of button
   * @access public
   * @param {String} str - type of button (submit, reset, button)
   */
  set type(str) {
    this._reactProps.type = str;
  }

  /**
   * Retrieves the type of button
   * @access public
   * @returns {String} type of button (submit, reset, button)
   */
  get type() {
    return this._reactProps.type;
  }

  /**
   * Set button value
   * @access public
   * @param {string} str - button value
   */
  set value(str) {
    this._reactProps.value = str;
  }

  /**
   * get button value
   * @access public
   * @returns {string} -button value
   */
  get value() {
    return this._reactProps.value;
  }

  _onClick(evt) {
    const event = new createjs.Event('keyboardClick', false, evt.cancelable);
    this._displayObject.dispatchEvent(event);
    if (event.propagationStopped) {
      evt.stopPropagation();
    }
    if (event.defaultPrevented) {
      evt.preventDefault();
    }
  }
}
