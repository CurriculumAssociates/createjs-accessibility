import _ from 'lodash';
import InputTagData from './InputTagData';

/**
 * Class for the slider role
 */
export default class SliderData extends InputTagData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);

    _.bindAll(this, '_onChange');
    this._reactProps.onChange = this._onChange;
    this._reactProps.type = 'range';
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
    this._reactProps.value = evt.target.value;
    const event = new createjs.Event('valueChanged', false, false);
    event.newValue = this._reactProps.value;
    this._displayObject.dispatchEvent(event);
  }
}
