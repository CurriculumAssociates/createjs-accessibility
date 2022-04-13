import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('InputTagData', () => {
  describe('register role', () => {
    let cjsInput;
    let inputEl;
    let shouldAutoFocus;
    let isEnabled;
    let nameVal;

    beforeEach(() => {
      cjsInput = new createjs.Shape(); // dummy object
      shouldAutoFocus = true;
      isEnabled = false;
      nameVal = 'an_input';

      AccessibilityModule.register({
        accessibleOptions: {
          autoFocus: shouldAutoFocus,
          enabled: isEnabled,
          name: nameVal,
        },
        displayObject: cjsInput,
        parent: container,
        role: AccessibilityModule.ROLES.RADIO, // factory can't create InputTagData directly
      });

      stage.accessibilityTranslator.update();
      inputEl = parentEl.querySelector('input[type=radio]');
    });

    describe('rendering', () => {
      it('creates input[type=radio] element', () => {
        expect(inputEl).not.toBeNull();
      });

      it('sets "aria-disabled" attribute', () => {
        inputEl = parentEl.querySelector(`input[type=radio][aria-disabled='${!isEnabled}']`);
        expect(inputEl).not.toBeNull();
      });

      it('sets "name" attribute', () => {
        expect(inputEl.name).toEqual(nameVal);
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
          cjsInput.accessible.addChild(cjsChild);
        }).toThrowError(/radio cannot have children/);
      });

      it('throws error attempting addChildAt()', () => {
        expect(() => {
          cjsInput.accessible.addChildAt(cjsChild);
        }).toThrowError(/radio cannot have children/);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "enabled" property [for "aria-disabled"]', () => {
        expect(cjsInput.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsInput.accessible.enabled = newVal;
        expect(cjsInput.accessible.enabled).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "autoFocus" property', () => {
        expect(cjsInput.accessible.autoFocus).toEqual(shouldAutoFocus);

        const newVal = false;
        cjsInput.accessible.autoFocus = newVal;
        expect(cjsInput.accessible.autoFocus).toEqual(newVal);
      });

      it('can read and set "enabled" property', () => {
        expect(cjsInput.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsInput.accessible.enabled = newVal;
        expect(cjsInput.accessible.enabled).toEqual(newVal);
      });

      it('can read and set "name" property', () => {
        expect(cjsInput.accessible.name).toEqual(nameVal);

        const newVal = 'input_new_name';
        cjsInput.accessible.name = newVal;
        expect(cjsInput.accessible.name).toEqual(newVal);
      });
    });
  });
});
