import * as createjs from 'createjs-module';
import KeyCodes from 'keycodes-enum';
import ReactTestUtils from 'react-dom/test-utils';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('MenuData', () => {
  describe('register role', () => {
    let cjsMenu;
    let cjsMenuItem;
    let cjsCell;
    let ulEl;
    let shouldEnableKeyEvents;

    beforeEach(() => {
      cjsMenu = new createjs.Shape(); // dummy object
      cjsMenuItem = new createjs.Shape(); // dummy child object
      cjsCell = new createjs.Shape(); // dummy child object
      shouldEnableKeyEvents = true;

      AccessibilityModule.register({
        accessibleOptions: {
          enableKeyEvents: shouldEnableKeyEvents,
        },
        displayObject: cjsMenu,
        parent: container,
        role: AccessibilityModule.ROLES.MENU,
      });

      AccessibilityModule.register({
        displayObject: cjsMenuItem,
        parent: cjsMenu,
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
        ulEl = parentEl.querySelector('ul[role=menu]');
        expect(ulEl).not.toBeNull();
      });
    });

    describe('children checking', () => {
      const errorObj =
        /Children of menu must have a role of menuitem, menuitemcheckbox, menuitemradio or separator/;
      it('throws error attempting to add prohibited child using addChild() ', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsMenu.accessible.addChild(cjsCell);
        }).toThrowError(errorObj);
      });

      it('throws error attempting to add prohibited child using addChildAt()', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsMenu.accessible.addChildAt(cjsCell, 0);
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
          cjsMenu.accessible.addChildAt(cjsDummy, 0);
        }).not.toThrowError();
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsMenu.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = false;
        cjsMenu.accessible.enableKeyEvents = newVal;
        expect(cjsMenu.accessible.enableKeyEvents).toEqual(newVal);
      });
    });

    describe('"onKeyDown" event listener', () => {
      let keyCode;
      let preventDefaultSpy;

      beforeEach(() => {
        preventDefaultSpy = jest.fn();
      });

      it('can prevent default events if "defaultPrevented" is true', () => {
        keyCode = KeyCodes.down;
        ReactTestUtils.Simulate.keyDown(ulEl, {
          keyCode,
          defaultPrevented: true,
          preventDefault: preventDefaultSpy,
        });
        expect(preventDefaultSpy).toBeCalledTimes(0);
      });

      it('calls preventDefault with UP or DOWN', () => {
        keyCode = KeyCodes.down;
        ReactTestUtils.Simulate.keyDown(ulEl, {
          keyCode,
          preventDefault: preventDefaultSpy,
        });
        expect(preventDefaultSpy).toBeCalledTimes(1);

        keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(ulEl, {
          keyCode,
          preventDefault: preventDefaultSpy,
        });
        expect(preventDefaultSpy).toBeCalledTimes(2);
      });
    });
  });
});
