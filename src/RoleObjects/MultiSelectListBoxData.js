import _ from 'lodash';
import { ROLES } from '../Roles';
import SelectData from './SelectData';

export default class MultiSelectListBoxData extends SelectData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onListBoxChanged');
    this._reactProps.onChange = this._onListBoxChanged;
    this._reactProps.multiple = 'multiple';
  }

  /**
   * @inheritdoc
   */
  addChild(displayObject) {
    if (
      !displayObject.accessible ||
      displayObject.accessible.role !== ROLES.MULTISELECTOPTION
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.MULTISELECTOPTION}`
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
      displayObject.accessible.role !== ROLES.MULTISELECTOPTION
    ) {
      throw new Error(
        `Children of ${this.role} must have a role of ${ROLES.MULTISELECTOPTION}`
      );
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Sets whether the element should get focus on page load
   * @access public
   * @param {boolean} enable - true if autofocus should be enabled, false otherwise
   */
  set autoFocus(enable) {
    this._reactProps.autoFocus = enable ? 'autofocus' : undefined;
  }

  /**
   * Retrieves whether autofocus is enabled
   * @access public
   * @returns {boolean} true if autofocus is enabled, false otherwise
   */
  get autoFocus() {
    return this._reactProps.autoFocus === 'autofocus';
  }

  /**
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled,
   * false if the element should be disabled.  undefined to unset the field.
   */
  set enabled(enable) {
    this._reactProps.disabled = enable !== false ? undefined : 'disabled';
    super.enabled = enable;
  }

  /**
   * Retrieves whether the element is enabled
   * @access public
   * @returns {boolean} true if the element is enabled,
   * false if the element is disabled.  undefined if the field is unset.
   */
  get enabled() {
    return super.enabled;
  }

  /**
   * Sets which form the element belongs to
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject that represents the form.
   * null or undefined to clear it
   */
  set form(displayObject) {
    if (
      displayObject &&
      (!displayObject.accessible ||
        displayObject.accessible.role !== ROLES.FORM)
    ) {
      throw new Error(
        `The form property of a ${this.role} must be a DisplayObject with a role of ${ROLES.FORM}`
      );
    }
    this._form = displayObject;
    this._reactProps.form = displayObject
      ? displayObject.accessible.domId
      : undefined;
  }

  /**
   * Retrieves which form the element belongs to
   * @access public
   * @returns {createjs.DisplayObject} DisplayObject that represents the form
   */
  get form() {
    return this._form;
  }

  /**
   * Retrieves the DOM id of which form the element belongs to
   * @access public
   * @returns {String} DOM id of which form the textarea belongs to
   */
  get formDomId() {
    return this._reactProps.form;
  }

  /**
   * Sets the name of the element
   * @access public
   * @param {String} str - name of the field
   */
  set name(str) {
    this._reactProps.name = str;
  }

  /**
   * Retrieves the name of the element
   * @access public
   * @returns {String} name of the field
   */
  get name() {
    return this._reactProps.name;
  }

  /**
   * Sets whether the element needs a value before a form is submitted
   * @access public
   * @param {boolean} enable - true if the element is required, false otherwise
   */
  set required(enable) {
    this._reactProps.required = enable;
  }

  /**
   * Retrieves whether the element needs a value before a form is submitted
   * @access public
   * @returns {boolean} true if the element is required, false otherwise
   */
  get required() {
    return this._reactProps.required;
  }

  /**
   * Sets which options are selected
   * @access public
   * @param {Array<createjs.DisplayObject>} displayObjects - selected options
   */
  set selected(displayObjects) {
    displayObjects.forEach((displayObject) => {
      if (
        !displayObject.accessible ||
        displayObject.accessible.role !== ROLES.MULTISELECTOPTION
      ) {
        throw new Error(
          `Selected value must have a role of ${ROLES.MULTISELECTOPTION}`
        );
      }
      if (!displayObject.accessible.value) {
        throw new Error(
          'The selected option must have its value field populated'
        );
      }
    });

    this._selected = displayObjects;
    this._reactProps.value = _.map(
      this._selected,
      (option) => option.accessible.value
    );
  }

  /**
   * Retrieves which DisplayObjects are currently selected
   * @access public
   * @returns {Array<createjs.DisplayObject>} selected options
   */
  get selected() {
    return this._selected;
  }

  /**
   * Retieves the string values of the selected options
   * @access public
   * @returns {Array<String>} selected options' values
   */
  get selectedValue() {
    return this._reactProps.value;
  }

  /**
   * Sets the number of visible options in the dropdown
   * @access public
   * @param {Number} num - number of visible options in the dropdown
   */
  set size(num) {
    this._reactProps.size = num;
  }

  /**
   * Retrieves the number of visible options in the dropdown
   * @access public
   * @returns {Number} number of visible options in the dropdown
   */
  get size() {
    return this._reactProps.size;
  }

  /**
   * React event handler for when the value of the tag changes
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onListBoxChanged(evt) {
    const event = new createjs.Event('valueChanged', false, false);
    event.selectedValues = _.filter(
      evt.target.options,
      (option) => option.selected
    ).map((option) => option.value);
    event.selectedDisplayObjects = _.map(event.selectedValues, (val) =>
      _.find(this.children, (child) => child.accessible.value === val)
    );
    this.selected = event.selectedDisplayObjects;
    this._displayObject.dispatchEvent(event);
  }
}
