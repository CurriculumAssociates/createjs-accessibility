import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('MenuItemData', () => {
  describe('register role', () => {
    let cjsMenuItem;
    let cjsCell;
    let liEl;
    let shouldEnableKeyEvents;

    beforeEach(() => {
      cjsMenuItem = new createjs.Shape(); // dummy object
      cjsCell = new createjs.Shape(); // dummy child object
      shouldEnableKeyEvents = false;

      AccessibilityModule.register({
        accessibleOptions: {
          enableKeyEvents: shouldEnableKeyEvents,
        },
        displayObject: cjsMenuItem,
        parent: container,
        role: AccessibilityModule.ROLES.MENUITEM,
      });

      AccessibilityModule.register({
        displayObject: cjsCell,
        role: AccessibilityModule.ROLES.CELL,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates li[role=menuitem] element', () => {
        liEl = parentEl.querySelector('li[role=menuitem]');
        expect(liEl).not.toBeNull();
      });
    });

    describe('children checking', () => {
      const errorObj =
        /Children of menuitem must have a role of menuitem or menu or menuitemcheckbox or menuitemradio/;
      it('throws error attempting to add prohibited child using addChild() ', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsMenuItem.accessible.addChild(cjsCell);
        }).toThrowError(errorObj);
      });

      it('throws error attempting to add prohibited child using addChildAt()', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsMenuItem.accessible.addChildAt(cjsCell, 0);
        }).toThrowError(errorObj);
      });

      it('throws NO error when adding permitted child using addChildAt()', () => {
        const cjsDummy = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.MENUITEM,
        });
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsMenuItem.accessible.addChildAt(cjsDummy, 0);
        }).not.toThrowError();
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsMenuItem.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = true;
        cjsMenuItem.accessible.enableKeyEvents = newVal;
        expect(cjsMenuItem.accessible.enableKeyEvents).toEqual(newVal);
      });
    });
  });
});
