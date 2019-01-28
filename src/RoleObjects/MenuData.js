import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import { ROLES } from '../Roles.js';
import SelectData from './SelectData.js';

export default class MenuData extends SelectData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, 'onKeyDown');
    this._reactProps.onKeyDown = this.onKeyDown;
  }

  addChild(displayObject) {
    if (!displayObject.accessible || [ROLES.MENUITEM, ROLES.MENUITEMCHECKBOX, ROLES.MENUITEMRADIO, ROLES.SEPARATOR].indexOf(displayObject.accessible.role) === -1) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.MENUITEM}, ${ROLES.MENUITEMCHECKBOX}, ${ROLES.MENUITEMRADIO} or ${ROLES.SEPARATOR}`);
    }
    super.addChild(displayObject);
  }

  addChildAt(displayObject, index) {
    if (!displayObject.accessible || [ROLES.MENUITEM, ROLES.MENUITEMCHECKBOX, ROLES.MENUITEMRADIO, ROLES.SEPARATOR].indexOf(displayObject.accessible.role) === -1) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.MENUITEM}, ${ROLES.MENUITEMCHECKBOX}, ${ROLES.MENUITEMRADIO} or ${ROLES.SEPARATOR}`);
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Listener to use for keydown events
   * @access package
   */
  onKeyDown(evt) {
    if (evt.keyCode === KeyCodes.up || evt.keyCode === KeyCodes.down) {
      const targetId = evt.target.id;
      const currIndex = this._domIdToChildIndex(targetId);
      let nextIndex;
      if (evt.keyCode === KeyCodes.up) {
        nextIndex = (this._children.length + currIndex - 1) % this._children.length;
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
