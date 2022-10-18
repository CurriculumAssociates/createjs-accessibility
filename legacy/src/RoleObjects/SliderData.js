import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import InputTagData from './InputTagData';

/**
 * Class for the slider role
 */
export default class SliderData extends InputTagData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);

    _.bindAll(this, '_onChange', '_onKeyDown');
    this._reactProps.onChange = this._onChange;
    this._reactProps.onKeyDown = this._onKeyDown;
    this._reactProps.type = 'range';
  }

  /**
   * @inheritdoc
   */
  set enableKeyEvents(enable) {
    super.enableKeyEvents = enable;
    // keeping the keydown listener always bound for simplicity of dealing with
    // when pageStep is set.
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  get enableKeyEvents() {
    return super.enableKeyEvents;
  }

  /**
   * Sets the step of the slider
   * @access public
   * @param {Number} val - step of the slider
   */
  set step(val) {
    this._reactProps.step = val;
  }

  /**
   * Retrieves the step of the slider
   * @access public
   * @returns {Number} step of the slider
   */
  get step() {
    return this._reactProps.step;
  }

  /**
   * Sets the amount to adjust the slider by for page up/down of the slider.
   * When this is field is unset, the browser default behavior will be used for
   * those keystrokes.
   * @access public
   * @param {Number} val - amount to increment or decrement the slider value by
   * when page up or page down are pressed.  undefined to unset the field.
   */
  set pageStep(val) {
    this._pageStep = val;
  }

  /**
   * Retrieves the amount to adjust the slider by for page up/down keystrokes
   * @access public
   * @returns {Number} amount to increment or decrement the slider value by when
   * page up or down is pressed.  undefined when browser default behavior is used
   * for those keystrokes.
   */
  get pageStep() {
    return this._pageStep;
  }

  /**
   * Sets the orientation of slider
   * @access public
   * @param {String} str - "horizontal" for a horizontal slider, "vertical" for a vertical slider
   */
  set orientation(str) {
    this._reactProps['aria-orientation'] = str;
  }

  /**
   * Retrieves the orientation of slider
   * @access public
   * @returns  {String} str "horizontal" for a horizontal slider, "vertical" for a vertical slider
   */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }

  /**
   * Set slider value
   * @access public
   * @param {Number} val - slider current value
   */
  set value(val) {
    this._reactProps.value = val;
  }

  /**
   * get slider value
   * @access public
   * @returns {Number} -slider current value
   */
  get value() {
    return this._reactProps.value;
  }

  /**
   * Set slider min value
   * @access public
   * @param {Number} val - slider min value
   */
  set min(val) {
    this._reactProps.min = val;
  }

  /**
   * get slider min value
   * @access public
   * @returns {Number} -slider min value
   */
  get min() {
    return this._reactProps.min;
  }

  /**
   * Set slider max value
   * @access public
   * @param {Number} val - slider max value
   */
  set max(val) {
    this._reactProps.max = val;
  }

  /**
   * get slider max value
   * @access public
   * @returns {Number} - slider max value
   */
  get max() {
    return this._reactProps.max;
  }

  /**
   * Event listener for React change events
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onChange(evt) {
    this.value = evt.target.value;
    const event = new createjs.Event('valueChanged', false, false);
    event.newValue = this.value;
    this._displayObject.dispatchEvent(event);
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

    if (
      !_.isUndefined(this.pageStep) &&
      (evt.keyCode === KeyCodes.pageup || evt.keyCode === KeyCodes.pagedown)
    ) {
      const multiplier = evt.keyCode === KeyCodes.pageup ? 1 : -1;
      const delta = multiplier * this.pageStep;
      this.value = _.toNumber(this.value) + delta;
      if (!_.isUndefined(this.min)) {
        this.value = Math.max(this.value, this.min);
      }
      if (!_.isUndefined(this.max)) {
        this.value = Math.min(this.value, this.max);
      }

      const event = new createjs.Event('valueChanged', false, false);
      event.newValue = this.value;
      this._displayObject.dispatchEvent(event);

      evt.stopPropagation();
      evt.preventDefault();
    }
  }
}
