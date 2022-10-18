import RangeData from './RangeData';

export default class ProgressData extends RangeData {
  /**
   * Sets max value of progress
   * @access public
   * @param {Number} value - value of progress
   */
  set valueMax(value) {
    this._reactProps.max = value;
  }

  /**
   * return max value of progress
   * @access public
   * @return {Number} max value of progress
   */
  get valueMax() {
    return this._reactProps.max;
  }

  /**
   * Sets current value of progress
   * @access public
   * @param {Number} value - value of progress
   */
  set valueNow(value) {
    this._reactProps.value = value;
  }

  /**
   * return current value of progress
   * @access public
   * @return {Number} current value of progress
   */
  get valueNow() {
    return this._reactProps.value;
  }
}
