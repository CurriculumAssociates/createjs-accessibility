import SectionData from './SectionData.js';

export default class HeadingData extends SectionData {
  /**
   * Sets an element's hierarchical level within a structure.
   * @access public
   * @param {Number} val - Positive number
   */
  set level(val) {
    this._reactProps['aria-level'] = val;
  }

  /**
   * Gives an element's hierarchical level within a structure.
   * @access public
   * @returns {Number} - Positive number
   */
  get level() {
    return this._reactProps['aria-level'];
  }
}
