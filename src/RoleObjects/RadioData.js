import _ from 'lodash';
import createjs from 'createjs';
import KeyCodes from 'keycodes-enum';
import InputTagData from './InputTagData';

export default class RadioData extends InputTagData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onRadioKeyDown');
    this._reactProps.type = 'radio';
    this._reactProps.onKeyDown = this._onRadioKeyDown;
    this._reactProps.onChange = this._onRadioKeyDown;
  }

  /**
   * Sets the value of the radio button
   * @access private
   */


  set value(value) {
    this._reactProps.value = value;
  }

  /**
   * Retrieves the value of radio button
   * @access private
   */
  get value() {
    return this._reactProps.value;
  }

  /**
   * Sets the state of the radio button i.e. Checked/Unchecked
   * @access public
   * @param {boolean} value - true to check & false to uncheck
   */
  set checked(value) {
    this._reactProps.checked = value;
  }

  /**
   * Retrieves the state of the radio button
   * @access public
   */
  get checked() {
    return this._reactProps.checked;
  }

  /**
   * Sets the size of the radio list
   * @access public
   * @param {boolean} value - Total no. of radio buttons in the list
   */
  set size(value) {
    this._reactProps['aria-setsize'] = value;
  }

  /**
   * Retrieves the size of the radio list
   * @access public
   */
  get size() {
    return this._reactProps['aria-setsize'];
  }

  /**
   * Sets the position of the radio button in the list
   * @access public
   * @param {boolean} value - psoition of the radio button in the list
   */
  set position(value) {
    this._reactProps['aria-posinset'] = value;
  }

  /**
   * Retrieves the position of the radio button from the list
   * @access public
   */
  get position() {
    return this._reactProps['aria-posinset'];
  }

  /**
   * Keydown listener for when the radio button is pressed
   * @access private
   */

  _onRadioKeyDown(e) {
    if ([KeyCodes.enter, KeyCodes.space].indexOf(e.keyCode) !== -1) {
      const event = new createjs.Event('keyboardClick', false, e.cancelable);
      this._displayObject.dispatchEvent(event);
    }
  }
}
