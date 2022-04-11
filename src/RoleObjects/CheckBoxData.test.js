import * as createjs from 'createjs-module';
import 'core-js/stable';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../index';

describe('CheckBoxData', () => {
  describe('setupStage', () => {
    window.createjs = createjs;
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsCheckbox;
    let checkboxEl;

    beforeEach(() => {
      // const keyboardClickListener = jest.fn();
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsCheckbox = new createjs.Shape();

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        displayObject: cjsCheckbox,
        parent: container,
        role: AccessibilityModule.ROLES.CHECKBOX,
      });

      cjsCheckbox.accessible.enableKeyEvents = true;
      // container.on('keydown', keyboardClickListener);
      // stage.update();
      stage.accessibilityTranslator.update();
    });

    it('creates input[type=checkbox] element', () => {
      checkboxEl = parentEl.querySelector('input[type=checkbox]');
      expect(checkboxEl).not.toBeNull();
    });

    it('disables keyboard events', () => {
      cjsCheckbox.accessible.enableKeyEvents = false;
      expect(cjsCheckbox.accessible.enableKeyEvents).toEqual(false);
    });

    it('can read and set \'checked\' property', () => {
      cjsCheckbox.accessible.checked = true;
      expect(cjsCheckbox.accessible.checked).toEqual(true);

      // console.log('before keyDown', checkboxEl.checked);
      ReactTestUtils.Simulate.keyDown(checkboxEl, { key: 'Enter', keyCode: KeyCodes.enter });
      // console.log('after', checkboxEl.checked);
      // expect(cjsCheckbox.accessible.checked).toEqual(false);

      // console.log('before change', checkboxEl.checked);
      ReactTestUtils.Simulate.change(checkboxEl, { target: { checked: true } });
      // console.log('after', checkboxEl.checked);
      // expect(cjsCheckbox.accessible.checked).toEqual(true);
      // expect(keyboardClickListener).toHaveBeenCalled();

      stage.update();
      stage.accessibilityTranslator.update(() => {
        // console.log('update callback()', checkboxEl.outerHTML);
      });

      return new Promise(resolve => setImmediate(resolve)).then(() => {
        // console.log('please?', checkboxEl.checked);
      });
    });
  });
});
