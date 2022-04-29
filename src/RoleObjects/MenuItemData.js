import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import { ROLES } from '../Roles';
import AccessibilityObject from './AccessibilityObject';

export default class MenuItemData extends AccessibilityObject {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onKeyDown', '_menuItemKeyDown', '_subMenuOpenerKeyDown');

    this._reactProps.onKeyDown = this._onKeyDown;
    this._isPopupOpener = false;
    this._reactProps['aria-haspopup'] = false;
    this._activeKeyDownListener = this._menuItemKeyDown;
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
      !displayObject.accessible
      || [
        ROLES.MENUITEM,
        ROLES.MENU,
        ROLES.MENUITEMCHECKBOX,
        ROLES.MENUITEMRADIO,
      ].indexOf(displayObject.accessible.role) === -1
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.MENUITEM} or ${ROLES.MENU} or ${ROLES.MENUITEMCHECKBOX} or ${ROLES.MENUITEMRADIO} `
      );
    }

    this._addingChild(displayObject);

    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (
      !displayObject.accessible
      || [
        ROLES.MENUITEM,
        ROLES.MENU,
        ROLES.MENUITEMCHECKBOX,
        ROLES.MENUITEMRADIO,
      ].indexOf(displayObject.accessible.role) === -1
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.MENUITEM} or ${ROLES.MENU} or ${ROLES.MENUITEMCHECKBOX} or ${ROLES.MENUITEMRADIO}`
      );
    }

    this._addingChild(displayObject);

    super.addChildAt(displayObject, index);
  }

  /**
   * Informs a menu label of which DisplayObject is the submenu
   * @access package
   * @param {Object} displayObject - accessibility DisplayObject
   */
  set subMenu(displayObject) {
    this._subMenu = displayObject;
    this._activeKeyDownListener = displayObject
      ? this._subMenuOpenerKeyDown
      : this._menuItemKeyDown;
  }

  /**
   * Sets whether the menu item is expanded or collapsed.
   * If the menu item is not expandable, then this should be set to undefined.
   * @access public
   * @param {boolean} val - true if the menu is expanded,
   * false if it is collapsed, undefined if the item is not expandable
   */
  set expanded(val) {
    this._reactProps['aria-expanded'] = val;
  }

  /**
   * Retrieves whether the menu item is expanded, collapsed, or not expandable.
   * @access public
   * @returns {boolean} - true if the item is expanded,
   * false if the item is collapsed, undefined if it is not expandable
   */
  get expanded() {
    return this._reactProps['aria-expanded'];
  }

  /**
   * Sets the position in the current set of items
   * @access public
   * @param {Number} num - One based index for the position in the current set of items.
   * Or undefined to clear the field
   */
  set positionInSet(num) {
    this._reactProps['aria-posinset'] = num;
  }

  /**
   * Retrieves the position in the current set of items
   * @access public
   * @returns {Number} One based index for the position in the current set of items
   */
  get positionInSet() {
    return this._reactProps['aria-posinset'];
  }

  /**
   * Sets the number of items in the current set of items
   * @access public
   * @param {Number} num - Number of items in the current set.  Or undefined to clear the field
   */
  set setSize(num) {
    this._reactProps['aria-setsize'] = num;
  }

  /**
   * Retrieves the number of items in the current set of items
   * @access public
   * @returns {Number} the number of items in the current set of items
   */
  get setSize() {
    return this._reactProps['aria-setsize'];
  }

  /**
   * Keydown listener for when the item manages opening a menu
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _subMenuOpenerKeyDown(evt) {
    const toggleMenu = evt.keyCode === KeyCodes.enter
      || evt.keyCode === KeyCodes.space
      || (evt.keyCode === KeyCodes.down && !this._subMenu.visible);
    const focusToFirstItem = evt.keyCode === KeyCodes.down
      || (!this._subMenu.visible
        && (evt.keyCode === KeyCodes.enter || evt.keyCode === KeyCodes.space));
    if (toggleMenu) {
      const event = new createjs.Event(
        this._subMenu.visible ? 'closeMenu' : 'openMenu',
        false,
        evt.cancelable
      );
      const skipPreventDefault = this._displayObject.dispatchEvent(event);
      if (!skipPreventDefault) {
        evt.preventDefault();
      }
    }
    if (focusToFirstItem) {
      const firstSubMenuItem = this._subMenu.accessible.children[0];
      this._subMenu.accessible._forceShow();
      firstSubMenuItem.accessible.requestFocus();
      evt.stopPropagation();
    }
  }

  /**
   * Keydown listener for an entry in a popup menu
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _menuItemKeyDown(evt) {
    if (evt.keyCode === KeyCodes.enter) {
      const event = new createjs.Event('keyboardClick', false, evt.cancelable);
      const skipPreventDefault = this._displayObject.dispatchEvent(event);
      if (!skipPreventDefault) {
        evt.preventDefault();
      }
      evt.stopPropagation();
    }
  }

  /**
   * Helper function for addChild and addChildAt that handles common menu item
   * specific settings when adding a DisplayObject
   * @access private
   * @param {createjs.DisplayObject} displayObject - DisplayObject being added
   */
  _addingChild(displayObject) {
    if (
      [ROLES.MENUITEM, ROLES.MENUITEMCHECKBOX].indexOf(
        displayObject.accessible.role
      ) !== -1
    ) {
      displayObject.accessible._isPopupOpener = true;
      this._label = displayObject;
      this._activeKeyDownListener = undefined;
    } else if (displayObject.accessible.role === ROLES.MENU) {
      this._subMenu = displayObject;
    }

    if (this._label) {
      this._label.accessible.subMenu = this._subMenu;
    }
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

    if (this._activeKeyDownListener) {
      this._activeKeyDownListener(evt);
    }
  }
}
