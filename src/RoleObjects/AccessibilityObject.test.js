import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('AccessibilityObject', () => {
  describe('register role', () => {
    let accessibleOptions;
    let mainEl;
    let shouldEnableKeyEvents;

    beforeEach(() => {
      shouldEnableKeyEvents = true;
      accessibleOptions = {
        enableKeyEvents: shouldEnableKeyEvents,
        accessKey: 'M',
        atomic: true,
        busy: true,
        dir: 'rtl',
        dropEffects: 'move',
        grabbed: true,
        hasPopUp: 'tree',
        hidden: true,
        invalid: 'spelling',
        label: 'my_label',
        lang: 'en',
        live: 'polite',
        relevant: 'text',
        spellcheck: true,
        tabIndex: -1,
        title: 'my_title',
        visible: true,
      };

      //  set init props and re-render
      Object.keys(accessibleOptions).forEach((key) => {
        container.accessible[key] = accessibleOptions[key];
      });
      stage.accessibilityTranslator.update();

      mainEl = parentEl.querySelector(
        `main[aria-atomic=${accessibleOptions.atomic}]` +
          `[aria-busy=${accessibleOptions.busy}]` +
          `[dir=${accessibleOptions.dir}]` +
          `[aria-dropeffect=${accessibleOptions.dropEffects}]` +
          `[aria-grabbed=${accessibleOptions.grabbed}]` +
          `[aria-haspopup=${accessibleOptions.hasPopUp}]` +
          `[aria-hidden=${accessibleOptions.hidden}]` +
          `[aria-invalid=${accessibleOptions.invalid}]` +
          `[aria-label=${accessibleOptions.label}]` +
          `[lang=${accessibleOptions.lang}]` +
          `[aria-live=${accessibleOptions.live}]` +
          `[aria-relevant=${accessibleOptions.relevant}]` +
          `[spellcheck=${accessibleOptions.spellcheck}]` +
          `[tabindex=${accessibleOptions.tabIndex}]` +
          `[title=${accessibleOptions.title}]`
      );
      console.log(mainEl.outerHTML);
    });

    describe('rendering', () => {
      it('creates main element', () => {
        expect(mainEl).not.toBeNull();
      });
    });

    describe('children checking', () => {
      describe('prohibited children', () => {
        let errorObj;

        beforeEach(() => {
          errorObj =
            /DisplayObjects added to the accessibility tree must have accessibility information when being added to the tree/;
          stage.accessibilityTranslator.update();
        });

        it('throws error attempting to add prohibited child using addChild() ', () => {
          expect(() => {
            container.accessible.addChild({});
          }).toThrowError(errorObj);
        });

        it('throws error attempting to add prohibited child using addChildAt()', () => {
          expect(() => {
            container.accessible.addChildAt({}, 0);
          }).toThrowError(errorObj);
        });
      });

      describe('permitted children', () => {
        let cjsDummy;

        beforeEach(() => {
          cjsDummy = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.SPAN,
          });
          stage.accessibilityTranslator.update();
        });

        it('throws NO error when adding permitted child using addChild', () => {
          expect(() => {
            container.accessible.addChild(cjsDummy, 0);
          }).not.toThrowError();
        });

        it('throws NO error when adding permitted child using addChildAt()', () => {
          expect(() => {
            container.accessible.addChildAt(cjsDummy, 0);
          }).not.toThrowError();
        });

        it('can remove all children', () => {
          container.accessible.addChild(cjsDummy, 0);
          expect(container.accessible.children.length).toEqual(1);

          container.accessible.removeAllChildren();
          expect(container.accessible.children.length).toEqual(0);
          expect(container.accessible.children).toEqual([]);
        });

        it('can reparent', () => {
          container.accessible.addChild(cjsDummy, 0);
          expect(container.accessible.children.length).toEqual(1);
          container.accessible.addChild(cjsDummy, 0);
          expect(container.accessible.children).toEqual([cjsDummy]);
          container.accessible.addChildAt(cjsDummy, 0);
          expect(container.accessible.children).toEqual([cjsDummy]);
        });
      });
    });

    describe('accessible options getters and setters', () => {
      [
        { property: 'atomic', ariaAttr: 'aria-atomic', newVal: false },
        { property: 'busy', ariaAttr: 'aria-busy', newVal: false },
        {
          property: 'dropEffects',
          ariaAttr: 'aria-dropeffect',
          newVal: 'copy',
        },
        { property: 'grabbed', ariaAttr: 'aria-grabbed', newVal: 'listbox' },
        { property: 'hasPopUp', ariaAttr: 'aria-haspopup', newVal: 'listbox' },
        { property: 'hidden', ariaAttr: 'aria-hidden', newVal: false },
        { property: 'invalid', ariaAttr: 'aria-invalid', newVal: 'grammar' },
        { property: 'label', ariaAttr: 'aria-label', newVal: 'new_label' },
        { property: 'live', ariaAttr: 'aria-live', newVal: 'assertive' },
        { property: 'relevant', ariaAttr: 'aria-relevant', newVal: 'all' },
      ].forEach(({ property, ariaAttr, newVal }) => {
        it(`can set and read "${property}" property [for "${ariaAttr}"]`, () => {
          expect(container.accessible[property]).toBe(
            accessibleOptions[property]
          );
          container.accessible[property] = newVal;
          expect(container.accessible[property]).toBe(newVal);
        });
      });
    });

    describe('other options getters and setters', () => {
      [
        { property: 'accessKey', newVal: 'V' },
        { property: 'dir', newVal: 'ltr' },
        { property: 'lang', newVal: 'es' },
        { property: 'spellcheck', newVal: false },
        { property: 'tabIndex', newVal: 0 },
        { property: 'title', newVal: 'new_title' },
        { property: 'visible', newVal: false },
      ].forEach(({ property, newVal }) => {
        it(`can set and read "${property}" property`, () => {
          expect(container.accessible[property]).toBe(
            accessibleOptions[property]
          );
          container.accessible[property] = newVal;
          expect(container.accessible[property]).toBe(newVal);
        });
      });

      it('can read and set "enableKeyEvents" property', () => {
        expect(container.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = false;
        container.accessible.enableKeyEvents = newVal;
        expect(container.accessible.enableKeyEvents).toEqual(newVal);
      });
    });

    describe('event listeners', () => {
      it('Accessibility Object should provide event and keycode with the event', () => {
        const keyDownListener = jest.fn();
        container.on('keydown', keyDownListener);

        [
          ['Enter', 13],
          ['a', 65],
          ['t', 84],
          ['Tab', 9],
        ].forEach(([key, keyCode], i) => {
          ReactTestUtils.Simulate.keyDown(mainEl, { key, keyCode });
          const keyDownReturn = keyDownListener.mock.calls[i][0];
          const keyReturned = keyDownReturn.key;
          const keyCodeReturned = keyDownReturn.keyCode;

          expect(keyReturned).toBe(key);
          expect(keyCodeReturned).toBe(keyCode);
        });
      });

      it('can request focus', () => {
        jest.spyOn(mainEl, 'focus');
        document.getElementById = (query) => {
          return parentEl.querySelector(`#${query}`);
        };

        mainEl.setAttribute('disabled', true);
        mainEl.removeAttribute('tabindex');
        container.accessible.enabled = true;
        container.accessible.requestFocus();
        expect(mainEl.focus).toHaveBeenCalled();
      });

      describe('"onKeyUp" event listener', () => {
        let onKeyUp;

        beforeEach(() => {
          onKeyUp = jest.fn();
          container.on('keyup', onKeyUp);
          // createjs.Event = (arg1, arg2, arg3) => {
          //   console.log('arg1', arg1, 'arg2', arg2, 'arg3', arg3);
          //   function handleKeyUp(event) {
          //     console.log('event happened', event)
          //   }
          //   return container.addEventListener("keyup", handleKeyUp);
          //   // return 'blah';
          // };
        });

        it('can dispatch "keyUp" event', () => {
          const keyCode = KeyCodes.up;
          ReactTestUtils.Simulate.keyUp(mainEl, { keyCode, cancelable: true });
          expect(onKeyUp).toBeCalledTimes(1);

          const keyCodeReturned = onKeyUp.mock.calls[0][0].keyCode;
          expect(keyCodeReturned).toBe(keyCode);
        });
      });
    });
  });
});
