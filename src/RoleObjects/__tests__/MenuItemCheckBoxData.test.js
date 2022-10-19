import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('MenuItemCheckBoxData', () => {
  describe('register role', () => {
    let cjsMenuItemCheckBox;
    let liEl;
    let isChecked;
    let isReadOnly;

    beforeEach(() => {
      cjsMenuItemCheckBox = new createjs.Shape(); // dummy object
      isChecked = false;
      isReadOnly = false;

      AccessibilityModule.register({
        accessibleOptions: {
          readOnly: isReadOnly,
        },
        displayObject: cjsMenuItemCheckBox,
        parent: container,
        role: AccessibilityModule.ROLES.MENUITEMCHECKBOX,
      });

      stage.accessibilityTranslator.update();
      liEl = parentEl.querySelector(
        'li[role=menuitemcheckbox][aria-haspopup=false][aria-checked=false]'
      );
    });

    describe('rendering', () => {
      it('creates li[role=menuitemcheckbox][aria-haspopup=false][aria-checked=false] element', () => {
        expect(liEl).not.toBeNull();
      });

      it('sets "aria-readonly" attribute', () => {
        const ariaReadOnly = liEl.getAttribute('aria-readonly') === 'true';
        expect(ariaReadOnly).toEqual(isReadOnly);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "checked" property [for "aria-checked"]', () => {
        expect(cjsMenuItemCheckBox.accessible.checked).toEqual(isChecked);

        const newVal = true;
        cjsMenuItemCheckBox.accessible.checked = newVal;
        expect(cjsMenuItemCheckBox.accessible.checked).toEqual(newVal);
      });

      it('can read and set "readOnly" property [for "aria-readonly"]', () => {
        expect(cjsMenuItemCheckBox.accessible.readOnly).toEqual(isReadOnly);

        const newVal = true;
        cjsMenuItemCheckBox.accessible.readOnly = newVal;
        expect(cjsMenuItemCheckBox.accessible.readOnly).toEqual(newVal);
      });
    });
  });
});
