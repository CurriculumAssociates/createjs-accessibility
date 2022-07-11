import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TabData', () => {
  describe('register role', () => {
    let cjsTab;
    let tabEl;
    const accessibleOptions = {};

    beforeEach(() => {
      cjsTab = new createjs.Shape();
      accessibleOptions.size = 1;
      accessibleOptions.position = 1;
      accessibleOptions.controls = 'tabpanel1';
      accessibleOptions.selected = false;
      AccessibilityModule.register({
        displayObject: cjsTab,
        parent: container,
        role: AccessibilityModule.ROLES.TAB,
        accessibleOptions,
      });

      stage.accessibilityTranslator.update();
      tabEl = parentEl.querySelector(`#${cjsTab.accessible.domId}`);
    });

    describe('rendering', () => {
      it('creates tree element', () => {
        expect(tabEl).not.toBeUndefined();
      });
    });

    describe('Accessible getters and setters', () => {
      it('can set and get "enableKeyEvents" property', () => {
        expect(cjsTab.accessible.enableKeyEvents).toBe(false);

        cjsTab.accessible.enableKeyEvents = true;
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.enableKeyEvents).toBe(true);
      });

      it('can set and get "size" property', () => {
        expect(cjsTab.accessible.size).toBe(accessibleOptions.size);

        cjsTab.accessible.size = 2;
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.size).toBe(2);
      });

      it('can set and get "position" property', () => {
        expect(cjsTab.accessible.position).toBe(accessibleOptions.position);

        cjsTab.accessible.position = 2;
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.position).toBe(2);
      });

      it('can set and get "controls" property', () => {
        expect(cjsTab.accessible.controls).toBe(accessibleOptions.controls);

        cjsTab.accessible.controls = 'tabpanel2';
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.controls).toBe('tabpanel2');
      });

      it('can set and get "selected" property', () => {
        expect(cjsTab.accessible.selected).toBe(accessibleOptions.selected);

        cjsTab.accessible.selected = true;
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.selected).toBe(true);
      });
    });

    describe('keydown event handlers', () => {
      it('can dispatch "keyboardClick" event when Enter key is clicked', () => {
        const onKeydown = jest.fn();
        cjsTab.on('keyboardClick', onKeydown);

        const keyCode = KeyCodes.enter;
        ReactTestUtils.Simulate.keyDown(tabEl, { keyCode });
        expect(onKeydown).toBeCalledTimes(1);
      });

      it('can dispatch "keyboardClick" event when Space key is clicked', () => {
        const onKeydown = jest.fn();
        cjsTab.on('keyboardClick', onKeydown);

        const keyCode = KeyCodes.space;
        ReactTestUtils.Simulate.keyDown(tabEl, { keyCode });
        expect(onKeydown).toBeCalledTimes(1);
      });

      it('does not dispatch "keyboardClick" event Enter or Space key is not pressed', () => {
        const onKeydown = jest.fn();
        cjsTab.on('keyboardClick', onKeydown);

        const keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(tabEl, { keyCode });
        expect(onKeydown).not.toBeCalled();
      });

      it('does not dispatch "keyboardClick" event when default is prevented', () => {
        cjsTab.accessible.enableKeyEvents = true;
        const onKeydown = jest.fn();
        cjsTab.on('keyboardClick', onKeydown);

        const keyCode = KeyCodes.space;
        ReactTestUtils.Simulate.keyDown(tabEl, {
          keyCode,
          defaultPrevented: true,
        });
        expect(onKeydown).not.toBeCalled();
      });

      it('can also dispatch "keydown" event enableKeyEvents is true and default is not prevented', () => {
        const onKeydown = jest.fn();
        const onKeyboardClick = jest.fn();
        cjsTab.accessible.enableKeyEvents = true;
        cjsTab.on('keydown', onKeydown);
        cjsTab.on('keyboardClick', onKeyboardClick);

        const keyCode = KeyCodes.space;
        ReactTestUtils.Simulate.keyDown(tabEl, { keyCode });
        expect(onKeydown).toBeCalledTimes(1);
        expect(onKeyboardClick).toBeCalledTimes(1);
      });
    });
  });
});
