import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TreeItemData', () => {
  describe('register role', () => {
    let cjsTree;
    let cjsTreeItem;
    let treeItemEl;
    const accessibleOptions = {};

    beforeEach(() => {
      cjsTreeItem = new createjs.Shape();
      cjsTree = new createjs.Shape();
      AccessibilityModule.register({
        displayObject: cjsTree,
        parent: container,
        role: AccessibilityModule.ROLES.TREEITEM,
      });
      accessibleOptions.positionInSet = 0;
      accessibleOptions.setSize = 1;
      accessibleOptions.selected = false;
      accessibleOptions.checked = false;
      AccessibilityModule.register({
        displayObject: cjsTreeItem,
        parent: cjsTree,
        role: AccessibilityModule.ROLES.TREEITEM,
        accessibleOptions,
      });
      stage.accessibilityTranslator.update();

      treeItemEl = parentEl.querySelector(`#${cjsTreeItem.accessible.domId}`);
    });

    describe('rendering', () => {
      it('creates tree item element', () => {
        expect(treeItemEl).not.toBeUndefined();
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
      it('can dispatch "keyboardClick" event if Enter key is pressed', () => {
        const onKeyboardClick = jest.fn();
        cjsTreeItem.on('keyboardClick', onKeyboardClick);
        const keyCode = KeyCodes.enter;
        ReactTestUtils.Simulate.keyDown(treeItemEl, {
          keyCode,
          cancelable: true,
        });
        expect(onKeyboardClick).toBeCalledTimes(1);
      });

      it('does not dispatch "keyboardClick" event if enableKeyEvents is true and preventDefault is called', () => {
        const onKeyboardClick = jest.fn();
        cjsTreeItem.accessible.enableKeyEvents = true;
        cjsTreeItem.on('keyboardClick', onKeyboardClick);
        const keyCode = KeyCodes.enter;
        ReactTestUtils.Simulate.keyDown(treeItemEl, {
          keyCode,
          defaultPrevented: true,
        });
        expect(onKeyboardClick).toBeCalledTimes(0);
      });

      it('can dispatch "keyboardClick" event if enableKeyEvents is true and preventDefault is not called', () => {
        const onKeyboardClick = jest.fn();
        cjsTreeItem.accessible.enableKeyEvents = true;
        cjsTreeItem.on('keyboardClick', onKeyboardClick);
        const keyCode = KeyCodes.enter;
        ReactTestUtils.Simulate.keyDown(treeItemEl, {
          keyCode,
          defaultPrevented: false,
        });
        expect(onKeyboardClick).toBeCalledTimes(1);
      });

      it('does not dispatch "keyboardClick" event if enter key is not pressed', () => {
        const onKeyboardClick = jest.fn();
        cjsTreeItem.on('keyboardClick', onKeyboardClick);
        const keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(treeItemEl, { keyCode });
        expect(onKeyboardClick).toBeCalledTimes(0);
      });
    });
  });
});
