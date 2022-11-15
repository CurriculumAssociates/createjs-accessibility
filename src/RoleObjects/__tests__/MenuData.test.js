import * as createjs from 'createjs-module';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

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
        const keydownEvent = new KeyboardEvent('keydown', { keyCode });
        Object.assign(keydownEvent, { preventDefault: preventDefaultSpy });
        Object.defineProperty(keydownEvent, 'defaultPrevented', {
          value: true,
        });
        ulEl.dispatchEvent(keydownEvent);
        expect(preventDefaultSpy).toBeCalledTimes(0);
      });

      it('calls preventDefault with UP or DOWN', () => {
        keyCode = KeyCodes.down;
        let newEvent = new KeyboardEvent('keydown', { keyCode });
        Object.assign(newEvent, { preventDefault: preventDefaultSpy });
        ulEl.dispatchEvent(newEvent);
        expect(preventDefaultSpy.mock.calls.length).toBe(1);

        keyCode = KeyCodes.up;
        newEvent = new KeyboardEvent('keydown', { keyCode });
        Object.assign(newEvent, { preventDefault: preventDefaultSpy });
        ulEl.dispatchEvent(newEvent);
        expect(preventDefaultSpy).toBeCalledTimes(2);
      });
    });
  });
});
