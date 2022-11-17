import _ from 'lodash';

export type DisplayObject = createjs.DisplayObject;

export type AccessibleDisplayObject = DisplayObject & {
  accessible?: AccessibilityObject;
};

type ReactProps = {
  accessKey?: string;
  dir?: string;
  id: string;
  key: number;
  lang?: string;
  onBlur: Function;
  onFocus: Function;
  onKeyDown?: Function;
  onKeyUp?: Function;
  spellCheck?: boolean;
  tabIndex?: number;
  title?: string;
};

/**
 * Container for the accessibility information for a DisplayObject.
 */
export default class AccessibilityObject {
  private _areKeyEventsEnabled: boolean;

  private _children: AccessibleDisplayObject[];

  private _controls: AccessibleDisplayObject;

  private _describedBy: AccessibleDisplayObject;

  private readonly _displayObject: DisplayObject;

  private readonly _domId: string;

  private _flowTo: AccessibleDisplayObject;

  private _labelledBy: AccessibleDisplayObject;

  private _owns: AccessibleDisplayObject[];

  private _parent: AccessibilityObject | undefined;

  protected _reactProps: ReactProps;

  private readonly _role: string;

  private _visible: boolean;

  private _markedForUpdate: boolean = false;

  text: string;

  constructor(displayObject: DisplayObject, role: string, domIdPrefix: string) {
    _.bindAll(this, '_onKeyDown', '_onKeyUp');
    this._displayObject = displayObject;
    this._children = [];
    this._role = role;
    this._domId = domIdPrefix + displayObject.id;
    this._areKeyEventsEnabled = false;

    /**
     * Fields with relatively fixed values that should go into the React props for the
     * element translation of this object.  This is done as an object for easy merging
     * with the rest of the props
     *
     * ts-ignore for dispatchEvent with 3 args
     *
     * @access package
     */
    this._reactProps = {
      key: this._displayObject.id,
      id: this.domId,
      onFocus: (evt: Event) => {
        const cancelled = this._displayObject.dispatchEvent(
          'focus',
          false,
          // @ts-ignore
          true
        );

        if (cancelled) {
          evt.stopPropagation();
          evt.preventDefault();
        }
      },
      onBlur: (evt: Event) => {
        const cancelled = this._displayObject.dispatchEvent(
          'blur',
          false,
          // @ts-ignore
          true
        );
        if (cancelled) {
          evt.stopPropagation();
          evt.preventDefault();
        }
      },
    };

    /**
     * string that describes the DisplayObject for the AT
     * @access public
     */
    this.text = undefined;
  }

  get isMarkedForUpdate() {
    return this._markedForUpdate;
  }

  // Called to mark the object for updating
  markForUpdate() {
    this._markedForUpdate = true;
    this.parent?.markForUpdate();
  }

  // Called to clear the flag when the DOM node has been updated
  markAsUpdated() {
    this._markedForUpdate = false;
  }

  /**
   * Adds the specified DisplayObject as a child of the DisplayObject associated with this
   * AccessibilityObject in the accessibility tree.  The specified DisplayObject must have
   * accessibility information already present.  Different subclasses may limit the valid roles
   * for the specified DisplayObject.
   * @access public
   * @param {AccessibleDisplayObject} displayObject - accessibility annotated DisplayObject to
   * add as a child in the accessibility tree
   */
  addChild(displayObject: AccessibleDisplayObject) {
    if (!displayObject.accessible) {
      throw new Error(
        'DisplayObjects added to the accessibility tree must have accessibility information when being added to the tree'
      );
    }

    if (displayObject.accessible.parent) {
      displayObject.accessible.parent.removeChild(displayObject);
    }
    this._children.push(displayObject);
    displayObject.accessible._parent = this;
  }

  /**
   * Adds the specified DisplayObject as a child of the DisplayObject associated with this
   * AccessibilityObject in the accessibility tree at the specified index.  The specified
   * DisplayObject must have accessibility information already present.  Different subclasses
   * may limit the valid roles for the specified DisplayObject (see addChild's function comment
   * for list of role restrictions).
   * @access public
   * @param {AccessibleDisplayObject} displayObject - accessibility annotated DisplayObject to add
   * as a child in the accessibility tree
   * @param {Number} index - 0 based index that the DisplayObject should have in the array of
   * children once added
   */
  addChildAt(displayObject: AccessibleDisplayObject, index: number) {
    if (!displayObject.accessible) {
      throw new Error(
        'DisplayObjects added to the accessibility tree must have accessibility information when being added to the tree'
      );
    }

    if (displayObject.accessible.parent) {
      displayObject.accessible.parent.removeChild(displayObject);
    }
    this._children.splice(index, 0, displayObject);
    displayObject.accessible._parent = this;
  }

  /**
   * Removes all children of this AccessibilityObject from the accessibility tree.
   * @access public
   */
  removeAllChildren(): void {
    this._children.forEach((child: AccessibleDisplayObject) => {
      child.accessible._parent = null;
    });
    this._children = [];
  }

  /**
   * Removes the specified child of this AccessibilityObject from the accessibility tree.
   * @access public
   * @param {AccessibleDisplayObject} displayObject - child DisplayObject to remove
   */
  removeChild(displayObject: AccessibleDisplayObject): void {
    const index = _.findIndex(this._children, (test) => test === displayObject);
    this.removeChildAt(index);
  }

  /**
   * Removes the child at the specified index of this AccessibilityObject
   * from the accessibility tree.
   * @access public
   * @param {Number} index - index of the child to remove
   */
  removeChildAt(index: number): void {
    if (index >= 0 && index < this._children.length) {
      this._children[index].accessible._parent = null;
      this._children.splice(index, 1);
    }
  }

  /**
   * Requests that focus be sent to the DOM entry for associated DisplayObject
   * @access public
   */
  requestFocus(): void {
    const elem = document.getElementById(this._domId);
    if (elem) {
      // handle elements that won't be visible until the next render pass
      if (
        this.visibleWithInference &&
        getComputedStyle(elem).display === 'none'
      ) {
        this._forceShow();
      }
      // handle elements that won't be enabled until the next render pass
      if (this.enabled && elem.getAttribute('disabled') !== null) {
        elem.removeAttribute('disabled');
      }
      // handle elements that won't get tabindex updated until the next render pass
      if (
        !_.isUndefined(this.tabIndex) &&
        elem.getAttribute('tabindex') === null
      ) {
        elem.setAttribute('tabindex', this.tabIndex.toString());
      }

      elem.focus();
    }
  }

  /*
   * getter for this._reactProps (only used in AccessibilityTranslator)
   * @access public
   * @returns {ReactProps}
   */
  get reactProps(): ReactProps {
    return this._reactProps;
  }

  /**
   * Sets whether keydown/keyup events should be sent to the DisplayObject.
   * The constructor default is that these events are not sent.
   * @access public
   * @param {boolean} enable - true if the keydown/keyup events should be sent to the DisplayObject.
   * false otherwise.
   */
  set enableKeyEvents(enable) {
    if (this._areKeyEventsEnabled && !enable) {
      this._reactProps.onKeyDown = undefined;
      this._reactProps.onKeyUp = undefined;
    } else if (!this._areKeyEventsEnabled && enable) {
      this._reactProps.onKeyDown = this._onKeyDown;
      this._reactProps.onKeyUp = this._onKeyUp;
    }

    this._areKeyEventsEnabled = enable;
  }

  /**
   * Retrieves whether keydown/keyup events are currently configured to be
   * sent to the DisplayObject.
   * @access public
   * @returns {boolean} true if the keydown/keyup events should be sent to the DisplayObject.
   * false otherwise.
   */
  get enableKeyEvents(): boolean {
    return this._areKeyEventsEnabled;
  }

  /**
   * Sets the keyboard shortcut to click the DisplayObject
   * @access public
   * @param {string} keycode - string containing the letter to use for the keyboard shortcut
   */
  set accessKey(keycode: string) {
    this._reactProps.accessKey = keycode;
  }

  /**
   * Retrieves the keyboard shortcut to click the DisplayObject
   * @access public
   * @returns {string} string containing the letter to use for the keyboard shortcut
   */
  get accessKey(): string {
    return this._reactProps.accessKey;
  }

  /**
   * The spellcheck attribute specifies whether the element is to have its spelling
   * and grammar checked or not.
   * @access public
   * @param { boolean } bool
   */
  set spellcheck(bool: boolean) {
    this._reactProps.spellCheck = bool;
  }

  /**
   * The spellcheck attribute specifies whether the element is to have its spelling and
   * grammar checked or not.
   * @access public
   * @returns {boolean} boolean: true or false
   */
  get spellcheck(): boolean {
    return this._reactProps.spellCheck;
  }

  /**
   * Sets the title for the DisplayObject
   * @access public
   * @param {string} title - string mouse hover show text of title as tooltip
   */
  set title(title: string) {
    this._reactProps.title = title;
  }

  /**
   * Retrieves the title for the DisplayObject
   * @access public
   * @returns {string} string mouse hover show text of title as tooltip
   */
  get title(): string {
    return this._reactProps.title;
  }

  /**
   * The lang attribute specifies the language of the element's content.
   * @access public
   * @returns {string} lang: eg. "en" for English, "es" for Spanish, "fr" for French, and so on.
   * https://www.w3schools.com/tags/ref_language_codes.asp has the full list of valid values.
   */
  get lang(): string {
    return this._reactProps.lang;
  }

  /**
   * The lang attribute specifies the language of the element's content.
   * @access public
   * @param {string} lang: eg. "en" for English, "es" for Spanish, "fr" for French, and so on.
   * https://www.w3schools.com/tags/ref_language_codes.asp has the full list of valid values.
   */
  set lang(lang: string) {
    this._reactProps.lang = lang;
  }

  /**
   * The dir attribute specifies the text direction of the element's content.
   * @access public
   * @param {string} direction
   * ltr: Left-to-right text direction, rtl: Right-to-left text direction
   * auto: Let the browser figure out the text direction, based on the content
   */
  set dir(direction: string) {
    this._reactProps.dir = direction;
  }

  /**
   * The dir attribute specifies the text direction of the element's content.
   * @access public
   * @returns {string} direction
   * ltr: Left-to-right text direction, rtl: Right-to-left text direction, auto: Let the browser
   * figure out the text direction, based on the content
   */
  get dir(): string {
    return this._reactProps.dir;
  }

  /**
   * Sets whether ATs should present the region as a whole or parts
   * @access public
   * @param {boolean} enable - true if ATs should present the region as a whole,
   * false for parts.  undefined to unset the field.
   */
  set atomic(enable: boolean) {
    this._reactProps['aria-atomic'] = enable;
  }

  /**
   * Retrieves whether ATs should present the region as a whole or parts
   * @access public
   * @returns {boolean} true if ATs should present the region as a whole, false
   * for parts, undefined if the field is unset.
   */
  get atomic(): boolean {
    return this._reactProps['aria-atomic'];
  }

  /**
   * Sets whether the element or its children in the accessibility tree are currently being updated
   * @access public
   * @param {boolean} updating - true if updating is in progress, false if there
   * are no more expected updates, undefined to unset the field.
   */
  set busy(updating: boolean) {
    this._reactProps['aria-busy'] = updating;
  }

  /**
   * Retrieves whether the element or its children in the accessibility tree are
   * currently being updated
   * @access public
   * @returns {boolean} true if updating is in progress, false if there are no more
   * expected updates, undefined if the field is unset.
   */
  get busy(): boolean {
    return this._reactProps['aria-busy'];
  }

  /**
   * Retrieves the array of DisplayObjects that are children of this one in the accessibility tree
   * @access public
   * @return {Array<AccessibleDisplayObject>} array of child DisplayObjects
   */
  get children(): AccessibleDisplayObject[] {
    return this._children;
  }

  /**
   * Sets which DisplayObject's contents or presence is controlled by this one.
   * @access public
   * @param {AccessibleDisplayObject} displayObject - DisplayObject controlled by this one.
   * undefined to unset the field.
   */
  set controls(displayObject: AccessibleDisplayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error(
        'DisplayObject being controlled by another must have accessibility information'
      );
    }
    this._controls = displayObject;
    this._reactProps['aria-controls'] = displayObject
      ? displayObject.accessible.domId
      : undefined;
  }

  /**
   * Retrieves which DisplayObject has their content or presence controlled by this one.
   * @access public
   * @returns {AccessibleDisplayObject} DisplayObject controlled by this one
   */
  get controls(): AccessibleDisplayObject {
    return this._controls;
  }

  /**
   * Retrieves the DOM id for the tranlated DisplayObject controlled by this one.
   * @access public
   * @returns {string} id for the translated controlled DisplayObject
   */
  get controlsId(): string {
    return this._reactProps['aria-controls'];
  }

  /**
   * Sets which DisplayObject's accessibility information describes this one.
   * @access public
   * @param {AccessibleDisplayObject} displayObject - describing DisplayObject.
   * undefined to unset the field.
   */
  set describedBy(displayObject: AccessibleDisplayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error(
        'DisplayObject describing another must have accessibility information'
      );
    }
    this._describedBy = displayObject;
    this._reactProps['aria-describedby'] = displayObject
      ? displayObject.accessible.domId
      : undefined;
  }

  /**
   * Retrieves which DisplayObject has accessibility information describing this one.
   * @access public
   * @returns {AccessibleDisplayObject} describing DisplayObject
   */
  get describedBy(): AccessibleDisplayObject {
    return this._describedBy;
  }

  /**
   * Retrieves the DOM id of the translated DisplayObject that has accessibility information
   * describing this one.
   * @access public
   * @returns {string} id of the translated describing DisplayObject
   */
  get describedById(): string {
    return this._reactProps['aria-describedby'];
  }

  /**
   * Retrieves the DisplayObject that this AccessibilityObject instance provides
   * accessibility annotation for.
   * @access public
   * @returns {AccessibleDisplayObject} DisplayObject that this AccessibilityObject annotates
   */
  get displayObject(): AccessibleDisplayObject {
    return this._displayObject;
  }

  /**
   * Retrieves the value of the id attribute used in the DOM for the DisplayObject's accessibility
   * information
   * @access public
   * @returns {string} id of the DOM element
   */
  get domId(): string {
    return this._domId;
  }

  /**
   * Sets which drop effects can be performed when dropping a draggable object onto this one.  See https://www.w3.org/TR/wai-aria/states_and_properties#aria-dropeffect for valid values
   * @access public
   * @param {string} effects - Space separate list of drop effects.  undefined to unset this field.
   */
  set dropEffects(effects: string) {
    this._reactProps['aria-dropeffect'] = effects;
  }

  /**
   * Retrieves which drop effects can be performed when dropping a draggable object onto this one.
   * @access public
   * @returns {string} Space separate list of drop effects.  undefined if this field is unset.
   */
  get dropEffects(): string {
    return this._reactProps['aria-dropeffect'];
  }

  /**
   * Sets whether the element is enabled
   * @access public
   * @param {boolean} enable - true if the element should be enabled, false
   * if the element should be disabled.  undefined to unset the field.
   */
  set enabled(enable: boolean) {
    this._reactProps['aria-disabled'] =
      enable === undefined ? undefined : !enable;
  }

  /**
   * Retrieves whether the element is enabled
   * @access public
   * @returns {boolean} true if the element is enabled, false if the element
   * is disabled.  undefined if the field is unset.
   */
  get enabled(): boolean {
    return this._reactProps['aria-disabled'] === undefined
      ? undefined
      : !this._reactProps['aria-disabled'];
  }

  /**
   * Retrieves whether the DisplayObject is disabled for interaction,
   * taking into account the automatic field determination done when translating to the DOM.
   * @access public
   * @returns {boolean} true if disabled, false otherwise
   */
  get disabledWithInference(): boolean {
    return this._reactProps['aria-disabled'] !== undefined
      ? this._reactProps['aria-disabled']
      : !this._displayObject.mouseEnabled &&
          (this._displayObject.hasEventListener('click') ||
            this._displayObject.hasEventListener('mousedown') ||
            this._displayObject.hasEventListener('pressup'));
  }

  /**
   * Sets which DisplayObject is next in an alternative reading order
   * @access public
   * @param {AccessibleDisplayObject} displayObject - DisplayObject to flow to.
   * undefined to unset the field.
   */
  set flowTo(displayObject: AccessibleDisplayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error(
        'DisplayObject to flow to must have accessibility information'
      );
    }
    this._flowTo = displayObject;
    this._reactProps['aria-flowto'] = displayObject
      ? displayObject.accessible.domId
      : undefined;
  }

  /**
   * Retrieves the DisplayObject that is next in the alternative reading order
   * @access public
   * @returns {AccessibleDisplayObject} DisplayObject to flow to
   */
  get flowTo(): AccessibleDisplayObject {
    return this._flowTo;
  }

  /**
   * Retrieves the DOM id of the translated DisplayObject that is next in an
   * alternative reading order
   * @access public
   * @returns {string} id to flow to
   */
  get flowToId(): string {
    return this._reactProps['aria-flowto'];
  }

  /**
   * Sets whether the DisplayObject is picked up for a drag and drop interaction
   * @access public
   * @param {boolean} dragging - true if being dragged, false for not being dragged but
   * supports it, undefined for not being dragged and doesn't support it
   */
  set grabbed(dragging: boolean) {
    this._reactProps['aria-grabbed'] = dragging;
  }

  /**
   * Retrieves whether the DisplayObject is picked up for a drag and drop interaction
   * @access public
   * @returns {boolean} true if being dragged, false for not being dragged but supports it,
   * undefined for not being dragged and doesn't support it
   */
  get grabbed(): boolean {
    return this._reactProps['aria-grabbed'];
  }

  /**
   * Sets whether additional content will be displayed by interacting with the DisplayObject
   * @access public
   * @param {string | boolean} popup - see https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup for valid values.  undefined to unset the field.
   */
  set hasPopUp(popup: string | boolean) {
    this._reactProps['aria-haspopup'] = popup;
  }

  /**
   * Retrieves whether additional content will be displayed by interacting with the DisplayObject
   * @access public
   * @returns {string | boolean} see https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup for valid values.  undefined if this field is unset.
   */
  get hasPopUp(): string | boolean {
    return this._reactProps['aria-haspopup'];
  }

  /**
   * Sets whether the DisplayObject is perceivable to any type of user.
   * Note: if this field is unset (undefined) and the DisplayObject's .visible
   * field a falsey value, then the translated DOM entry will have 'aria-hidden'
   * set to true.  If you want to prevent this automatic field determination,
   * then this field should be set to true or false.
   * @access public
   * @param {boolean} hide - true if not perceivable, false for perceivable.
   * undefined to unset the field.
   */
  set hidden(hide: boolean) {
    this._reactProps['aria-hidden'] = hide;
  }

  /**
   * Retrieves whether the DisplayObject is perceivable to any type of user.
   * @access public
   * @returns {boolean} true if not perceivable, false for perceivable.
   * undefined if this field is unset.
   */
  get hidden(): boolean {
    return this._reactProps['aria-hidden'];
  }

  /**
   * Retrieves whether the DisplayObject is perceivable to any type of user,
   * taking into account the automatic field determination done when translating to the DOM.
   * @access public
   * @returns {boolean} true if not perceivable, false for perceivable
   */
  get hiddenWithInference(): boolean {
    return (
      this._reactProps['aria-hidden'] ||
      (!this._displayObject.visible &&
        this._reactProps['aria-hidden'] === undefined)
    );
  }

  /**
   * Sets if/how the entered value is considered invalid
   * @access public
   * @param {string} reason - A string from https://www.w3.org/TR/wai-aria/states_and_properties#aria-invalid for why the entered value is considered invalid.  undefined to unset the field.
   */
  set invalid(reason: string) {
    this._reactProps['aria-invalid'] = reason;
  }

  /**
   * Retrieves if/how the entered value is considered invalid
   * @access public
   * @returns {string} A string from https://www.w3.org/TR/wai-aria/states_and_properties#aria-invalid for why the entered value is considered invalid.  undefined if this field is unset.
   */
  get invalid(): string {
    return this._reactProps['aria-invalid'];
  }

  /**
   * Sets the string to use as a label
   * @access public
   * @param {string} str - string to use as a label.  undefined if the field is to be cleared
   */
  set label(str: string) {
    this._reactProps['aria-label'] = str;
  }

  /**
   * Retrieves the string that is used for label
   * @access public
   * @returns {string} the string label.  undefined if this field is unset.
   */
  get label(): string {
    return this._reactProps['aria-label'];
  }

  /**
   * Sets which other DisplayObject labels the DisplayObject
   * @access public
   * @param {AccessibleDisplayObject} displayObject - DisplayObject that labels this one.
   * undefined if the field is to be cleared
   */
  set labelledBy(displayObject: AccessibleDisplayObject) {
    if (displayObject && !displayObject.accessible) {
      throw new Error(
        'DisplayObjects used to label another DisplayObject must have accessibility information when being provided as a label'
      );
    }
    if (displayObject === this._displayObject) {
      throw new Error('An object cannot be used as its own labelledBy');
    }
    this._labelledBy = displayObject;
    this._reactProps['aria-labelledby'] = displayObject
      ? displayObject.accessible.domId
      : undefined;
  }

  /**
   * Retrieves the DisplayObject that is used for labelling this one
   * @access public
   * @returns {AccessibleDisplayObject} DisplayObject that is used for a label.
   * undefined if this field is unset.
   */
  get labelledBy(): AccessibleDisplayObject {
    return this._labelledBy;
  }

  /**
   * Retrieves the DOM id of the translated DisplayObject that is used for labelling this one
   * @access public
   * @returns {string} id of the label.  undefined if this field is unset.
   */
  get labelledById(): string {
    return this._reactProps['aria-labelledby'];
  }

  /**
   * Sets the priority level of the user being informed of updates to the translated
   * DOM element or its children
   * @access public
   * @param {string} level - See https://www.w3.org/TR/wai-aria/states_and_properties#aria-live for values and their meaning.  undefined if the field is to be cleared
   */
  set live(level: string) {
    this._reactProps['aria-live'] = level;
  }

  /**
   * Retrieves the priority level of the user being informed of updates to the translated
   * DOM element or its children
   * @access public
   * @returns {string} priority level.  undefined if this field is unset.
   */
  get live(): string {
    return this._reactProps['aria-live'];
  }

  /**
   * Sets which DisplayObjects that are not children in the accessibility tree but have
   *  a child relationship with this one
   * @access public
   * @param {Array<AccessibleDisplayObject>} displayObjects - array of AccessibleDisplayObject that
   * should have a child relationship without being children in the accessibility tree.
   * undefined if the field is to be cleared
   */
  set owns(displayObjects: AccessibleDisplayObject[]) {
    if (displayObjects) {
      let ids = '';
      displayObjects.forEach((displayObject) => {
        if (!displayObject.accessible) {
          throw new Error(
            'DisplayObjects owned by another DisplayObject must have accessibility information'
          );
        } else {
          ids = `${ids} ${displayObject.accessible.domId}`;
        }
      });
      this._reactProps['aria-owns'] = ids;
      this._owns = displayObjects;
    } else {
      this._reactProps['aria-owns'] = undefined;
      this._owns = undefined;
    }
  }

  /**
   * Retrieves which DisplayObjects that are not children in the accessibility tree but
   * have a child relationship with this one
   * @access public
   * @returns {Array<AccessibleDisplayObject>} array of DisplayObjects that should have
   * a child relationship without being children in the accessibility tree.
   * undefined if this field is unset.
   */
  get owns(): AccessibleDisplayObject[] {
    return this._owns;
  }

  /**
   * Retrieves a space separated list of the DOM ids of the translated DisplayObjects
   * that are not children in the accessibility tree that have a child relationship with this one
   * @access public
   * @returns {string} space separate list of DOM ids.  undefined if this field is unset.
   */
  get ownsIds(): string {
    return this._reactProps['aria-owns'];
  }

  /**
   * Retrieves the AccessibilityObject that is this one's parent in an accessibility tree.
   * null if this is currently not in an accessibility tree.
   * @access public
   * @return {AccessibilityObject} Parent AccessibilityObject in an accessibility tree
   */
  get parent(): AccessibilityObject {
    return this._parent;
  }

  /**
   * Sets which notifications should be sent for live regions
   * @access public
   * @param {string} str - space separated list of values from https://www.w3.org/TR/wai-aria/states_and_properties#aria-relevant.  undefined if the field is to be cleared
   */
  set relevant(str: string) {
    this._reactProps['aria-relevant'] = str;
  }

  /**
   * Retrieves a space separated list of notifications for live regions.
   * @access public
   * @returns {String} space separated list of values.  undefined if this field is unset.
   */
  get relevant() {
    return this._reactProps['aria-relevant'];
  }

  /**
   * Retrieves the entry in the ROLES enum for which ARIA role is used
   * @access public
   * @returns {string} string describing the DisplayObject to the AT
   */
  get role(): string {
    return this._role;
  }

  /**
   * Sets the tab index for the DisplayObject
   * @access public
   * @param {number} index - number to use as the tab index
   */
  set tabIndex(index: number) {
    this._reactProps.tabIndex = index;
  }

  /**
   * Retrieves the tab index for the DisplayObject
   * @access public
   * @returns {Number} number used as the tab index
   */
  get tabIndex(): number {
    return this._reactProps.tabIndex;
  }

  /**
   * Sets whether the DisplayObject should be displayed in the DOM translation.
   * Note: if this field is unset (undefined) and the DisplayObject's .visible field
   * a falsey value, then the translated DOM entry will have 'display' set to 'none'.
   * If you want to prevent this automatic field determination, then this field should
   * be set to true or false.
   * @access public
   * @param {boolean} vis - true if DOM translation should be displayed, false for hidden.
   * undefined to unset the field.
   */
  set visible(vis: boolean) {
    this._visible = vis;
  }

  /**
   * Retrieves whether the DisplayObject should be displayed in the DOM translation.
   * @access public
   * @returns {boolean} true if visible, false for hidden.  undefined if this field is unset.
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Retrieves whether the DisplayObject is displayed in the DOM translation, taking into
   * account the automatic field determination done when translating to the DOM.
   * @access public
   * @returns {boolean} true if not visible, false if hidden
   */
  get visibleWithInference(): boolean {
    return this.visible === undefined
      ? this._displayObject.visible
      : this.visible === true;
  }

  /**
   * Makes the DOM entry visible immediately.  This does not affect the value used
   * during the next render of the accessibility tree.
   * @access package
   */
  _forceShow(): void {
    document.getElementById(this._domId).style.display = '';
  }

  /**
   * Finds the index into this.children for the specified DOM id
   * @access package
   * @param {String} id - DOM id of the element to find
   * @returns {Number} index into this.children.  -1 if no match is found
   */
  _domIdToChildIndex(id: String): Number {
    return _.findIndex(
      this._children,
      (displayObject) => id === displayObject.accessible._domId
    );
  }

  /**
   * Event listener for keydown events
   * @access protected
   * @param {KeyboardEvent} evt - React kayboard event
   */
  _onKeyDown(evt: KeyboardEvent): void {
    const event = new createjs.Event('keydown', false, evt.cancelable);

    // @ts-ignore
    event.key = evt.key;
    // @ts-ignore
    event.keyCode = evt.keyCode;

    Object.defineProperty(event, 'keyCode', {
      get() {
        // eslint-disable-next-line no-console
        console.warn(
          '"keyCode" Property is being deprecated, and will be removed in future major version of the createjs-accessibility module. Please use "key" property instead.'
        );
        return evt.keyCode;
      },
    });
    this._displayObject.dispatchEvent(event);
    if (event.propagationStopped) {
      evt.stopPropagation();
    }
    if (event.defaultPrevented) {
      evt.preventDefault();
    }
  }

  /**
   * Event listener for keyup events
   * @access protected
   * @param {KeyboardEvent} evt - React kayboard event
   */
  _onKeyUp(evt: KeyboardEvent): void {
    const event = new createjs.Event('keyup', false, evt.cancelable);

    // @ts-ignore
    event.key = evt.key;
    // @ts-ignore
    event.keyCode = evt.keyCode;

    Object.defineProperty(event, 'keyCode', {
      get() {
        // eslint-disable-next-line no-console
        console.warn(
          '"keyCode" Property is being deprecated, and will be removed in future major version of the createjs-accessibility module. Please use "key" property instead.'
        );
        return evt.keyCode;
      },
    });
    this._displayObject.dispatchEvent(event);
    if (event.propagationStopped) {
      evt.stopPropagation();
    }
    if (event.defaultPrevented) {
      evt.preventDefault();
    }
  }
}
