import * as createjs from 'createjs-module';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('TabListData', () => {
  describe('register role', () => {
    let cjsTabList;
    let divEl;
    let shouldEnableKeyEvents;
    let levelVal;
    let isMultiselectable;
    let orientationVal;

    beforeEach(() => {
      cjsTabList = new createjs.Shape(); // dummy object
      shouldEnableKeyEvents = false;
      levelVal = 99;
      isMultiselectable = false;
      orientationVal = 'horizontal';

      AccessibilityModule.register({
        accessibleOptions: {
          enableKeyEvents: shouldEnableKeyEvents,
          level: levelVal,
          multiselectable: isMultiselectable,
          orientation: orientationVal,
        },
        displayObject: cjsTabList,
        parent: container,
        role: AccessibilityModule.ROLES.TABLIST,
      });

      stage.accessibilityTranslator.update();
      divEl = parentEl.querySelector('div[role=tablist]');
    });

    describe('rendering', () => {
      it('creates div[role=tablist] element', () => {
        expect(divEl).not.toBeNull();
      });

      it('sets "aria-level" attribute', () => {
        expect(parseInt(divEl.getAttribute('aria-level'), 10)).toEqual(
          levelVal
        );
      });

      it('sets "aria-multiselectable" attribute', () => {
        const ariaMultiselectable =
          divEl.getAttribute('aria-multiselectable') === 'true';
        expect(ariaMultiselectable).toEqual(isMultiselectable);
      });

      it('sets "aria-orientation" attribute', () => {
        expect(divEl.getAttribute('aria-orientation')).toEqual(orientationVal);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "level" property [for "aria-level"]', () => {
        expect(cjsTabList.accessible.level).toEqual(levelVal);

        const newVal = -1;
        cjsTabList.accessible.level = newVal;
        expect(cjsTabList.accessible.level).toEqual(newVal);
      });

      it('can read and set "multiselectable" property [for "aria-multiselectable"]', () => {
        expect(cjsTabList.accessible.multiselectable).toEqual(
          isMultiselectable
        );

        const newVal = true;
        cjsTabList.accessible.multiselectable = newVal;
        expect(cjsTabList.accessible.multiselectable).toEqual(newVal);
      });

      it('can read and set "orientation" property [for "aria-orientation"]', () => {
        expect(cjsTabList.accessible.orientation).toEqual(orientationVal);

        const newVal = 'vertical';
        cjsTabList.accessible.orientation = newVal;
        expect(cjsTabList.accessible.orientation).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsTabList.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = true;
        cjsTabList.accessible.enableKeyEvents = newVal;
        expect(cjsTabList.accessible.enableKeyEvents).toEqual(newVal);
      });
    });

    describe('"onKeyDown" event listener', () => {
      let keyCode;
      let onKeyDown;

      beforeEach(() => {
        onKeyDown = jest.fn();
        cjsTabList.on('keydown', onKeyDown);
      });

      it('can dispatch "keyDown" event if "enableKeyEvents" is enabled', () => {
        keyCode = KeyCodes.down;
        divEl.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
        expect(onKeyDown).toBeCalledTimes(0);

        cjsTabList.accessible.enableKeyEvents = true;

        divEl.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
        expect(onKeyDown).toBeCalledTimes(1);
      });

      it('can prevent default events if "defaultPrevented" is true', () => {
        keyCode = KeyCodes.down;
        cjsTabList.accessible.enableKeyEvents = true;
        const keydownEvent = new KeyboardEvent('keydown', { keyCode });
        Object.defineProperty(keydownEvent, 'defaultPrevented', {
          value: true,
        });
        divEl.dispatchEvent(keydownEvent);
        expect(onKeyDown).toBeCalledTimes(1);
      });

      describe('can change active/selected child when proper key is pressed', () => {
        let cjsListItem1; // dummy child object
        let cjsListItem2; // dummy child object

        beforeEach(() => {
          cjsListItem1 = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsListItem1,
            role: AccessibilityModule.ROLES.SPAN,
          });
          cjsTabList.accessible.addChild(cjsListItem1);

          cjsListItem2 = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsListItem2,
            role: AccessibilityModule.ROLES.SPAN,
          });
          cjsTabList.accessible.addChild(cjsListItem2);

          stage.accessibilityTranslator.update();

          cjsTabList.accessible.selected = cjsListItem2;
          cjsTabList.accessible.enableKeyEvents = true;
        });

        it('UP AND DOWN', () => {
          cjsTabList.accessible.orientation = 'vertical';

          keyCode = KeyCodes.up;
          divEl.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
          expect(onKeyDown).toBeCalledTimes(1);

          keyCode = KeyCodes.down;
          divEl.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
          expect(onKeyDown).toBeCalledTimes(2);
        });

        it('LEFT AND RIGHT', () => {
          keyCode = KeyCodes.left;
          divEl.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
          expect(onKeyDown).toBeCalledTimes(1);

          keyCode = KeyCodes.right;
          divEl.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
          expect(onKeyDown).toBeCalledTimes(2);
        });
      });
    });
  });
});
