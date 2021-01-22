import SectionData from './SectionData';
import { ROLES } from '../Roles';

/**
 * Class for role objects that use the ul HTML tag.
 */
export default class UnorderedListData extends SectionData {
  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.LISTITEM) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.LISTITEM}`);
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.LISTITEM) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.LISTITEM}`);
    }
    super.addChildAt(displayObject, index);
  }
}
