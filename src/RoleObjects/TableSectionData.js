import AccessibilityObject from './AccessibilityObject';
import { ROLES } from '../Roles';

export default class TableSectionData extends AccessibilityObject {
  addChild(displayObject) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.ROW) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.ROW}`);
    }
    super.addChild(displayObject);
  }

  addChildAt(displayObject, index) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.ROW) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.ROW}`);
    }
    super.addChildAt(displayObject, index);
  }
}
