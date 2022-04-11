import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('DialogData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsDialog;
    let dialogEl;
    let isExpanded;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsDialog = new createjs.Shape(); // dummy object
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
        displayObject: cjsDialog,
        parent: container,
        role: AccessibilityModule.ROLES.DIALOG,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates div[role=dialog] element', () => {
        dialogEl = parentEl.querySelector('div[role=dialog]');
        expect(dialogEl).not.toBeNull();
      });

      it('sets \'aria-expanded\' attribute', () => {
        dialogEl = parentEl.querySelector(`div[role=dialog][aria-expanded='${isExpanded}']`);
        expect(dialogEl).not.toBeNull();
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set \'expanded\' property [for \'aria-expanded\']', () => {
        expect(cjsDialog.accessible.expanded).toEqual(isExpanded);

        const newVal = true;
        cjsDialog.accessible.expanded = newVal;
        expect(cjsDialog.accessible.expanded).toEqual(newVal);
      });
    });
  });
});
