import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

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

    describe('onKeyDown event listener', () => {
      let scrollListener;
      let prevValue;
      beforeEach(() => {
        scrollListener = jest.fn();
        cjsScrollBar.on('scroll', scrollListener);
        prevValue = cjsScrollBar.accessible.value;
      });
      it('can emit "scroll" event when orientation is "horizontal" and "left" key is pressed', () => {
        const keyCode = KeyCodes.left;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).toBeCalledTimes(1);
        const eventData = scrollListener.mock.calls[0][0];
        expect(eventData.scrollLeft).toBeLessThan(prevValue);
      });

      it('can emit "scroll" event when orientation is "horizontal" and "right" key is pressed', () => {
        const keyCode = KeyCodes.right;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).toBeCalledTimes(1);
        const eventData = scrollListener.mock.calls[0][0];
        expect(eventData.scrollLeft).toBeGreaterThan(prevValue);
      });

      it('can emit "scroll" event when orientation is "vertical" and "up" key is pressed', () => {
        cjsScrollBar.accessible.orientation = 'vertical';
        const keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).toBeCalledTimes(1);
        const eventData = scrollListener.mock.calls[0][0];
        expect(eventData.scrollTop).toBeLessThan(prevValue);
      });

      it('can emit "scroll" event when orientation is "vertical" and "down" key is pressed', () => {
        cjsScrollBar.accessible.orientation = 'vertical';
        const keyCode = KeyCodes.down;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).toBeCalledTimes(1);
        const eventData = scrollListener.mock.calls[0][0];
        expect(eventData.scrollTop).toBeGreaterThan(prevValue);
      });

      it('"keydown" events are not emitted if enableKeyEvents is false', () => {
        const keydownListener = jest.fn();
        cjsScrollBar.on('keydown', keydownListener);
        const keyCode = KeyCodes.left;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).toBeCalledTimes(1);
        expect(keydownListener).not.toBeCalled();
      });

      it('"keydown" events are emitted if enableKeyEvents is true', () => {
        const keydownListener = jest.fn();
        cjsScrollBar.accessible.enableKeyEvents = true;
        cjsScrollBar.on('keydown', keydownListener);
        const keyCode = KeyCodes.left;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).toBeCalledTimes(1);
        expect(keydownListener).toBeCalledTimes(1);
      });

      it('"scroll" events are not emitted if enableKeyEvents is true and default is prevented', () => {
        const keydownListener = jest.fn();
        cjsScrollBar.accessible.enableKeyEvents = true;
        cjsScrollBar.on('keydown', keydownListener);
        const keyCode = KeyCodes.left;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, {
          keyCode,
          defaultPrevented: true,
        });
        expect(scrollListener).not.toBeCalled();
        expect(keydownListener).toBeCalledTimes(1);
      });

      it('"scroll" event is not emitted if "up"/"down" keys are not pressed when orientation is "vertical"', () => {
        cjsScrollBar.accessible.orientation = 'vertical';
        const keyCode = KeyCodes.left;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).not.toBeCalled();
      });

      it('"scroll" event is not emitted if "left"/"right" keys are not pressed when orientation is "horizontal"', () => {
        cjsScrollBar.accessible.orientation = 'horizontal';
        const keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(scrollBarEl, { keyCode });
        expect(scrollListener).not.toBeCalled();
      });
    });
  });
});
