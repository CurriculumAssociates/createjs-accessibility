import SectionData from './SectionData';

export default class FormData extends SectionData {
  /**
   * Sets the character encoding for form submission
   * @access public
   * @param {String} str - character encoding to use
   */
  set charSet(str) {
    this._reactProps['accept-charset'] = str;
  }

  /**
   * Retrieves the character encoding for form submission
   * @access public
   * @returns {String} character encoding used
   */
  get charSet() {
    return this._reactProps['accept-charset'];
  }

  /**
   * Set the URL to send form data to on submission
   * @access public
   * @param {String} str - form submission URL
   */
  set action(str) {
    this._reactProps.action = str;
  }

  /**
   * Retrieves the URL to send form data to on submission
   * @access public
   * @returns {String} form submission URL
   */
  get action() {
    return this._reactProps.action;
  }

  /**
   * Sets whether the form should have autocomplete enabled or not
   * @access public
   * @param {boolean} enable - true if autocomplete should be enabled, false otherwise
   */
  set autoComplete(enable) {
    this._reactProps.autoComplete = enable ? 'on' : 'off';
  }

  /**
   * Retrieves whether autocomplete is enabled or not for the form
   * @access public
   * @returns {boolean} true if autocomplete is enabled (by default or explicitly), false otherwise
   */
  get autoComplete() {
    return this._reactProps.autoComplete === undefined || this._reactProps.autoComplete === 'on';
  }

  /**
   * When method=post, sets how form data should be encoded when sending to the server
   * @access public
   * @param {String} str - encoding type
   */
  set enctype(str) {
    this._reactProps.enctype = str;
  }

  /**
   * Retrieves how form data should be encoded when sending to the server when method=post
   * @access public
   * @returns {String} encoding type
   */
  get enctype() {
    return this._reactProps.enctype;
  }

  /**
   * Sets the HTTP method to use for sending form data
   * @access public
   * @param {String} str - HTTP method
   */
  set method(str) {
    this._reactProps.method = str;
  }

  /**
   * Retrieves the HTTP method for sending form data
   * @access public
   * @returns {String} HTTP method
   */
  get method() {
    return this._reactProps.method;
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
   * Sets whether the form should be validated or not when submitted
   * @access public
   * @param {boolean} enable - true for validation, false otherwise
   */
  set validate(enable) {
    this._reactProps.novalidate = !enable;
  }

  /**
   * Retrieves whether the form should be validated or not when submitted
   * @access public
   * @returns {boolean} true if it should be validated, false otherwise
   */
  get validate() {
    return !this._reactProps.novalidate;
  }

  /**
   * Sets where to display the response from submitting the form
   * @access public
   * @param {String} str - where to display the response
   */
  set target(str) {
    this._reactProps.target = str;
  }

  /**
   * Retrieves where to display the response from submitting the form
   * @access public
   * @returns {String} where to display the response
   */
  get target() {
    return this._reactProps.target;
  }
}
