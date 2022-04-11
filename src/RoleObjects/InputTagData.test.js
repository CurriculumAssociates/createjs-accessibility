import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('InputTagData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsInput;
    let inputEl;
    let shouldAutoFocus;
    let isEnabled;
    let nameVal;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsInput = new createjs.Shape(); // dummy object
      shouldAutoFocus = true;
      isEnabled = false;
      nameVal = 'an_input';

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

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
    });

    describe('rendering', () => {
      it('creates input[type=radio] element', () => {
        inputEl = parentEl.querySelector('input[type=radio]');
        expect(inputEl).not.toBeNull();
      });

      it('sets "aria-disabled" attribute', () => {
        inputEl = parentEl.querySelector(`input[type=radio][aria-disabled='${!isEnabled}']`);
        expect(inputEl).not.toBeNull();
      });

      it('sets "name" attribute', () => {
        inputEl = parentEl.querySelector(`input[type=radio][name='${nameVal}']`);
        expect(inputEl).not.toBeNull();
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
