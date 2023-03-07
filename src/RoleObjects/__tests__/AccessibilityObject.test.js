import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../../index';

describe('AccessibilityObject', () => {
  describe('register role', () => {
    let cjsDummy;
    let accessibleOptions;
    let mainEl;
    let shouldEnableKeyEvents;

    beforeEach(() => {
      cjsDummy = new createjs.Shape();
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
        beforeEach(() => {
          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.SPAN,
          });
          stage.accessibilityTranslator.update();
        });

        it('throws NO error when adding permitted child using addChild', () => {
          expect(() => {
            container.accessible.addChild(cjsDummy);
          }).not.toThrowError();
        });

        it('throws NO error when adding permitted child using addChildAt()', () => {
          expect(() => {
            container.accessible.addChildAt(cjsDummy, 0);
          }).not.toThrowError();
        });

        it('can remove all children', () => {
          container.accessible.addChild(cjsDummy);
          expect(container.accessible.children.length).toEqual(1);

          container.accessible.removeAllChildren();
          expect(container.accessible.children.length).toEqual(0);
          expect(container.accessible.children).toEqual([]);
        });

        it('can reparent', () => {
          container.accessible.addChild(cjsDummy);
          expect(container.accessible.children.length).toEqual(1);
          container.accessible.addChild(cjsDummy);
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

      it('can read "controlsId" property and read, set and clear "controls" property [for "aria-controls"]', () => {
        expect(() => {
          container.accessible.controls = cjsDummy;
        }).toThrowError(
          /DisplayObject being controlled by another must have accessibility information/
        );

        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.SPAN,
        });

        container.accessible.controls = cjsDummy;
        expect(container.accessible.controls).toEqual(cjsDummy);
        expect(container.accessible.controlsId).toMatch(/^acc_?/);

        container.accessible.controls = undefined;
        expect(container.accessible.controls).toEqual(undefined);
      });

      it('can read "describedById" property and read, set and clear "describedBy" property [for "aria-describedby"]', () => {
        expect(() => {
          container.accessible.describedBy = cjsDummy;
        }).toThrowError(
          /DisplayObject describing another must have accessibility information/
        );

        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.SPAN,
        });

        container.accessible.describedBy = cjsDummy;
        expect(container.accessible.describedBy).toEqual(cjsDummy);
        expect(container.accessible.describedById).toMatch(/^acc_?/);

        container.accessible.describedBy = undefined;
        expect(container.accessible.describedBy).toEqual(undefined);
      });

      it('can clear "enabled" property [for "aria-disabled"]', () => {
        container.accessible.enabled = undefined;
        expect(container.accessible.enabled).toEqual(undefined);
      });

      it('can read "flowToId" property and read, set and clear "flowTo" property [for "aria-flowto"]', () => {
        expect(() => {
          container.accessible.flowTo = cjsDummy;
        }).toThrowError(
          /DisplayObject to flow to must have accessibility information/
        );

        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.SPAN,
        });

        container.accessible.flowTo = cjsDummy;
        expect(container.accessible.flowTo).toEqual(cjsDummy);
        expect(container.accessible.flowToId).toMatch(/^acc_?/);

        container.accessible.flowTo = undefined;
        expect(container.accessible.flowTo).toEqual(undefined);
      });

      it('can read "labelledById" property and read, set and clear "labelledBy" property [for "aria-labelledby"]', () => {
        expect(() => {
          container.accessible.labelledBy = cjsDummy;
        }).toThrowError(
          /DisplayObjects used to label another DisplayObject must have accessibility information when being provided as a label/
        );

        expect(() => {
          container.accessible.labelledBy = container;
        }).toThrowError(/An object cannot be used as its own labelledBy/);

        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.SPAN,
        });

        container.accessible.labelledBy = cjsDummy;
        expect(container.accessible.labelledBy).toEqual(cjsDummy);
        expect(container.accessible.labelledById).toMatch(/^acc_?/);

        container.accessible.labelledBy = undefined;
        expect(container.accessible.labelledBy).toEqual(undefined);
      });

      it('can read "ownsIds" property and read, set and clear "owns" property [for "aria-owns"]', () => {
        expect(() => {
          container.accessible.owns = [cjsDummy];
        }).toThrowError(
          /DisplayObjects owned by another DisplayObject must have accessibility information/
        );

        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.SPAN,
        });

        container.accessible.owns = [cjsDummy];
        expect(container.accessible.owns).toEqual([cjsDummy]);
        expect(container.accessible.ownsIds).toMatch(/^ acc_?/);

        container.accessible.owns = undefined;
        expect(container.accessible.owns).toEqual(undefined);
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

      it('can read "displayObject" property', () => {
        expect(container.accessible.displayObject).toEqual(container);
      });

      it('can read "disabledWithInference" property', () => {
        const pressUp = jest.fn();
        container.accessible.enabled = true;
        expect(container.accessible.disabledWithInference).toEqual(false);

        container.accessible.enabled = undefined;
        container.mouseEnabled = false; // easeljs/createjs specific property
        container.on('pressup', pressUp);
        expect(container.accessible.disabledWithInference).toEqual(true);
      });

      it('can reset "hidden" property and read "hiddenWithInference" property', () => {
        container.accessible.hidden = undefined;
        expect(container.accessible.hidden).toEqual(undefined);
        container.visible = false;
        expect(container.accessible.hiddenWithInference).toEqual(true);
      });

      it('can read "parent" property', () => {
        expect(container.accessible.parent).toEqual(undefined);
      });

      it('can read "visibleWithInference" property', () => {
        container.accessible.visible = undefined;
        expect(container.accessible.visibleWithInference).toEqual(
          accessibleOptions.visible
        );
        container.accessible.visible = true;
        expect(container.accessible.visibleWithInference).toEqual(true);
        container.accessible.visible = false;
        expect(container.accessible.visibleWithInference).toEqual(false);
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
          mainEl.dispatchEvent(new KeyboardEvent('keydown', { key, keyCode }));
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

        mainEl.style.display = 'none';
        container.accessible.requestFocus();
        expect(mainEl.focus).toHaveBeenCalled();
      });

      describe('"onKeyUp" event listener', () => {
        let onKeyUp;

        beforeEach(() => {
          onKeyUp = jest.fn();
          container.on('keyup', onKeyUp);
        });

        it('can dispatch "keyUp" event', () => {
          const keyCode = KeyCodes.up;
          mainEl.dispatchEvent(
            new KeyboardEvent('keyup', { keyCode, cancelable: true })
          );
          expect(onKeyUp).toBeCalledTimes(1);

          const keyCodeReturned = onKeyUp.mock.calls[0][0].keyCode;
          expect(keyCodeReturned).toBe(keyCode);
        });
      });
    });
  });
});
