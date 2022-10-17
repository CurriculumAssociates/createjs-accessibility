import * as createjs from 'createjs-module';
import AccessibilityModule from '../../src/index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('MenuBarData', () => {
  describe('register role', () => {
    let cjsMenuBar;
    let cjsMenuItem;
    let cjsCell;
    let ulEl;
    let shouldEnableKeyEvents;

    beforeEach(() => {
      cjsMenuBar = new createjs.Shape(); // dummy object
      cjsMenuItem = new createjs.Shape(); // dummy child object
      cjsCell = new createjs.Shape(); // dummy child object
      shouldEnableKeyEvents = false;

      AccessibilityModule.register({
        accessibleOptions: {
          enableKeyEvents: shouldEnableKeyEvents,
        },
        displayObject: cjsMenuBar,
        parent: container,
        role: AccessibilityModule.ROLES.MENUBAR,
      });

      AccessibilityModule.register({
        displayObject: cjsMenuItem,
        parent: cjsMenuBar,
        role: AccessibilityModule.ROLES.MENUITEM,
      });

      AccessibilityModule.register({
        displayObject: cjsCell,
        role: AccessibilityModule.ROLES.CELL,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates ul[role=menubar] element', () => {
        ulEl = parentEl.querySelector('ul[role=menubar]');
        expect(ulEl).not.toBeNull();
      });
    });

    describe('children checking', () => {
      const errorObj =
        /Children of menubar must have a role of menuitem or menuitemcheckbox or menuitemradio/;
      it('throws error attempting to add prohibited child using addChild() ', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsMenuBar.accessible.addChild(cjsCell);
        }).toThrowError(errorObj);
      });

      it('throws error attempting to add prohibited child using addChildAt()', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsMenuBar.accessible.addChildAt(cjsCell, 0);
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
          cjsMenuBar.accessible.addChildAt(cjsDummy, 0);
        }).not.toThrowError();
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsMenuBar.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = true;
        cjsMenuBar.accessible.enableKeyEvents = newVal;
        expect(cjsMenuBar.accessible.enableKeyEvents).toEqual(newVal);
      });
    });
  });
});
