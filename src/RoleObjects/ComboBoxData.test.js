import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('ComboBoxData', () => {
  describe('register role', () => {
    let cjsComboBox;
    let comboBoxEl;
    let isExpanded;
    let isReadOnly;
    let isRequired;
    let shouldAutoComplete;

    beforeEach(() => {
      cjsComboBox = new createjs.Shape(); // dummy object
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

      stage.accessibilityTranslator.update();
      comboBoxEl = parentEl.querySelector('div[role=combobox]');
    });

    describe('rendering', () => {
      it('creates div[role=combobox] element', () => {
        expect(comboBoxEl).not.toBeNull();
      });

      it('sets "aria-expanded" attribute', () => {
        const ariaExpanded = comboBoxEl.getAttribute('aria-expanded') === 'true';
        expect(ariaExpanded).toEqual(isExpanded);
      });

      it('sets "aria-readonly" attribute', () => {
        const ariaReadOnly = comboBoxEl.getAttribute('aria-readonly') === 'true';
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
  });
});
