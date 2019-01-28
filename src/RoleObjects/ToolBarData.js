import AccessibilityObject from './AccessibilityObject.js';
import GroupData from './GroupData.js';

export default class ToolBarData extends GroupData {
  /**
    * Sets the orientation of ToolBar
    * @access public
    * @param {String} str - "horizontal" for a horizontal ToolBar, "vertical" for a vertical ToolBar
    */
  set orientation(str) {
    this._reactProps['aria-orientation'] = str;
  }

  /**
    * Retrieves the orientation of ToolBar
    * @access public
    * @returns  {String} str "horizontal" for a horizontal ToolBar, "vertical" for a vertical ToolBar
    */
  get orientation() {
    return this._reactProps['aria-orientation'];
  }
}
