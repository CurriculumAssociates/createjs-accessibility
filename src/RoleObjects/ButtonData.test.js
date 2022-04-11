import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('ButtonData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsButton;
    let buttonEl;
    let isExpanded;
    let isPressed;
    let shouldAutoFocus;
    let isEnabled;
    let formVal;
    let formactionVal;
    let formenctypeVal;
    let formmethodVal;
    let shouldValidateForm;
    let formtargetVal;
    let nameVal;
    let typeVal;
    let valueVal;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsButton = new createjs.Shape(); // dummy object
      isExpanded = false;
      isPressed = false;
      shouldAutoFocus = true;
      isEnabled = false;
      formVal = 'form_id';
      formactionVal = 'formsubmit.php';
      formenctypeVal = 'text/plain';
      formmethodVal = 'get';
      shouldValidateForm = true;
      formtargetVal = '_blank';
      nameVal = 'btn_name';
      typeVal = 'button';
      valueVal = 7;

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
          pressed: isPressed,
          autoFocus: shouldAutoFocus,
          enabled: isEnabled,
          form: formVal,
          formaction: formactionVal,
          formenctype: formenctypeVal,
          formmethod: formmethodVal,
          formnovalidate: shouldValidateForm,
          formtarget: formtargetVal,
          name: nameVal,
          type: typeVal,
          value: valueVal,
        },
        displayObject: cjsButton,
        parent: container,
        role: AccessibilityModule.ROLES.BUTTON,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates button element', () => {
        buttonEl = parentEl.querySelector('button');
        expect(buttonEl).not.toBeNull();
      });

      it('sets "aria-expanded" attribute', () => {
        buttonEl = parentEl.querySelector(`button[aria-expanded='${isExpanded}']`);
        expect(buttonEl).not.toBeNull();
      });

      it('sets "aria-pressed" attribute', () => {
        buttonEl = parentEl.querySelector(`button[aria-pressed='${isPressed}']`);
        expect(buttonEl).not.toBeNull();
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "expanded" property [for "aria-expanded"]', () => {
        expect(cjsButton.accessible.expanded).toEqual(isExpanded);

        const newVal = true;
        cjsButton.accessible.expanded = newVal;
        expect(cjsButton.accessible.expanded).toEqual(newVal);
      });

      it('can read and set "pressed" property [for "aria-pressed"]', () => {
        expect(cjsButton.accessible.pressed).toEqual(isPressed);

        const newVal = true;
        cjsButton.accessible.pressed = newVal;
        expect(cjsButton.accessible.pressed).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "autoFocus" property', () => {
        expect(cjsButton.accessible.autoFocus).toEqual(shouldAutoFocus);

        const newVal = false;
        cjsButton.accessible.autoFocus = newVal;
        expect(cjsButton.accessible.autoFocus).toEqual(newVal);
      });

      it('can read and set "enabled" property', () => {
        expect(cjsButton.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsButton.accessible.enabled = newVal;
        expect(cjsButton.accessible.enabled).toEqual(newVal);
      });

      it('can read and set "form" property', () => {
        expect(cjsButton.accessible.form).toEqual(formVal);

        const newVal = 'new';
        cjsButton.accessible.form = newVal;
        expect(cjsButton.accessible.form).toEqual(newVal);
      });

      it('can read and set "formaction" property', () => {
        expect(cjsButton.accessible.formaction).toEqual(formactionVal);

        const newVal = 'new.php';
        cjsButton.accessible.formaction = newVal;
        expect(cjsButton.accessible.formaction).toEqual(newVal);
      });

      it('can read and set "formenctype" property', () => {
        expect(cjsButton.accessible.formenctype).toEqual(formenctypeVal);

        const newVal = 'multipart/form-data';
        cjsButton.accessible.formenctype = newVal;
        expect(cjsButton.accessible.formenctype).toEqual(newVal);
      });

      it('can read and set "formmethod" property', () => {
        expect(cjsButton.accessible.formmethod).toEqual(formmethodVal);

        const newVal = 'post';
        cjsButton.accessible.formmethod = newVal;
        expect(cjsButton.accessible.formmethod).toEqual(newVal);
      });

      it('can read and set "formnovalidate" property', () => {
        expect(cjsButton.accessible.formnovalidate).toEqual(shouldValidateForm);

        const newVal = false;
        cjsButton.accessible.formnovalidate = newVal;
        expect(cjsButton.accessible.formnovalidate).toEqual(newVal);
      });

      it('can read and set "formtarget" property', () => {
        expect(cjsButton.accessible.formtarget).toEqual(formtargetVal);

        const newVal = '_new';
        cjsButton.accessible.formtarget = newVal;
        expect(cjsButton.accessible.formtarget).toEqual(newVal);
      });

      it('can read and set "name" property', () => {
        expect(cjsButton.accessible.name).toEqual(nameVal);

        const newVal = 'btn_new_name';
        cjsButton.accessible.name = newVal;
        expect(cjsButton.accessible.name).toEqual(newVal);
      });

      it('can read and set "type" property', () => {
        expect(cjsButton.accessible.type).toEqual(typeVal);

        const newVal = 'submit';
        cjsButton.accessible.type = newVal;
        expect(cjsButton.accessible.type).toEqual(newVal);
      });

      it('can read and set "value" property', () => {
        expect(cjsButton.accessible.value).toEqual(valueVal);

        const newVal = 99;
        cjsButton.accessible.value = newVal;
        expect(cjsButton.accessible.value).toEqual(newVal);
      });
    });
  });
});
