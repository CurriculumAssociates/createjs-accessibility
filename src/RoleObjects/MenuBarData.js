import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import { ROLES } from '../Roles';
import SelectData from './SelectData';

export default class MenuBarData extends SelectData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, 'onKeyDown');
    this._reactProps.onKeyDown = this.onKeyDown;
  }

  addChild(displayObject) {
    if (!displayObject.accessible || [ROLES.MENUITEM,
      ROLES.MENUITEMCHECKBOX,
      ROLES.MENUITEMRADIO].indexOf(displayObject.accessible.role) === -1) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.MENUITEM} or ${ROLES.MENUITEMCHECKBOX} or ${ROLES.MENUITEMRADIO}`);
    }
    super.addChild(displayObject);
  }

  addChildAt(displayObject, index) {
    if (!displayObject.accessible || [ROLES.MENUITEM,
      ROLES.MENUITEMCHECKBOX,
      ROLES.MENUITEMRADIO].indexOf(displayObject.accessible.role) === -1) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.MENUITEM} or ${ROLES.MENUITEMCHECKBOX} or ${ROLES.MENUITEMRADIO}`);
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Listener to use for keydown events
   * @access package
   */

  onKeyDown(evt) {
    if (evt.keyCode === KeyCodes.left || evt.keyCode === KeyCodes.right) {
      // close a menu if any are open
      let index = _.findIndex(this._children, menu => menu.accessible.expanded);

      if (index !== -1) {
        this._children[index]._label.dispatchEvent('closeMenu');
      }

      // open the new menu
      if (evt.keyCode === KeyCodes.left) {
        index = (this._children.length + index - 1) % this._children.length;
      } else if (evt.keyCode === KeyCodes.right) {
        index = (index + 1) % this._children.length;
      }
      const nextMenu = this._children[index];

      nextMenu._label.dispatchEvent('openMenu');

      const firstSubMenuItem = nextMenu.accessible._subMenu.accessible.children[0];

      nextMenu.accessible._subMenu.accessible._forceShow();
      firstSubMenuItem.accessible.requestFocus();

      evt.stopPropagation();
      evt.preventDefault();
    }
  }
}
