import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import InputTagData from './InputTagData';

export default class RadioData extends InputTagData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onKeyDown');
    this._reactProps.type = 'radio';
    this._reactProps.onKeyDown = this._onKeyDown;
    this._reactProps.onChange = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  set enableKeyEvents(enable) {
    super.enableKeyEvents = enable;
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  get enableKeyEvents() {
    return super.enableKeyEvents;
  }

  /**
   * Sets the value of the radio button
   * @access private
   * @param {String} value - value of the radio button
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
   * @inheritdoc
   */
  _onKeyDown(evt) {
    if (this.enableKeyEvents) {
      super._onKeyDown(evt);
      if (evt.defaultPrevented) {
        return;
      }
    }

    if (evt.keyCode === KeyCodes.enter || evt.keyCode === KeyCodes.space) {
      const event = new createjs.Event('keyboardClick', false, evt.cancelable);
      this._displayObject.dispatchEvent(event);
    }
  }
}
