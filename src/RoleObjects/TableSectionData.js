import AccessibilityObject from './AccessibilityObject';
import { ROLES } from '../Roles';

export default class TableSectionData extends AccessibilityObject {
  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.ROW) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.ROW}`);
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.ROW) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.ROW}`);
    }
    super.addChildAt(displayObject, index);
  }
}
