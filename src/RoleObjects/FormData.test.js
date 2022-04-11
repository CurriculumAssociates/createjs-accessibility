import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('FormData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
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
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsForm = new createjs.Shape(); // dummy object
      actionVal = 'formsubmit.php';
      shouldAutoComplete = false;
      charSetVal = 'utf-8';
      enctypeVal = 'text/plain';
      methodVal = 'get';
      nameVal = 'form_name';
      targetVal = '_blank';

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

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
    });

    describe('rendering', () => {
      it('creates form element', () => {
        formEl = parentEl.querySelector('form');
        expect(formEl).not.toBeNull();
      });

      it('sets \'action\' attribute', () => {
        formEl = parentEl.querySelector(`form[action='${actionVal}']`);
        expect(formEl).not.toBeNull();
      });

      it('sets \'autocomplete\' attribute', () => {
        formEl = parentEl.querySelector('form[autocomplete]');
        expect(formEl).not.toBeNull();
      });

      it('sets \'accept-charset\' attribute', () => {
        formEl = parentEl.querySelector(`form[accept-charset='${charSetVal}']`);
        expect(formEl).not.toBeNull();
      });

      it('sets \'enctype\' attribute', () => {
        formEl = parentEl.querySelector(`form[enctype='${enctypeVal}']`);
        expect(formEl).not.toBeNull();
      });

      it('sets \'method\' attribute', () => {
        formEl = parentEl.querySelector(`form[method='${methodVal}']`);
        expect(formEl).not.toBeNull();
      });

      it('sets \'name\' attribute', () => {
        formEl = parentEl.querySelector(`form[name='${nameVal}']`);
        expect(formEl).not.toBeNull();
      });

      it('sets \'target\' attribute', () => {
        formEl = parentEl.querySelector(`form[target='${targetVal}']`);
        expect(formEl).not.toBeNull();
      });
    });

    describe('options getters and setters', () => {
      it('can read and set \'action\' property', () => {
        expect(cjsForm.accessible.action).toEqual(actionVal);

        const newVal = 'new.php';
        cjsForm.accessible.action = newVal;
        expect(cjsForm.accessible.action).toEqual(newVal);
      });

      it('can read and set \'autoComplete\' property', () => {
        expect(cjsForm.accessible.autoComplete).toEqual(shouldAutoComplete);

        const newVal = false;
        cjsForm.accessible.autoComplete = newVal;
        expect(cjsForm.accessible.autoComplete).toEqual(newVal);
      });

      it('can read and set \'charSet\' property', () => {
        expect(cjsForm.accessible.charSet).toEqual(charSetVal);

        const newVal = 'iso-8859-1';
        cjsForm.accessible.charSet = newVal;
        expect(cjsForm.accessible.charSet).toEqual(newVal);
      });

      it('can read and set \'enctype\' property', () => {
        expect(cjsForm.accessible.enctype).toEqual(enctypeVal);

        const newVal = 'multipart/form-data';
        cjsForm.accessible.enctype = newVal;
        expect(cjsForm.accessible.enctype).toEqual(newVal);
      });

      it('can read and set \'method\' property', () => {
        expect(cjsForm.accessible.method).toEqual(methodVal);

        const newVal = 'post';
        cjsForm.accessible.method = newVal;
        expect(cjsForm.accessible.method).toEqual(newVal);
      });

      it('can read and set \'name\' property', () => {
        expect(cjsForm.accessible.name).toEqual(nameVal);

        const newVal = 'btn_new_name';
        cjsForm.accessible.name = newVal;
        expect(cjsForm.accessible.name).toEqual(newVal);
      });

      it('can read and set \'target\' property', () => {
        expect(cjsForm.accessible.target).toEqual(targetVal);

        const newVal = '_new';
        cjsForm.accessible.target = newVal;
        expect(cjsForm.accessible.target).toEqual(newVal);
      });
    });
  });
});
