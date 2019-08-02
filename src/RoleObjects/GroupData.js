import SectionData from './SectionData';

export default class GroupData extends SectionData {
  /**
   * Sets the currently active descendant of a composite widget
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject that is the active descendant
   * of this one.  undefined to unset the field.
   */
  set active(displayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error('DisplayObject being set as the active descendant must have accessibility information');
    }
    this._active = displayObject;
    this._reactProps['aria-activedescendant'] = displayObject ? displayObject.accessible.domId : undefined;
  }

  /**
   * Retrieves which DisplayObject is the current active descendant
   * @access public
   * @returns  {createjs.DisplayObject} DisplayObject that is the current active descendant
   */
  get active() {
    return this._active;
  }

  /**
   * Retrieves the DOM id for the tranlated DisplayObject that is the active descendant.
   * @access public
   * @returns {String} id for the translated DisplayObject that is the active descendant
   */
  get activeId() {
    return this._reactProps['aria-activedescendant'];
  }
}
