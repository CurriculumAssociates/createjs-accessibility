import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('MenuItemRadioData', () => {
  describe('register role', () => {
    let cjsMenuItemRadio;
    let liEl;
    let isChecked;
    let isReadOnly;

    beforeEach(() => {
      cjsMenuItemRadio = new createjs.Shape(); // dummy object
      isChecked = false;
      isReadOnly = false;

      AccessibilityModule.register({
        accessibleOptions: {
          readOnly: isReadOnly,
        },
        displayObject: cjsMenuItemRadio,
        parent: container,
        role: AccessibilityModule.ROLES.MENUITEMRADIO,
      });

      stage.accessibilityTranslator.update();
      liEl = parentEl.querySelector(
        'li[role=menuitemradio][aria-haspopup=false][aria-checked=false]'
      );
    });

    describe('rendering', () => {
      it('creates li[role=menuitemradio][aria-haspopup=false][aria-checked=false] element', () => {
        expect(liEl).not.toBeNull();
      });

      it('sets "aria-readonly" attribute', () => {
        const ariaReadOnly = liEl.getAttribute('aria-readonly') === 'true';
        expect(ariaReadOnly).toEqual(isReadOnly);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "checked" property [for "aria-checked"]', () => {
        expect(cjsMenuItemRadio.accessible.checked).toEqual(isChecked);

        const newVal = true;
        cjsMenuItemRadio.accessible.checked = newVal;
        expect(cjsMenuItemRadio.accessible.checked).toEqual(newVal);
      });

      it('can read and set "readOnly" property [for "aria-readonly"]', () => {
        expect(cjsMenuItemRadio.accessible.readOnly).toEqual(isReadOnly);

        const newVal = true;
        cjsMenuItemRadio.accessible.readOnly = newVal;
        expect(cjsMenuItemRadio.accessible.readOnly).toEqual(newVal);
      });
    });
  });
});
