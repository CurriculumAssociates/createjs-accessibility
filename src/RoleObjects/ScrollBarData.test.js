import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('ScrollBarData', () => {
  describe('register role', () => {
    let cjsScrollBar;
    let scrollBarEl;
    let orientationVal;
    let shouldEnableKeyEvents;

    beforeEach(() => {
      cjsScrollBar = new createjs.Shape(); // dummy object
      orientationVal = 'horizontal';
      shouldEnableKeyEvents = false;

      AccessibilityModule.register({
        accessibleOptions: {
          enableKeyEvents: shouldEnableKeyEvents,
          orientation: orientationVal,
        },
        displayObject: cjsScrollBar,
        parent: container,
        role: AccessibilityModule.ROLES.SCROLLBAR,
      });

      stage.accessibilityTranslator.update();

      scrollBarEl = parentEl.querySelector('div[role=scrollbar]');
    });

    describe('rendering', () => {
      it('creates div[role=scrollbar] element', () => {
        expect(scrollBarEl).not.toBeNull();
      });

      it('sets "aria-orientation" attribute', () => {
        expect(scrollBarEl.getAttribute('aria-orientation')).toEqual(
          orientationVal
        );
      });

      describe('superclass defaults', () => {
        it('sets "aria-valuemax" attribute', () => {
          expect(scrollBarEl.getAttribute('aria-valuemax')).toEqual('100');
        });

        it('sets "aria-valuemin" attribute', () => {
          expect(scrollBarEl.getAttribute('aria-valuemin')).toEqual('0');
        });

        it('sets "aria-valuenow" attribute', () => {
          expect(scrollBarEl.getAttribute('aria-valuenow')).toEqual('50');
        });
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "orientation" property [for "aria-orientation"]', () => {
        expect(cjsScrollBar.accessible.orientation).toEqual(orientationVal);

        const newVal = 'vertical';
        cjsScrollBar.accessible.orientation = newVal;
        expect(cjsScrollBar.accessible.orientation).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsScrollBar.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = true;
        cjsScrollBar.accessible.enableKeyEvents = newVal;
        expect(cjsScrollBar.accessible.enableKeyEvents).toEqual(newVal);
      });
    });
  });
});
