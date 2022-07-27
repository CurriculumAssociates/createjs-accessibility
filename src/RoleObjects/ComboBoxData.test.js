import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('ComboBoxData', () => {
  describe('register role', () => {
    let cjsComboBox;
    let cjsSpan;
    let comboBoxEl;
    let isExpanded;
    let isReadOnly;
    let isRequired;
    let shouldAutoComplete;

    beforeEach(() => {
      cjsComboBox = new createjs.Shape(); // dummy object
      cjsSpan = new createjs.Shape(); // dummy child object
      isExpanded = false;
      isReadOnly = false;
      isRequired = false;
      shouldAutoComplete = true;

      AccessibilityModule.register({
        accessibleOptions: {
          expanded: isExpanded,
          readOnly: isReadOnly,
          required: isRequired,
          autoComplete: shouldAutoComplete,
        },
        displayObject: cjsComboBox,
        parent: container,
        role: AccessibilityModule.ROLES.COMBOBOX,
      });

      AccessibilityModule.register({
        displayObject: cjsSpan,
        role: AccessibilityModule.ROLES.SPAN,
      });

      stage.accessibilityTranslator.update();
      comboBoxEl = parentEl.querySelector('div[role=combobox]');
    });

    describe('rendering', () => {
      it('creates div[role=combobox] element', () => {
        expect(comboBoxEl).not.toBeNull();
      });

      it('sets "aria-expanded" attribute', () => {
        const ariaExpanded =
          comboBoxEl.getAttribute('aria-expanded') === 'true';
        expect(ariaExpanded).toEqual(isExpanded);
      });

      it('sets "aria-readonly" attribute', () => {
        const ariaReadOnly =
          comboBoxEl.getAttribute('aria-readonly') === 'true';
        expect(ariaReadOnly).toEqual(isReadOnly);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "expanded" property [for "aria-expanded"]', () => {
        expect(cjsComboBox.accessible.expanded).toEqual(isExpanded);

        const newVal = true;
        cjsComboBox.accessible.expanded = newVal;
        expect(cjsComboBox.accessible.expanded).toEqual(newVal);
      });

      it('can read and set "readOnly" property [for "aria-readonly"]', () => {
        expect(cjsComboBox.accessible.readOnly).toEqual(isReadOnly);

        const newVal = true;
        cjsComboBox.accessible.readOnly = newVal;
        expect(cjsComboBox.accessible.readOnly).toEqual(newVal);
      });

      it('can read and set "required" property [for "aria-required"]', () => {
        expect(cjsComboBox.accessible.required).toEqual(isRequired);

        const newVal = true;
        cjsComboBox.accessible.required = newVal;
        expect(cjsComboBox.accessible.required).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "autoComplete" property', () => {
        expect(cjsComboBox.accessible.autoComplete).toEqual(shouldAutoComplete);

        const newVal = false;
        cjsComboBox.accessible.autoComplete = newVal;
        expect(cjsComboBox.accessible.autoComplete).toEqual(newVal);
      });
    });

    describe('children checking', () => {
      describe('prohibited children', () => {
        let errorObj;

        beforeEach(() => {
          errorObj =
            /Children of combobox must have a role of singlelinetextbox, search, button, singleselectlistbox, tree, grid, or dialog/;
          stage.accessibilityTranslator.update();
        });

        it('throws error attempting to add prohibited child using addChild() ', () => {
          expect(() => {
            cjsComboBox.accessible.addChild(cjsSpan);
          }).toThrowError(errorObj);
        });

        it('throws error attempting to add prohibited child using addChildAt()', () => {
          expect(() => {
            cjsComboBox.accessible.addChildAt(cjsSpan, 0);
          }).toThrowError(errorObj);
        });
      });

      describe('permitted children', () => {
        let cjsDummy;

        beforeEach(() => {
          cjsDummy = new createjs.Shape();
          AccessibilityModule.register({
            displayObject: cjsDummy,
            role: AccessibilityModule.ROLES.BUTTON,
          });
          stage.accessibilityTranslator.update();
        });

        it('throws NO error when adding permitted child using addChild', () => {
          expect(() => {
            cjsComboBox.accessible.addChild(cjsDummy, 0);
          }).not.toThrowError();
        });

        it('throws NO error when adding permitted child using addChildAt()', () => {
          expect(() => {
            cjsComboBox.accessible.addChildAt(cjsDummy, 0);
          }).not.toThrowError();
        });
      });
    });
  });
});
