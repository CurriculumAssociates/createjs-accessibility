import SelectData from './SelectData';
import { ROLES } from '../Roles';

export default class TreeData extends SelectData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    this._reactProps['aria-orientation'] = 'vertical';
  }

  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (
      !displayObject.accessible
      || displayObject.accessible.role !== ROLES.TREEITEM
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.TREEITEM}`
      );
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (
      !displayObject.accessible
      || displayObject.accessible.role !== ROLES.TREEITEM
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.TREEITEM}`
      );
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * @access public
   * @param {boolean} value - true if more than 1 element can be selected at a time,
   * false for only 1 at a time, undefined to unset this field
   */
  set multiselectable(value) {
    this._reactProps['aria-multiselectable'] = value;
  }

  /**
   * @access public
   * @returns {boolean} true if more than 1 element can be selected at a time,
   * false for only 1 at a time, undefined if this field is unset
   */
  get multiselectable() {
    return this._reactProps['aria-multiselectable'];
  }

  /**
   * Sets whether user input is required or not
   * @access public
   * @param {boolean} value - true if the element is required, false otherwise,
   * undefined to unset this field
   */
  set required(value) {
    this._reactProps['aria-required'] = value;
  }

  /**
   * Retrieves whether user input is required or not
   * @access public
   * @returns {boolean} true if the element is required, false otherwise,
   * undefined if this field is unset
   */
  get required() {
    return this._reactProps['aria-required'];
  }
}
