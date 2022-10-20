import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('TreeItemData', () => {
  describe('register role', () => {
    let cjsTreeItem;
    let liEl;
    const accessibleOptions = {};

    beforeEach(() => {
      cjsTreeItem = new createjs.Shape();
      accessibleOptions.positionInSet = 0;
      accessibleOptions.setSize = 1;
      accessibleOptions.selected = false;
      accessibleOptions.checked = false;
      AccessibilityModule.register({
        displayObject: cjsTreeItem,
        parent: container,
        role: AccessibilityModule.ROLES.TREEITEM,
        accessibleOptions,
      });
      stage.accessibilityTranslator.update();

      liEl = parentEl.querySelector('li[role=treeitem]');
    });

    describe('rendering', () => {
      it('creates li[role=treeitem] element', () => {
        expect(liEl).not.toBeNull();
      });
    });

    describe('Accessible setters and getters', () => {
      it('can set and get "enableKeyEvents" property', () => {
        expect(cjsTreeItem.accessible.enableKeyEvents).toBe(false);

        cjsTreeItem.accessible.enableKeyEvents = true;
        expect(cjsTreeItem.accessible.enableKeyEvents).toBe(true);
      });

      it('can set and get "positionInSet" property', () => {
        expect(cjsTreeItem.accessible.positionInSet).toBe(
          accessibleOptions.positionInSet
        );

        cjsTreeItem.accessible.positionInSet = 1;
        expect(cjsTreeItem.accessible.positionInSet).toBe(1);
      });

      it('can set and get "setSize" property', () => {
        expect(cjsTreeItem.accessible.setSize).toBe(accessibleOptions.setSize);

        cjsTreeItem.accessible.setSize = 2;
        expect(cjsTreeItem.accessible.setSize).toBe(2);
      });

      it('can set and get "selected" property', () => {
        expect(cjsTreeItem.accessible.selected).toBe(
          accessibleOptions.selected
        );

        cjsTreeItem.accessible.selected = true;
        expect(cjsTreeItem.accessible.selected).toBe(true);
      });

      it('can set and get "checked" property', () => {
        expect(cjsTreeItem.accessible.checked).toBe(accessibleOptions.checked);

        cjsTreeItem.accessible.checked = true;
        expect(cjsTreeItem.accessible.checked).toBe(true);
      });
    });

    describe('onKeydown event Listener', () => {
      let onKeyboardClick;
      beforeEach(() => {
        onKeyboardClick = jest.fn();
        cjsTreeItem.on('keyboardClick', onKeyboardClick);
      });

      it('can dispatch "keyboardClick" event if Enter key is pressed', () => {
        const keyCode = KeyCodes.enter;
        ReactTestUtils.Simulate.keyDown(liEl, { keyCode });
        expect(onKeyboardClick).toBeCalledTimes(1);
      });

      it('does not dispatch "keyboardClick" event if enter key is not pressed', () => {
        const keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(liEl, { keyCode });
        expect(onKeyboardClick).toBeCalledTimes(0);
      });

      describe('"enableKeyEvents" is true', () => {
        beforeEach(() => {
          cjsTreeItem.accessible.enableKeyEvents = true;
        });

        it('does not dispatch "keyboardClick" event if enableKeyEvents is true and preventDefault is called', () => {
          const keyCode = KeyCodes.enter;
          ReactTestUtils.Simulate.keyDown(liEl, {
            keyCode,
            defaultPrevented: true,
          });
          expect(onKeyboardClick).toBeCalledTimes(0);
        });

        it('can dispatch "keyboardClick" event if enableKeyEvents is true and preventDefault is not called', () => {
          const keyCode = KeyCodes.enter;
          ReactTestUtils.Simulate.keyDown(liEl, {
            keyCode,
            defaultPrevented: false,
          });
          expect(onKeyboardClick).toBeCalledTimes(1);
        });
      });
    });
  });
});
