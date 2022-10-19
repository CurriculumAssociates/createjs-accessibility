import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('DocumentData', () => {
  describe('register role', () => {
    let cjsDocument;
    let documentEl;
    let isExpanded;

    beforeEach(() => {
      cjsDocument = new createjs.Shape(); // dummy object
      isExpanded = false;

      AccessibilityModule.register({
        accessibleOptions: {
          expanded: isExpanded,
        },
        displayObject: cjsDocument,
        parent: container,
        role: AccessibilityModule.ROLES.DOCUMENT,
      });

      stage.accessibilityTranslator.update();
      documentEl = parentEl.querySelector('div[role=document]');
    });

    describe('rendering', () => {
      it('creates div[role=document] element', () => {
        expect(documentEl).not.toBeNull();
      });

      it('sets "aria-expanded" attribute', () => {
        const ariaExpanded =
          documentEl.getAttribute('aria-expanded') === 'true';
        expect(ariaExpanded).toEqual(isExpanded);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "expanded" property [for "aria-expanded"]', () => {
        expect(cjsDocument.accessible.expanded).toEqual(isExpanded);

        const newVal = true;
        cjsDocument.accessible.expanded = newVal;
        expect(cjsDocument.accessible.expanded).toEqual(newVal);
      });
    });
  });
});
