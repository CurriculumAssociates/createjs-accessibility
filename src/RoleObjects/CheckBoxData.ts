import KeyCodes from 'keycodes-enum';
import _ from 'lodash';
import React from 'react';
import InputTagData from './InputTagData';
import { AccessibleDisplayObject } from './AccessibilityObject';
import { ROLES } from '../Roles';

/**
 * Base class for role objects that use the img HTML tag.
 * This contains only setters/getters for fields that are common to all img tags
 * regardless of the type attribute.
 */
export default class CheckBoxData extends InputTagData {
  constructor(
    displayObject: AccessibleDisplayObject,
    role: ROLES,
    domIdPrefix: string
  ) {
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
  set enableKeyEvents(enable: boolean) {
    super.enableKeyEvents = enable;
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  get enableKeyEvents(): boolean {
    return super.enableKeyEvents;
  }

  /**
   * Sets whether the element is checked
   * @access public
   * @param {boolean} check - true if the element is checked, false otherwise
   */
  set checked(check: boolean) {
    this._reactProps.checked = check;
  }

  /**
   * Retrieves whether the element is checked
   * @access public
   * @returns {boolean} true if the element is checked, false otherwise
   */
  get checked(): boolean {
    return <boolean>this._reactProps.checked;
  }

  /**
   * @inheritdoc
   */
  _onKeyDown(evt: React.KeyboardEvent): void {
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
   */
  _onChange(): void {
    this._displayObject.dispatchEvent('keyboardClick');
  }
}
