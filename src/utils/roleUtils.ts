import _ from 'lodash';
import { AccessibleDisplayObject } from '../RoleObjects/AccessibilityObject';
import { ROLES, RoleTagMapping } from '../Roles';

/**
 * Determines the HTML tag name for a DisplayObject based on its accessibility information
 * @param {AccessibleDisplayObject} displayObject - DisplayObject to determine the tag to use
 * @return {String} HTML tag name
 */
function getTagNameForDisplayObject(
  displayObject: AccessibleDisplayObject
): string {
  const role = _.get(displayObject, 'accessible.role', ROLES.NONE);
  let tagName = RoleTagMapping[role] || 'div';

  if (
    role === ROLES.MENUITEM &&
    displayObject.accessible.parent.role === ROLES.MENUITEM
  ) {
    // the DisplayObject is for a popup menu (e.g. child of a menu bar), so this DisplayObject
    // is grouping the label and menu
    tagName = 'span';
  }

  return tagName;
}

/**
 * Predicate function for checking if a role uses an HTML tag that is interactive
 * due to the semantics of the tag name.
 * Note: this only checks tags that this module can actually produce and is not
 * intended to be a generic HTML reference for interactive tags.
 *
 * @param {string} role - Entry from ROLES for which role to check
 * @returns {boolean} true if the corresponding HTML tag is semantically interactive.
 * false otherwise
 */
function doesRoleUseSemanticallyInteractiveTag(role: string): boolean {
  const tagName = RoleTagMapping[role] || 'div';
  return (
    tagName === 'a' ||
    tagName === 'select' ||
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'button'
  );
}

export { getTagNameForDisplayObject, doesRoleUseSemanticallyInteractiveTag };
