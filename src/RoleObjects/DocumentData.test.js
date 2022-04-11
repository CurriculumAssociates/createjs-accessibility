import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('DocumentData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsDocument;
    let documentEl;
    let isExpanded;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsDocument = new createjs.Shape(); // dummy object
      isExpanded = false;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        accessibleOptions: {
          expanded: isExpanded,
        },
        displayObject: cjsDocument,
        parent: container,
        role: AccessibilityModule.ROLES.DOCUMENT,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates div[role=document] element', () => {
        documentEl = parentEl.querySelector('div[role=document]');
        expect(documentEl).not.toBeNull();
      });

      it('sets "aria-expanded" attribute', () => {
        documentEl = parentEl.querySelector(`div[role=document][aria-expanded='${isExpanded}']`);
        expect(documentEl).not.toBeNull();
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
