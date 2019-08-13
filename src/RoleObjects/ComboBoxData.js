import { ROLES } from '../Roles';
import SelectData from './SelectData';

export default class ComboBoxData extends SelectData {
  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (!displayObject.accessible
      || (displayObject.accessible.role !== ROLES.SINGLELINETEXTBOX
          && displayObject.accessible.role !== ROLES.SEARCH
          && displayObject.accessible.role !== ROLES.BUTTON
          && displayObject.accessible.role !== ROLES.SINGLESELECTLISTBOX
          && displayObject.accessible.role !== ROLES.TREE
          && displayObject.accessible.role !== ROLES.GRID
          && displayObject.accessible.role !== ROLES.DIALOG
      )
    ) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.SINGLELINETEXTBOX}, ${ROLES.SEARCH}, ${ROLES.BUTTON}, ${ROLES.SINGLESELECTLISTBOX}, ${ROLES.TREE}, ${ROLES.GRID}, or ${ROLES.DIALOG}`);
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (!displayObject.accessible
      || (displayObject.accessible.role !== ROLES.SINGLELINETEXTBOX
          && displayObject.accessible.role !== ROLES.SEARCH
          && displayObject.accessible.role !== ROLES.BUTTON
          && displayObject.accessible.role !== ROLES.SINGLESELECTLISTBOX
          && displayObject.accessible.role !== ROLES.TREE
          && displayObject.accessible.role !== ROLES.GRID
          && displayObject.accessible.role !== ROLES.DIALOG
      )
    ) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.SINGLELINETEXTBOX}, ${ROLES.SEARCH}, ${ROLES.BUTTON}, ${ROLES.SINGLESELECTLISTBOX}, ${ROLES.TREE}, ${ROLES.GRID}, or ${ROLES.DIALOG}`);
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Sets whether the combobox should have autocomplete enabled or not
   * @access public
   * @param {boolean} enable - true if autocomplete should be enabled, false otherwise
   */
  set autocomplete(enable) {
    this._reactProps.autocomplete = enable ? 'on' : 'off';
  }

  /**
   * Retrieves whether autocomplete is enabled or not for the combobox
   * @access public
   * @returns {boolean} true if autocomplete is enabled, false otherwise
   */
  get autocomplete() {
    return this._reactProps.autocomplete === 'on';
  }

  /**
   * Sets whether the combobox is expanded or not
   * @access public
   * @param {boolean} val - true if combobox expanded, false if combobox not expanded, undefined if
   * the field is unset
   */
  set expanded(val) {
    this._reactProps['aria-expanded'] = val;
  }

  /**
   * Retrieves whether combobox expanded
   * @access public
   * @returns {boolean} true if combobox expanded, false if combobox not expanded, undefined if the
   * field is unset
   */
  get expanded() {
    return this._reactProps['aria-expanded'];
  }

  /**
   * Sets whether the combobox is editable or not
   * @access public
   * @param {boolean} value - true if the element should be read only, false for read and editable
   */
  set readOnly(value) {
    this._reactProps['aria-readonly'] = value;
  }

  /**
   * Retrieves whether the combobox is editable or not
   * @access public
   * @returns {boolean} true if the element should be read only, false for read and editable
   */
  get readOnly() {
    return this._reactProps['aria-readonly'];
  }

  /**
   * Sets whether user input is required or not
   * @access public
   * @param {boolean} value - true if the element is required, false otherwise
   */
  set required(value) {
    this._reactProps['aria-required'] = value;
  }

  /**
   * Retrieves whether user input is required or not
   * @access public
   * @returns {boolean} true if the element is required, false otherwise
   */
  get required() {
    return this._reactProps['aria-required'];
  }
}
