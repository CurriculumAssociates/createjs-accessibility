import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import InputTagData from './InputTagData';

/**
 * Base class for role objects that use the img HTML tag.
 * This contains only setters/getters for fields that are common to all img tags
 * regardless of the type attribute.
 */
export default class CheckBoxData extends InputTagData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onKeyDown', '_onChange');
    this._reactProps.onChange = this._onChange;
    this._reactProps.onKeyDown = this._onKeyDown;
    this._reactProps.type = 'checkbox';
    this._reactProps.checked = false;
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
   * Sets whether the element is checked
   * @access public
   * @param {boolean} check - true if the element is checked, false otherwise
   */
  set checked(check) {
    this._reactProps.checked = check;
  }

  /**
   * Retrieves whether the element is checked
   * @access public
   * @returns {boolean} true if the element is checked, false otherwise
   */
  get checked() {
    return this._reactProps.checked;
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

    if (evt.keyCode === KeyCodes.enter) {
      this._displayObject.dispatchEvent('keyboardClick');
    }
  }

  /**
   * Event listener for change events
   * @access protected
   * @param {SyntheticEvent} evt - React event
   */
  _onChange() {
    this._displayObject.dispatchEvent('keyboardClick');
  }
}
