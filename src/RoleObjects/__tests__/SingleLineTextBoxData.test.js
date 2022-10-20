import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

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
        let newVal = true;
        cjsInput.accessible.autoComplete = newVal;
        expect(cjsInput.accessible.autoComplete).toBe('on');

        newVal = false;
        cjsInput.accessible.autoComplete = newVal;
        expect(cjsInput.accessible.autoComplete).toBe('off');
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
        ReactTestUtils.Simulate.change(inputEl, {
          target: { value: updatedValue },
        });

        expect(eventHandler).toBeCalledTimes(1);
        const argument = eventHandler.mock.calls[0][0];
        expect(argument.newValue).toBe(updatedValue);
      });

      it('can dispatch "selectionChanged" event when selected', () => {
        const selectEventHandler = jest.fn();
        cjsInput.on('selectionChanged', selectEventHandler);
        ReactTestUtils.Simulate.select(inputEl);
        expect(selectEventHandler).toBeCalledTimes(1);
      });
    });
  });
});
