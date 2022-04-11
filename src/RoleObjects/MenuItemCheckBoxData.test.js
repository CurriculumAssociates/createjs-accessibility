import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('MenuItemCheckBoxData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsMenuItemCheckBox;
    let liEl;
    let isChecked;
    let isReadOnly;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsMenuItemCheckBox = new createjs.Shape(); // dummy object
      isChecked = false;
      isReadOnly = false;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        accessibleOptions: {
          readOnly: isReadOnly,
        },
        displayObject: cjsMenuItemCheckBox,
        parent: container,
        role: AccessibilityModule.ROLES.MENUITEMCHECKBOX,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates li[role=menuitemcheckbox][aria-haspopup=false][aria-checked=false] element', () => {
        liEl = parentEl.querySelector('li[role=menuitemcheckbox][aria-haspopup=false][aria-checked=false]');
        expect(liEl).not.toBeNull();
      });

      it('sets "aria-readonly" attribute', () => {
        liEl = parentEl.querySelector(`li[role=menuitemcheckbox][aria-haspopup=false][aria-checked=false][aria-readonly='${isReadOnly}']`);
        expect(liEl).not.toBeNull();
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
