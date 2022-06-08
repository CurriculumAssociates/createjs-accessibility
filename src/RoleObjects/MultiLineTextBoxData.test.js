import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('MultiLineTextBoxData', () => {
  describe('register role', () => {
    let cjsTextarea;
    let textareaEl;
    let shouldAutoFocus;
    let isEnabled;
    let nameVal;

    beforeEach(() => {
      cjsTextarea = new createjs.Shape(); // dummy object
      shouldAutoFocus = true;
      isEnabled = false;
      nameVal = 'an_input';

      AccessibilityModule.register({
        accessibleOptions: {
          autoFocus: shouldAutoFocus,
          enabled: isEnabled,
          name: nameVal,
        },
        displayObject: cjsTextarea,
        parent: container,
        role: AccessibilityModule.ROLES.MULTILINETEXTBOX, // factory can't create InputTagData directly
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
      it('can read and set "autoFocus" property', () => {
        expect(cjsTextarea.accessible.autoFocus).toEqual(shouldAutoFocus);

        const newVal = false;
        cjsTextarea.accessible.autoFocus = newVal;
        expect(cjsTextarea.accessible.autoFocus).toEqual(newVal);
      });

      it('can read and set "enabled" property', () => {
        expect(cjsTextarea.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsTextarea.accessible.enabled = newVal;
        expect(cjsTextarea.accessible.enabled).toEqual(newVal);
      });

      it('can read and set "name" property', () => {
        expect(cjsTextarea.accessible.name).toEqual(nameVal);

        const newVal = 'input_new_name';
        cjsTextarea.accessible.name = newVal;
        expect(cjsTextarea.accessible.name).toEqual(newVal);
      });
    });
  });
});
