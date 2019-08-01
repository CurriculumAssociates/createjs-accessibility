import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import RangeData from './RangeData';

export default class SpinButtonData extends RangeData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onChange');
    this._reactProps.onChange = this._onChange;
    this._reactProps.type = 'number';
    this.enableKeyEvents = true;
  }

  set enableKeyEvents(enable) {
    super.enableKeyEvents = enable;
    // the keydown listener is needed for this role to function per WAI-ARIA practices
    // even when using a semantic tag/attribute
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  get enableKeyEvents() {
    return super.enableKeyEvents;
  }

  /**
  * Set value
  * @access public
  * @param {Number} val - current value
  */
  set value(val) {
    this._reactProps.value = val;
  }

  /**
  * get value
  * @access public
  * @returns {Number}  current value
  */
  get value() {
    return this._reactProps.value;
  }

  /**
  * Set min value
  * @access public
  * @param {Number} val - min value
  */
  set min(val) {
    this._reactProps.min = val;
  }

  /**
  * get min value
  * @access public
  * @returns {Number}  min value
  */
  get min() {
    return this._reactProps.min;
  }

  /**
  * Set max value
  * @access public
  * @param {Number} val - max value
  */
  set max(val) {
    this._reactProps.max = val;
  }

  /**
  * get max value
  * @access public
  * @returns {Number} - max value
  */
  get max() {
    return this._reactProps.max;
  }

  /**
   * @access public
   * @param {boolean} value - true if the element should be read only, false for read and editable
   */
  set readOnly(value) {
    this._reactProps['aria-readonly'] = value;
  }

  /**
   * @access public
   * @returns {boolean} true if the element should be read only, false for read and editable
   */
  get readOnly() {
    return this._reactProps['aria-readonly'];
  }

  /**
   * @access public
   * @param {boolean} value - true if the element is required, false otherwise
   */
  set required(value) {
    this._reactProps['aria-required'] = value;
  }

  /**
   * @access public
   * @returns {boolean} true if the element is required, false otherwise
   */
  get required() {
    return this._reactProps['aria-required'];
  }

  _onKeyDown(evt) {
    if (this.enableKeyEvents) {
      super._onKeyDown(evt);
    }

    if (evt.keyCode === KeyCodes.up) {
      this._displayObject.dispatchEvent('increment');
    } else if (evt.keyCode === KeyCodes.down) {
      this._displayObject.dispatchEvent('decrement');
    } else if (evt.keyCode === KeyCodes.home && this.min !== undefined) {
      const event = new createjs.Event('change', false, false);
      event.value = this.min;
      this._displayObject.dispatchEvent(event);
      evt.stopPropagation();
      evt.preventDefault();
    } else if (evt.keyCode === KeyCodes.end && this.max !== undefined) {
      const event = new createjs.Event('change', false, false);
      event.value = this.max;
      this._displayObject.dispatchEvent(event);
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  _onChange(evt) {
    const event = new createjs.Event('change', false, false);
    event.value = parseInt(evt.target.value, 10);
    this._displayObject.dispatchEvent(event);
  }
}
