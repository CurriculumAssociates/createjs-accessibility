import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('ComboBoxData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsComboBox;
    let comboBoxEl;
    let isExpanded;
    let isReadOnly;
    let isRequired;
    let shouldAutoComplete;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsComboBox = new createjs.Shape(); // dummy object
      isExpanded = false;
      isReadOnly = false;
      isRequired = false;
      shouldAutoComplete = true;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

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
    });

    describe('rendering', () => {
      it('creates div[role=combobox] element', () => {
        comboBoxEl = parentEl.querySelector('div[role=combobox]');
        expect(comboBoxEl).not.toBeNull();
      });

      it('sets \'aria-expanded\' attribute', () => {
        comboBoxEl = parentEl.querySelector(`div[role=combobox][aria-expanded='${isExpanded}']`);
        expect(comboBoxEl).not.toBeNull();
      });

      it('sets \'aria-readonly\' attribute', () => {
        comboBoxEl = parentEl.querySelector(`div[role=combobox][aria-readonly='${isReadOnly}']`);
        expect(comboBoxEl).not.toBeNull();
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set \'expanded\' property [for \'aria-expanded\']', () => {
        expect(cjsComboBox.accessible.expanded).toEqual(isExpanded);

        const newVal = true;
        cjsComboBox.accessible.expanded = newVal;
        expect(cjsComboBox.accessible.expanded).toEqual(newVal);
      });

      it('can read and set \'readOnly\' property [for \'aria-readonly\']', () => {
        expect(cjsComboBox.accessible.readOnly).toEqual(isReadOnly);

        const newVal = true;
        cjsComboBox.accessible.readOnly = newVal;
        expect(cjsComboBox.accessible.readOnly).toEqual(newVal);
      });

      it('can read and set \'required\' property [for \'aria-required\']', () => {
        expect(cjsComboBox.accessible.required).toEqual(isRequired);

        const newVal = true;
        cjsComboBox.accessible.required = newVal;
        expect(cjsComboBox.accessible.required).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set \'autoComplete\' property', () => {
        expect(cjsComboBox.accessible.autoComplete).toEqual(shouldAutoComplete);

        const newVal = false;
        cjsComboBox.accessible.autoComplete = newVal;
        expect(cjsComboBox.accessible.autoComplete).toEqual(newVal);
      });
    });
  });
});
