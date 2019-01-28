import GroupData from './GroupData.js';

export default class SelectData extends GroupData {
  /**
    * Sets the orientation
    * @access public
    * @param {String} str - "horizontal" for a horizontal slider, "vertical" for a vertical slider
    */
  set orientation(str) {
    this._reactProps['aria-orientation'] = str;
  }

  /**
    * Retrieves the orientation
    * @access public
    * @returns  {String} str "horizontal" for a horizontal slider, "vertical" for a vertical slider
    */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }
}
