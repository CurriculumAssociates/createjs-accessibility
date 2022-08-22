import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('RadioData', () => {
  describe('register role', () => {
    let cjsRadio;
    let inputEl;
    let isChecked;
    let positionVal;
    let shouldEnableKeyEvents;
    let sizeVal;
    let valueVal;

    beforeEach(() => {
      cjsRadio = new createjs.Shape(); // dummy object
      isChecked = false;
      positionVal = 7;
      shouldEnableKeyEvents = false;
      sizeVal = 99;
      valueVal = 7;

      AccessibilityModule.register({
        accessibleOptions: {
          checked: isChecked,
          enableKeyEvents: shouldEnableKeyEvents,
          position: positionVal,
          size: sizeVal,
          value: valueVal,
        },
        displayObject: cjsRadio,
        parent: container,
        role: AccessibilityModule.ROLES.RADIO,
      });

      stage.accessibilityTranslator.update();

      inputEl = parentEl.querySelector('input');
    });

    describe('rendering', () => {
      it('creates input[type=radio] element', () => {
        expect(inputEl.type).toEqual('radio');
      });

      it('sets "aria-posinset" attribute', () => {
        expect(parseInt(inputEl.getAttribute('aria-posinset'), 10)).toEqual(
          positionVal
        );
      });

      it('sets "aria-setsize" attribute', () => {
        expect(parseInt(inputEl.getAttribute('aria-setsize'), 10)).toEqual(
          sizeVal
        );
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "position" property [for "aria-posinset"]', () => {
        expect(cjsRadio.accessible.position).toEqual(positionVal);

        const newVal = -1;
        cjsRadio.accessible.position = newVal;
        expect(cjsRadio.accessible.position).toEqual(newVal);
      });

      it('can read and set "size" property [for "aria-setsize"]', () => {
        expect(cjsRadio.accessible.size).toEqual(sizeVal);

        const newVal = -1;
        cjsRadio.accessible.size = newVal;
        expect(cjsRadio.accessible.size).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "checked" property', () => {
        expect(cjsRadio.accessible.checked).toEqual(isChecked);

        const newVal = true;
        cjsRadio.accessible.checked = newVal;
        expect(cjsRadio.accessible.checked).toEqual(newVal);
      });

      it('can read and set "enableKeyEvents" property', () => {
        expect(cjsRadio.accessible.enableKeyEvents).toEqual(
          shouldEnableKeyEvents
        );

        const newVal = true;
        cjsRadio.accessible.enableKeyEvents = newVal;
        expect(cjsRadio.accessible.enableKeyEvents).toEqual(newVal);
      });

      it('can read and set "value" property', () => {
        expect(cjsRadio.accessible.value).toEqual(valueVal);

        const newVal = 99;
        cjsRadio.accessible.value = newVal;
        expect(cjsRadio.accessible.value).toEqual(newVal);
      });
    });
  });
});
