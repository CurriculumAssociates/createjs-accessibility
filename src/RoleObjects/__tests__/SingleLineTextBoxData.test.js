import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../../index';

describe('SingleLineTextBoxData', () => {
  describe('register role', () => {
    let cjsInput;
    let inputEl;
    const accessibleOptions = {};

    beforeEach(() => {
      cjsInput = new createjs.Shape();
      accessibleOptions.name = 'text_input';
      accessibleOptions.maxLength = 10;
      accessibleOptions.pattern = 'abc';
      accessibleOptions.placeholder = 'type here';
      accessibleOptions.size = 20;
      accessibleOptions.readOnly = false;
      accessibleOptions.required = false;
      AccessibilityModule.register({
        accessibleOptions,
        displayObject: cjsInput,
        parent: container,
        role: AccessibilityModule.ROLES.SINGLELINETEXTBOX,
      });

      stage.accessibilityTranslator.update();
      inputEl = parentEl.querySelector('input[type=text]');
    });

    describe('rendering', () => {
      it('creates input[type=text] element', () => {
        expect(inputEl).not.toBeNull();
      });
    });

    describe('"addChild()" and "addChildAt"', () => {
      const cjsChild = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsChild,
        role: AccessibilityModule.ROLES.CELL,
      });

      it('throws error when addChild() is called', () => {
        expect(() => {
          cjsInput.accessible.addChild(cjsChild);
        }).toThrowError(/singlelinetextbox cannot have children/);
      });

      it('throws error when addChildAt() is called', () => {
        expect(() => {
          cjsInput.accessible.addChildAt(cjsChild);
        }).toThrowError(/singlelinetextbox cannot have children/);
      });
    });

    describe('getters and setters methods', () => {
      it('can set and get "autoComplete" property', () => {
        expect(cjsInput.accessible.autoComplete).toBe(true);
        const newVal = 'username';
        cjsInput.accessible.autoComplete = newVal;
        expect(cjsInput.accessible.autoComplete).toBe(newVal);
      });

      it('boolean value for "autoComplete" property is converted into "on" or "off"', () => {
        let newVal = false;
        cjsInput.accessible.autoComplete = newVal;
        expect(cjsInput.accessible.autoComplete).toBe('off');

        newVal = true;
        cjsInput.accessible.autoComplete = newVal;
        expect(cjsInput.accessible.autoComplete).toBe('on');
      });

      it('throws error if invalid value is passed to "autoComplete" property', () => {
        expect(() => {
          cjsInput.accessible.autoComplete = 'invalidValue';
        }).toThrowError(/Unable to set autoComplete to invalidValue, /);
      });

      [
        { property: 'maxLength', newVal: 40 },
        { property: 'size', newVal: 50 },
        { property: 'pattern', newVal: 'new Pattern' },
        { property: 'placeholder', newVal: 'press key' },
        { property: 'readOnly', newVal: true },
        { property: 'required', newVal: true },
      ].forEach(({ property, newVal }) => {
        it(`can set and get "${property}" property`, () => {
          expect(cjsInput.accessible[property]).toBe(
            accessibleOptions[property]
          );
          cjsInput.accessible[property] = newVal;
        });
      });

      it('throws error if non accessible object is passed to "active" property', () => {
        const dummyObj = new createjs.Shape();
        expect(() => {
          cjsInput.accessible.active = dummyObj;
        }).toThrowError(
          /DisplayObject being set as the active descendant must have accessibility information/
        );
      });

      it('can set and get "active" property', () => {
        const dummyObj = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: dummyObj,
          parent: container,
          role: AccessibilityModule.ROLES.SINGLELINETEXTBOX,
        });
        cjsInput.accessible.active = dummyObj;
        expect(cjsInput.accessible.active).toEqual(dummyObj);
        expect(cjsInput.accessible.activeId).toBe(dummyObj.accessible.domId);
      });

      it('can set and get "value" property', () => {
        document.getElementById = (query) => {
          return parentEl.querySelector(`#${query}`);
        };
        const updatedValue = 'updated value';
        cjsInput.accessible.value = updatedValue;
        expect(inputEl.value).toEqual(updatedValue);
      });
    });

    describe('"onchange" and "onselect" event handlers', () => {
      it('can dispatch "valueChanged" event with the newValue', () => {
        const eventHandler = jest.fn();
        cjsInput.on('valueChanged', eventHandler);

        const updatedValue = 'updated value';
        const changeEvent = new Event('change');
        Object.defineProperty(changeEvent, 'target', {
          value: { value: updatedValue },
        });
        inputEl.dispatchEvent(changeEvent);

        expect(eventHandler).toBeCalledTimes(1);
        const argument = eventHandler.mock.calls[0][0];
        expect(argument.newValue).toBe(updatedValue);
      });

      it('can dispatch "selectionChanged" event when selected', () => {
        const selectEventHandler = jest.fn();
        cjsInput.on('selectionChanged', selectEventHandler);
        inputEl.dispatchEvent(new Event('select'));
        expect(selectEventHandler).toBeCalledTimes(1);
      });
    });

    describe('"onInput" and "onKeyUp" event handlers', () => {
      it('can dispatch "valueChanged" and "selectionChanged" event with every Input ', () => {
        const eventHandler = jest.fn();
        cjsInput.on('valueChanged', eventHandler);
        const selectEventHandler = jest.fn();
        cjsInput.on('selectionChanged', selectEventHandler);

        const updatedValue = 'updated value';
        const inputEvent = new Event('input');
        Object.defineProperty(inputEvent, 'target', {
          value: { value: updatedValue },
        });
        inputEl.dispatchEvent(inputEvent);

        expect(eventHandler).toBeCalledTimes(1);
        const argument = eventHandler.mock.calls[0][0];
        expect(argument.newValue).toBe(updatedValue);
        expect(selectEventHandler).toBeCalledTimes(1);
      });

      ['left', 'right', 'home', 'end'].forEach((key) => {
        it(`can dispatch "selectionChanged" event when ${key} key is pressed`, () => {
          const selectEventHandler = jest.fn();
          cjsInput.on('selectionChanged', selectEventHandler);
          const keyCode = KeyCodes[key];
          const keyUpEvent = new KeyboardEvent('keyup', { keyCode });
          inputEl.dispatchEvent(keyUpEvent);
          expect(selectEventHandler).toBeCalledTimes(1);
        });
      });

      it('does not dispatch "selectionChanged" event on Arrowkeys when default is prevented', () => {
        const selectEventHandler = jest.fn();
        cjsInput.accessible.enableKeyEvents = true;
        cjsInput.on('selectionChanged', selectEventHandler);
        const keyCode = KeyCodes.left;
        const keyUpEvent = new KeyboardEvent('keyup', { keyCode });
        Object.defineProperty(keyUpEvent, 'defaultPrevented', {
          value: true,
        });
        inputEl.dispatchEvent(keyUpEvent);
        expect(selectEventHandler).toBeCalledTimes(0);
      });
    });
  });
});
