import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('CheckBoxData', () => {
  describe('setupStage', () => {
    let cjsCheckbox;
    let checkboxEl;

    beforeEach(() => {
      cjsCheckbox = new createjs.Shape();

      AccessibilityModule.register({
        displayObject: cjsCheckbox,
        parent: container,
        role: AccessibilityModule.ROLES.CHECKBOX,
      });

      cjsCheckbox.accessible.enableKeyEvents = true;
      stage.accessibilityTranslator.update();

      checkboxEl = parentEl.querySelector('input');
    });

    it('creates input[type=checkbox] element', () => {
      expect(checkboxEl.type).toEqual('checkbox');
    });

    it('disables keyboard events', () => {
      cjsCheckbox.accessible.enableKeyEvents = false;
      expect(cjsCheckbox.accessible.enableKeyEvents).toEqual(false);
    });

    it('can read and set "checked" property', () => {
      // False by default
      expect(cjsCheckbox.accessible.checked).toEqual(false);

      cjsCheckbox.accessible.checked = true;
      expect(cjsCheckbox.accessible.checked).toEqual(true);
    });
  });
});
