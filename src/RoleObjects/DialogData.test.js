import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('DialogData', () => {
  describe('register role', () => {
    let cjsDialog;
    let dialogEl;
    let isExpanded;

    beforeEach(() => {
      cjsDialog = new createjs.Shape(); // dummy object
      isExpanded = false;

      AccessibilityModule.register({
        accessibleOptions: {
          expanded: isExpanded,
        },
        displayObject: cjsDialog,
        parent: container,
        role: AccessibilityModule.ROLES.DIALOG,
      });

      stage.accessibilityTranslator.update();
      dialogEl = parentEl.querySelector('div[role=dialog]');
    });

    describe('rendering', () => {
      it('creates div[role=dialog] element', () => {
        expect(dialogEl).not.toBeNull();
      });

      it('sets "aria-expanded" attribute', () => {
        const ariaExpanded = dialogEl.getAttribute('aria-expanded') === 'true';
        expect(ariaExpanded).toEqual(isExpanded);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "expanded" property [for "aria-expanded"]', () => {
        expect(cjsDialog.accessible.expanded).toEqual(isExpanded);

        const newVal = true;
        cjsDialog.accessible.expanded = newVal;
        expect(cjsDialog.accessible.expanded).toEqual(newVal);
      });
    });
  });
});
