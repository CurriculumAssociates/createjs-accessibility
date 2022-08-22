import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('TabData', () => {
  describe('register role', () => {
    let cjsTab;
    let divEl;
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
      divEl = parentEl.querySelector('div[role=tab]');
    });

    describe('rendering', () => {
      it('creates div[role=tab] element', () => {
        expect(divEl).not.toBeNull();
      });
    });

    describe('Accessible getters and setters', () => {
      it('can set and get "enableKeyEvents" property', () => {
        expect(cjsTab.accessible.enableKeyEvents).toBe(false);

        cjsTab.accessible.enableKeyEvents = true;
        expect(cjsTab.accessible.enableKeyEvents).toBe(true);
      });

      it('can set and get "size" property for "[aria-setsize]"', () => {
        expect(cjsTab.accessible.size).toBe(accessibleOptions.size);

        cjsTab.accessible.size = 2;
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.size).toBe(2);
        expect(+divEl.getAttribute('aria-setsize')).toBe(2);
      });

      it('can set and get "position" property for "[aria-posinset]"', () => {
        expect(cjsTab.accessible.position).toBe(accessibleOptions.position);

        cjsTab.accessible.position = 2;
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.position).toBe(2);
        expect(+divEl.getAttribute('aria-posinset')).toBe(2);
      });

      it('can set and get "controls" property for "[aria-controls]"', () => {
        expect(cjsTab.accessible.controls).toBe(accessibleOptions.controls);

        cjsTab.accessible.controls = 'tabpanel2';
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.controls).toBe('tabpanel2');
        expect(divEl.getAttribute('aria-controls')).toBe('tabpanel2');
      });

      it('can set and get "selected" property for "[aria-selected]"', () => {
        expect(cjsTab.accessible.selected).toBe(accessibleOptions.selected);

        cjsTab.accessible.selected = true;
        stage.accessibilityTranslator.update();
        expect(cjsTab.accessible.selected).toBe(true);
        expect(divEl.getAttribute('aria-selected')).toBe('true');
      });
    });

    describe('keydown event handlers', () => {
      let onKeyboardClick;
      beforeEach(() => {
        onKeyboardClick = jest.fn();
        cjsTab.on('keyboardClick', onKeyboardClick);
      });
      it('can dispatch "keyboardClick" event when Enter key is clicked', () => {
        const keyCode = KeyCodes.enter;
        ReactTestUtils.Simulate.keyDown(divEl, { keyCode });
        expect(onKeyboardClick).toBeCalledTimes(1);
      });

      it('can dispatch "keyboardClick" event when Space key is clicked', () => {
        const keyCode = KeyCodes.space;
        ReactTestUtils.Simulate.keyDown(divEl, { keyCode });
        expect(onKeyboardClick).toBeCalledTimes(1);
      });

      it('does not dispatch "keyboardClick" event Enter or Space key is not pressed', () => {
        const keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(divEl, { keyCode });
        expect(onKeyboardClick).not.toBeCalled();
      });

      describe('"enableKeyEvents" is true', () => {
        let onKeydown;
        beforeEach(() => {
          cjsTab.accessible.enableKeyEvents = true;
          onKeydown = jest.fn();
          cjsTab.on('keydown', onKeydown);
        });

        it('does not dispatch "keyboardClick" event when default is prevented', () => {
          const keyCode = KeyCodes.space;
          ReactTestUtils.Simulate.keyDown(divEl, {
            keyCode,
            defaultPrevented: true,
          });
          expect(onKeydown).toBeCalledTimes(1);
          expect(onKeyboardClick).not.toBeCalled();
        });

        it('can also dispatch "keydown" event enableKeyEvents is true and default is not prevented', () => {
          const keyCode = KeyCodes.space;
          ReactTestUtils.Simulate.keyDown(divEl, { keyCode });
          expect(onKeydown).toBeCalledTimes(1);
          expect(onKeyboardClick).toBeCalledTimes(1);
        });
      });
    });
  });
});
