import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('MultiSelectListBoxData', () => {
  describe('register role', () => {
    let cjsListBox;
    let cjsSpan;
    let selectEl;
    let shouldAutoFocus;
    let shouldEnableKeyEvents;
    let isEnabled;
    let isRequired;
    let nameVal;
    let sizeVal;

    beforeEach(() => {
      cjsListBox = new createjs.Shape(); // dummy object
      cjsSpan = new createjs.Shape(); // dummy child object
      shouldAutoFocus = true;
      shouldEnableKeyEvents = false;
      isEnabled = false;
      nameVal = 'list_name';
      sizeVal = 99;

      AccessibilityModule.register({
        accessibleOptions: {
          autoFocus: shouldAutoFocus,
          enabled: isEnabled,
          enableKeyEvents: shouldEnableKeyEvents,
          name: nameVal,
          required: isRequired,
          size: sizeVal,
        },
        displayObject: cjsListBox,
        parent: container,
        role: AccessibilityModule.ROLES.MULTISELECTLISTBOX,
      });

      AccessibilityModule.register({
        displayObject: cjsSpan,
        role: AccessibilityModule.ROLES.SPAN,
      });

      stage.accessibilityTranslator.update();
      selectEl = parentEl.querySelector('select');
    });

    describe('rendering', () => {
      it('creates select element', () => {
        expect(selectEl).not.toBeNull();
      });

      it('sets "aria-disabled" attribute', () => {
        selectEl = parentEl.querySelector(
          `select[aria-disabled='${!isEnabled}']`
        );
        expect(selectEl).not.toBeNull();
      });

      it('sets "name" attribute', () => {
        expect(selectEl.getAttribute('name')).toEqual(nameVal);
      });
    });

    describe('children checking', () => {
      describe('prohibited children', () => {
        let errorObj;

        beforeEach(() => {
          errorObj =
            /Children of multiselectlistbox must have a role of multiselectoption/;
          stage.accessibilityTranslator.update();
        });

        it('throws error attempting to add prohibited child using addChild() ', () => {
          expect(() => {
            cjsListBox.accessible.addChild(cjsSpan);
          }).toThrowError(errorObj);
        });

        it('throws error attempting to add prohibited child using addChildAt()', () => {
          expect(() => {
            cjsListBox.accessible.addChildAt(cjsSpan, 0);
          }).toThrowError(errorObj);
        });
      });

      describe('permitted children', () => {
        let cjsDummy;

        beforeEach(() => {
          cjsDummy = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.MULTISELECTOPTION,
          });
          stage.accessibilityTranslator.update();
        });

        it('throws NO error when adding permitted child using addChild', () => {
          expect(() => {
            cjsListBox.accessible.addChild(cjsDummy);
          }).not.toThrowError();
        });

        it('throws NO error when adding permitted child using addChildAt()', () => {
          expect(() => {
            cjsListBox.accessible.addChildAt(cjsDummy, 0);
          }).not.toThrowError();
        });
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "enabled" property [for "aria-disabled"]', () => {
        expect(cjsListBox.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsListBox.accessible.enabled = newVal;
        expect(cjsListBox.accessible.enabled).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "autoFocus" property', () => {
        expect(cjsListBox.accessible.autoFocus).toEqual(shouldAutoFocus);

        const newVal = false;
        cjsListBox.accessible.autoFocus = newVal;
        expect(cjsListBox.accessible.autoFocus).toEqual(newVal);
      });

      it('can read and set "enabled" property', () => {
        expect(cjsListBox.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsListBox.accessible.enabled = newVal;
        expect(cjsListBox.accessible.enabled).toEqual(newVal);
      });

      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsListBox.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = true;
        cjsListBox.accessible.enableKeyEvents = newVal;
        expect(cjsListBox.accessible.enableKeyEvents).toEqual(newVal);
      });

      it('can read, set and clear "form" property with valid argument role', () => {
        const cjsForm = new createjs.Shape();
        AccessibilityModule.register({
          displayObject: cjsForm,
          role: AccessibilityModule.ROLES.FORM,
        });

        cjsListBox.accessible.form = cjsForm;
        expect(cjsListBox.accessible.form).toEqual(cjsForm);
        expect(cjsListBox.accessible.formDomId).toMatch(/^acc_?/);

        cjsListBox.accessible.form = null;
        expect(cjsListBox.accessible.form).toEqual(null);
        expect(cjsListBox.accessible.formDomId).toEqual(undefined);
      });

      it('throws error when assigning invalid "form" property', () => {
        const cjsDummy = new createjs.Shape();
        const errorObj =
          /The form property of a multiselectlistbox must be a DisplayObject with a role of form/;
        AccessibilityModule.register({
          displayObject: cjsDummy,
          role: AccessibilityModule.ROLES.SPAN,
        });

        expect(() => {
          cjsListBox.accessible.form = cjsDummy;
        }).toThrowError(errorObj);
      });

      it('can read and set "name" property', () => {
        expect(cjsListBox.accessible.name).toEqual(nameVal);

        const newVal = 'list_new_name';
        cjsListBox.accessible.name = newVal;
        expect(cjsListBox.accessible.name).toEqual(newVal);
      });

      it('can read and set "required" property', () => {
        expect(cjsListBox.accessible.required).toEqual(isRequired);

        const newVal = false;
        cjsListBox.accessible.required = newVal;
        expect(cjsListBox.accessible.required).toEqual(newVal);
      });

      describe('can read and set "selected" property', () => {
        let cjsListItem;
        let cjsDummy;

        beforeEach(() => {
          cjsListItem = new createjs.Shape();
          cjsDummy = new createjs.Shape();

          AccessibilityModule.register({
            displayObject: cjsListItem,
            role: AccessibilityModule.ROLES.MULTISELECTOPTION,
          });

          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.SPAN,
          });
        });

        it('with valid displayObject role and value', () => {
          const selectedVal = -1;
          cjsListItem.accessible.value = selectedVal;
          cjsListBox.accessible.selected = [cjsListItem];

          expect(cjsListBox.accessible.selected).toEqual([cjsListItem]);
          expect(cjsListBox.accessible.selectedValue).toEqual([selectedVal]);
        });

        it('throws error with INVALID displayObject role', () => {
          expect(() => {
            cjsListBox.accessible.selected = [cjsDummy];
          }).toThrowError(
            /Selected value must have a role of multiselectoption/
          );
        });

        it('throws error with valid displayObject role and INVALID value', () => {
          cjsListItem.accessible.value = null;
          expect(() => {
            cjsListBox.accessible.selected = [cjsListItem];
          }).toThrowError(
            /The selected option must have its value field populated/
          );
        });
      });

      it('can read and set "size" property', () => {
        expect(cjsListBox.accessible.size).toEqual(sizeVal);

        const newVal = -1;
        cjsListBox.accessible.size = newVal;
        expect(cjsListBox.accessible.size).toEqual(newVal);
      });
    });

    describe('"onChange" event listener', () => {
      let keyDownHandler;
      let cjsOption1;

      beforeEach(() => {
        keyDownHandler = jest.fn();
        cjsListBox.on('valueChanged', keyDownHandler);
        cjsOption1 = new createjs.Shape();
        AccessibilityModule.register({
          accessibleOptions: {
            text: 'option1',
            value: '999',
          },
          displayObject: cjsOption1,
          role: AccessibilityModule.ROLES.MULTISELECTOPTION,
        });
        cjsListBox.accessible.addChild(cjsOption1);
        stage.accessibilityTranslator.update();
        cjsOption1.selected = true;
        cjsOption1.value = '999';
      });

      it('can dispatch "valueChanged" event with the newValue', () => {
        cjsListBox.selected = [cjsOption1];
        ReactTestUtils.Simulate.change(selectEl, {
          target: { options: [cjsOption1] },
        });

        expect(keyDownHandler).toBeCalledTimes(1);
        const argument = keyDownHandler.mock.calls[0][0];
        expect(argument.selectedValues).toStrictEqual([cjsOption1.value]);
      });
    });
  });
});
