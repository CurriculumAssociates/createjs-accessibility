import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import { ROLES } from '../Roles';
import SelectData from './SelectData';

export default class MenuData extends SelectData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onKeyDown');
    this._reactProps.onKeyDown = this._onKeyDown;
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
   * @inheritdoc
   */
  addChild(displayObject) {
    if (
      !displayObject.accessible ||
      [
        ROLES.MENUITEM,
        ROLES.MENUITEMCHECKBOX,
        ROLES.MENUITEMRADIO,
        ROLES.SEPARATOR,
      ].indexOf(displayObject.accessible.role) === -1
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.MENUITEM}, ${ROLES.MENUITEMCHECKBOX}, ${ROLES.MENUITEMRADIO} or ${ROLES.SEPARATOR}`
      );
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (
      !displayObject.accessible ||
      [
        ROLES.MENUITEM,
        ROLES.MENUITEMCHECKBOX,
        ROLES.MENUITEMRADIO,
        ROLES.SEPARATOR,
      ].indexOf(displayObject.accessible.role) === -1
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.MENUITEM}, ${ROLES.MENUITEMCHECKBOX}, ${ROLES.MENUITEMRADIO} or ${ROLES.SEPARATOR}`
      );
    }
    super.addChildAt(displayObject, index);
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

    if (evt.keyCode === KeyCodes.up || evt.keyCode === KeyCodes.down) {
      const targetId = evt.target.id;
      const currIndex = this._domIdToChildIndex(targetId);
      let nextIndex;
      if (evt.keyCode === KeyCodes.up) {
        nextIndex =
          (this._children.length + currIndex - 1) % this._children.length;
      } else {
        nextIndex = (currIndex + 1) % this._children.length;
      }

      // this doesn't handle menus starting/ending with a separator
      if (this._children[nextIndex].accessible.role === ROLES.SEPARATOR) {
        evt.keyCode === KeyCodes.up ? nextIndex-- : nextIndex++;
      }
      this._children[nextIndex].accessible.requestFocus();

      evt.stopPropagation();
      evt.preventDefault();
    }
  }
}
