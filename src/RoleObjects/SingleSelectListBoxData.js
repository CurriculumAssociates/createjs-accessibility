import _ from 'lodash';
import KeyCodes from 'keycodes-enum';
import { ROLES } from '../Roles';
import SelectData from './SelectData';

export default class SingleSelectListBoxData extends SelectData {
  constructor(displayObject, role, domIdPrefix) {
    super(displayObject, role, domIdPrefix);
    _.bindAll(this, '_onKeyDown');
    this._reactProps.onKeyDown = this._onKeyDown;
  }

  /**
   * @inheritdoc
   */
  set enableKeyEvents(enable) {
    super.enableKeyEvents = enable;
    // the keydown listener is needed for this role to function per WAI-ARIA practices
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
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.SINGLESELECTOPTION) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.SINGLESELECTOPTION}`);
    }
    super.addChild(displayObject);
  }

  /**
   * @inheritdoc
   */
  addChildAt(displayObject, index) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.SINGLESELECTOPTION) {
      throw new Error(`Children of ${this.role} must have a role of ${ROLES.SINGLESELECTOPTION}`);
    }
    super.addChildAt(displayObject, index);
  }

  /**
   * Sets whether the element should get focus on page load
   * @access public
   * @param {boolean} enable - true if autofocus should be enabled, false otherwise
   */
  set autofocus(enable) {
    this._reactProps.autofocus = enable ? 'autofocus' : undefined;
  }

  /**
   * Retrieves whether autofocus is enabled
   * @access public
   * @returns {boolean} true if autofocus is enabled, false otherwise
   */
  get autofocus() {
    return this._reactProps.autofocus === 'autofocus';
  }

  /**
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled,
     false if the element should be disabled.  undefined to unset the field.
   */
  set enabled(enable) {
    this._reactProps.disabled = enable !== false ? undefined : 'disabled';
    super.enabled = enable;
  }

  /**
   * Retrieves whether the element is enabled
   * @access public
   * @returns {boolean} true if the element is enabled, false if the element is disabled.
     undefined if the field is unset.
   */
  get enabled() {
    return super.enabled;
  }

  /**
   * Sets which form the element belongs to
   * @access public
   * @param {createjs.DisplayObject} displayObject - DisplayObject that represents the form.
    null or undefined to clear it
   */
  set form(displayObject) {
    if (displayObject && (!displayObject.accessible
      || displayObject.accessible.role !== ROLES.FORM)) {
      throw new Error(`The form property of a ${this.role} must be a DisplayObject with a role of ${ROLES.FORM}`);
    }
    this._form = displayObject;
    this._reactProps.form = displayObject ? displayObject.accessible.domId : undefined;
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
   * @param {createjs.DisplayObject} displayObject - selected option
   */
  set selected(displayObject) {
    if (!displayObject.accessible || displayObject.accessible.role !== ROLES.SINGLESELECTOPTION) {
      throw new Error(`Selected value must have a role of ${ROLES.SINGLESELECTOPTION}`);
    }
    if (!displayObject.accessible.value) {
      throw new Error('The selected option must have its value field populated');
    }

    this._selected = displayObject;
    this._reactProps.value = displayObject.accessible.value;
  }

  /**
   * Retrieves which DisplayObject is currently selected
   * @access public
   * @returns {createjs.DisplayObject} selected option
   */
  get selected() {
    return this._selected;
  }

  /**
   * Retieves the string value of the selected option
   * @access public
   * @returns {String} selected option's value
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
   * React event handler for key presses
   * @access private
   * @param {SyntheticEvent} evt - React event
   */
  _onKeyDown(evt) {
    if (this.enableKeyEvents) {
      super._onKeyDown(evt);
    }

    if (evt.keyCode === KeyCodes.down) {
      const index = this._getSelectionIndex() + 1;
      if (index < this.children.length) {
        this.selected = this.children[index];
        this._onListBoxChanged();
      }
      evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.keyCode === KeyCodes.up) {
      const index = this._getSelectionIndex() - 1;
      if (index >= 0) {
        this.selected = this.children[index];
        this._onListBoxChanged();
      }
      evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.keyCode === KeyCodes.home) {
      const selectedChild = this.children[0];
      this.selected = selectedChild;
      this._onListBoxChanged();
      evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.keyCode === KeyCodes.end) {
      this.selected = this.children[this.children.length - 1];
      this._onListBoxChanged();
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

  _getSelectionIndex() {
    return _.findIndex(this.children, child => child === this.selected);
  }

  _onListBoxChanged() {
    this.active = this.selected;
    const event = new createjs.Event('valueChanged', false, false);
    event.selectedValue = this.selectedValue;
    event.selectedDisplayObject = this.selected;
    this._displayObject.dispatchEvent(event);
  }
}
