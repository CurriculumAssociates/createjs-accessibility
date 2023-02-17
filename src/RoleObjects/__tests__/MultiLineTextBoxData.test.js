import * as createjs from 'createjs-module';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('MultiLineTextBoxData', () => {
  describe('register role', () => {
    let cjsTextarea;
    let textareaEl;
    let shouldAutoFocus;
    let colsVal;
    let isEnabled;
    let isReadOnly;
    let isRequired;
    let isSoftWrap;
    let maxLengthVal;
    let nameVal;
    let placeholderVal;
    let rowsVal;

    beforeEach(() => {
      cjsTextarea = new createjs.Shape(); // dummy object
      shouldAutoFocus = true;
      colsVal = 5;
      isEnabled = false;
      isReadOnly = true;
      isRequired = true;
      isSoftWrap = false;
      maxLengthVal = 99;
      nameVal = 'an_input';
      placeholderVal = 'placeholder';
      rowsVal = 10;

      AccessibilityModule.register({
        accessibleOptions: {
          autoFocus: shouldAutoFocus,
          cols: colsVal,
          enabled: isEnabled,
          maxLength: maxLengthVal,
          name: nameVal,
          placeholder: placeholderVal,
          readOnly: isReadOnly,
          required: isRequired,
          rows: rowsVal,
          wrap: isSoftWrap,
        },
        displayObject: cjsTextarea,
        parent: container,
        role: AccessibilityModule.ROLES.MULTILINETEXTBOX, // can't create InputTagData directly
      });

      stage.accessibilityTranslator.update();
      textareaEl = parentEl.querySelector('textarea[aria-multiline=true]');
    });

    describe('rendering', () => {
      it('creates textarea[aria-multiline=true] element', () => {
        expect(textareaEl).not.toBeNull();
      });

      it('sets "aria-disabled" attribute', () => {
        textareaEl = parentEl.querySelector(
          `textarea[aria-multiline=true][aria-disabled='${!isEnabled}']`
        );
        expect(textareaEl).not.toBeNull();
      });

      it('sets "name" attribute', () => {
        expect(textareaEl.name).toEqual(nameVal);
      });
    });

    describe('children checking', () => {
      const cjsChild = new createjs.Shape(); // dummy object
      AccessibilityModule.register({
        displayObject: cjsChild,
        role: AccessibilityModule.ROLES.CELL,
      });

      it('throws error attempting addChild()', () => {
        expect(() => {
          cjsTextarea.accessible.addChild(cjsChild);
        }).toThrowError(/multilinetextbox cannot have children/);
      });

      it('throws error attempting addChildAt()', () => {
        expect(() => {
          cjsTextarea.accessible.addChildAt(cjsChild);
        }).toThrowError(/multilinetextbox cannot have children/);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "enabled" property [for "aria-disabled"]', () => {
        expect(cjsTextarea.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsTextarea.accessible.enabled = newVal;
        expect(cjsTextarea.accessible.enabled).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('throws error if non accessible object is passed to "active" property', () => {
        const dummyObj = new createjs.Shape();
        expect(() => {
          cjsTextarea.accessible.active = dummyObj;
        }).toThrowError(
          /DisplayObject being set as the active descendant must have accessibility information/
        );
      });

      it('can read and set (and unset) "active" property', () => {
        const dummyObj = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: dummyObj,
          parent: container,
          role: AccessibilityModule.ROLES.MULTILINETEXTBOX,
        });
        cjsTextarea.accessible.active = dummyObj;
        expect(cjsTextarea.accessible.active).toEqual(dummyObj);
        expect(cjsTextarea.accessible.activeId).toBe(dummyObj.accessible.domId);

        cjsTextarea.accessible.active = undefined;
        expect(cjsTextarea.accessible.active).toBeUndefined();
      });

      it('can read and set "autoFocus" property', () => {
        expect(cjsTextarea.accessible.autoFocus).toEqual(shouldAutoFocus);

        const newVal = false;
        cjsTextarea.accessible.autoFocus = newVal;
        expect(cjsTextarea.accessible.autoFocus).toEqual(newVal);
      });

      it('can read and set "cols" property', () => {
        expect(cjsTextarea.accessible.cols).toEqual(colsVal);

        const newVal = 99;
        cjsTextarea.accessible.cols = newVal;
        expect(cjsTextarea.accessible.cols).toEqual(newVal);
      });

      it('can read and set "enabled" property', () => {
        expect(cjsTextarea.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsTextarea.accessible.enabled = newVal;
        expect(cjsTextarea.accessible.enabled).toEqual(newVal);
      });

      it('can read, set and clear "form" property with valid argument role', () => {
        const cjsForm = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: cjsForm,
          role: AccessibilityModule.ROLES.FORM,
        });

        cjsTextarea.accessible.form = cjsForm;
        expect(cjsTextarea.accessible.form).toEqual(cjsForm);
        expect(cjsTextarea.accessible.formDomId).toMatch(/^acc_?/);

        cjsTextarea.accessible.form = null;
        expect(cjsTextarea.accessible.form).toEqual(null);
        expect(cjsTextarea.accessible.formDomId).toEqual(undefined);
      });

      it('throws error when assigning invalid "form" property', () => {
        const cjsDummy = new createjs.Shape();
        const errorObj =
          /The form property of a multilinetextbox must be a DisplayObject with a role of form/;
        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.SPAN,
        });

        expect(() => {
          cjsTextarea.accessible.form = cjsDummy;
        }).toThrowError(errorObj);
      });

      it('can read and set "maxLength" property', () => {
        expect(cjsTextarea.accessible.maxLength).toEqual(maxLengthVal);

        const newVal = 999;
        cjsTextarea.accessible.maxLength = newVal;
        expect(cjsTextarea.accessible.maxLength).toEqual(newVal);
      });

      it('can read and set "name" property', () => {
        expect(cjsTextarea.accessible.name).toEqual(nameVal);

        const newVal = 'input_new_name';
        cjsTextarea.accessible.name = newVal;
        expect(cjsTextarea.accessible.name).toEqual(newVal);
      });

      it('can read and set "placeholder" property', () => {
        expect(cjsTextarea.accessible.placeholder).toEqual(placeholderVal);

        const newVal = 'better_val';
        cjsTextarea.accessible.placeholder = newVal;
        expect(cjsTextarea.accessible.placeholder).toEqual(newVal);
      });

      it('can read and set "readOnly" property', () => {
        expect(cjsTextarea.accessible.readOnly).toEqual(isReadOnly);

        const newVal = false;
        cjsTextarea.accessible.readOnly = newVal;
        expect(cjsTextarea.accessible.readOnly).toEqual(newVal);
      });

      it('can read and set "required" property', () => {
        expect(cjsTextarea.accessible.required).toEqual(isRequired);

        const newVal = false;
        cjsTextarea.accessible.required = newVal;
        expect(cjsTextarea.accessible.required).toEqual(newVal);
      });

      it('can read and set "rows" property', () => {
        expect(cjsTextarea.accessible.rows).toEqual(rowsVal);

        const newVal = 99;
        cjsTextarea.accessible.rows = newVal;
        expect(cjsTextarea.accessible.rows).toEqual(newVal);
      });

      it('can read and set "value" property', () => {
        document.getElementById = (query) => {
          return parentEl.querySelector(`#${query}`);
        };

        const newVal = '99';
        cjsTextarea.accessible.value = newVal;
        expect(cjsTextarea.accessible.value).toEqual(newVal);
      });

      it('can read and set "wrap" property', () => {
        expect(cjsTextarea.accessible.wrap).toEqual(isSoftWrap);

        const newVal = true;
        cjsTextarea.accessible.wrap = newVal;
        expect(cjsTextarea.accessible.wrap).toEqual(newVal);
      });
    });

    describe('"onchange" and "onselect" event handlers', () => {
      it('can dispatch "valueChanged" event with the newValue', () => {
        const eventHandler = jest.fn();
        cjsTextarea.on('valueChanged', eventHandler);

        const updatedValue = 'updated value';
        const changeEvent = new Event('change');
        Object.defineProperty(changeEvent, 'target', {
          value: { value: updatedValue },
        });
        textareaEl.dispatchEvent(changeEvent);

        expect(eventHandler).toBeCalledTimes(1);
        const argument = eventHandler.mock.calls[0][0];
        expect(argument.newValue).toBe(updatedValue);
      });

      it('can dispatch "selectionChanged" event when selected', () => {
        const selectEventHandler = jest.fn();
        cjsTextarea.on('selectionChanged', selectEventHandler);
        textareaEl.dispatchEvent(new Event('select'));
        expect(selectEventHandler).toBeCalledTimes(1);
      });
    });

    describe('"onInput" and "onKeyUp" event handlers', () => {
      it('can dispatch "valueChanged" and "selectionChanged" event with every Input', () => {
        const eventHandler = jest.fn();
        cjsTextarea.on('valueChanged', eventHandler);
        const selectEventHandler = jest.fn();
        cjsTextarea.on('selectionChanged', selectEventHandler);

        const updatedValue = 'updated value';
        const inputEvent = new Event('input');
        Object.defineProperty(inputEvent, 'target', {
          value: { value: updatedValue },
        });
        textareaEl.dispatchEvent(inputEvent);

        expect(eventHandler).toBeCalledTimes(1);
        const argument = eventHandler.mock.calls[0][0];
        expect(argument.newValue).toBe(updatedValue);
        expect(selectEventHandler).toBeCalledTimes(1);
      });

      ['left', 'right', 'up', 'down', 'home', 'end'].forEach((key) => {
        it(`can dispatch "selectionChanged" event when ${key} key is pressed`, () => {
          const selectEventHandler = jest.fn();
          cjsTextarea.on('selectionChanged', selectEventHandler);
          const keyCode = KeyCodes[key];
          const keyUpEvent = new KeyboardEvent('keyup', { keyCode });
          textareaEl.dispatchEvent(keyUpEvent);
          expect(selectEventHandler).toBeCalledTimes(1);
        });
      });

      it('does not dispatch "selectionChanged" event on Arrowkeys when default is prevented', () => {
        const selectEventHandler = jest.fn();
        cjsTextarea.accessible.enableKeyEvents = true;
        cjsTextarea.on('selectionChanged', selectEventHandler);
        const keyCode = KeyCodes.left;
        const keyUpEvent = new KeyboardEvent('keyup', { keyCode });
        Object.defineProperty(keyUpEvent, 'defaultPrevented', {
          value: true,
        });
        textareaEl.dispatchEvent(keyUpEvent);
        expect(selectEventHandler).toBeCalledTimes(0);
      });
    });
  });
});
