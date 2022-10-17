import * as createjs from 'createjs-module';
import AccessibilityModule from '../../src/index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('FormData', () => {
  describe('register role', () => {
    let cjsForm;
    let formEl;
    let actionVal;
    let shouldAutoComplete;
    let charSetVal;
    let enctypeVal;
    let methodVal;
    let nameVal;
    let targetVal;

    beforeEach(() => {
      cjsForm = new createjs.Shape(); // dummy object
      actionVal = 'formsubmit.php';
      shouldAutoComplete = false;
      charSetVal = 'utf-8';
      enctypeVal = 'text/plain';
      methodVal = 'get';
      nameVal = 'form_name';
      targetVal = '_blank';

      AccessibilityModule.register({
        accessibleOptions: {
          action: actionVal,
          autoComplete: shouldAutoComplete,
          charSet: charSetVal,
          enctype: enctypeVal,
          method: methodVal,
          name: nameVal,
          target: targetVal,
        },
        displayObject: cjsForm,
        parent: container,
        role: AccessibilityModule.ROLES.FORM,
      });

      stage.accessibilityTranslator.update();
      formEl = parentEl.querySelector('form');
    });

    describe('rendering', () => {
      it('creates form element', () => {
        expect(formEl).not.toBeNull();
      });

      it('sets "action" attribute', () => {
        expect(formEl.getAttribute('action')).toEqual(actionVal);
      });

      it('sets "autocomplete" attribute', () => {
        const shouldAutoCompleteParsed = shouldAutoComplete ? 'on' : 'off'; // parsed by the setter
        expect(formEl.getAttribute('autocomplete')).toEqual(
          shouldAutoCompleteParsed
        );
      });

      it('sets "accept-charset" attribute', () => {
        expect(formEl.getAttribute('accept-charset')).toEqual(charSetVal);
      });

      it('sets "enctype" attribute', () => {
        expect(formEl.enctype).toEqual(enctypeVal);
      });

      it('sets "method" attribute', () => {
        expect(formEl.method).toEqual(methodVal);
      });

      it('sets "name" attribute', () => {
        expect(formEl.name).toEqual(nameVal);
      });

      it('sets "target" attribute', () => {
        expect(formEl.target).toEqual(targetVal);
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "action" property', () => {
        expect(cjsForm.accessible.action).toEqual(actionVal);

        const newVal = 'new.php';
        cjsForm.accessible.action = newVal;
        expect(cjsForm.accessible.action).toEqual(newVal);
      });

      it('can read and set "autoComplete" property', () => {
        expect(cjsForm.accessible.autoComplete).toEqual(shouldAutoComplete);

        const newVal = false;
        cjsForm.accessible.autoComplete = newVal;
        expect(cjsForm.accessible.autoComplete).toEqual(newVal);
      });

      it('can read and set "charSet" property', () => {
        expect(cjsForm.accessible.charSet).toEqual(charSetVal);

        const newVal = 'iso-8859-1';
        cjsForm.accessible.charSet = newVal;
        expect(cjsForm.accessible.charSet).toEqual(newVal);
      });

      it('can read and set "enctype" property', () => {
        expect(cjsForm.accessible.enctype).toEqual(enctypeVal);

        const newVal = 'multipart/form-data';
        cjsForm.accessible.enctype = newVal;
        expect(cjsForm.accessible.enctype).toEqual(newVal);
      });

      it('can read and set "method" property', () => {
        expect(cjsForm.accessible.method).toEqual(methodVal);

        const newVal = 'post';
        cjsForm.accessible.method = newVal;
        expect(cjsForm.accessible.method).toEqual(newVal);
      });

      it('can read and set "name" property', () => {
        expect(cjsForm.accessible.name).toEqual(nameVal);

        const newVal = 'btn_new_name';
        cjsForm.accessible.name = newVal;
        expect(cjsForm.accessible.name).toEqual(newVal);
      });

      it('can read and set "target" property', () => {
        expect(cjsForm.accessible.target).toEqual(targetVal);

        const newVal = '_new';
        cjsForm.accessible.target = newVal;
        expect(cjsForm.accessible.target).toEqual(newVal);
      });
    });
  });
});
