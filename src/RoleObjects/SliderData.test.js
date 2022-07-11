import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('SliderData', () => {
  describe('register role', () => {
    let cjsSlider;
    let sliderEl;
    const accessibleOptions = {};

    beforeEach(() => {
      cjsSlider = new createjs.Shape();
      accessibleOptions.step = 5;
      accessibleOptions.pageStep = 5;
      accessibleOptions.orientation = 'horizontal';
      accessibleOptions.value = 25;
      accessibleOptions.min = 0;
      accessibleOptions.max = 100;
      accessibleOptions.enableKeyEvents = false;
      AccessibilityModule.register({
        accessibleOptions,
        displayObject: cjsSlider,
        parent: container,
        role: AccessibilityModule.ROLES.SLIDER,
      });

      stage.accessibilityTranslator.update();
      sliderEl = parentEl.querySelector('input[type=range]');
    });

    describe('rendering', () => {
      it('creates input[type=range] element', () => {
        expect(sliderEl).not.toBeUndefined();
      });
    });

    describe('accessible options getters and setters', () => {
      [
        { property: 'step', newVal: 10 },
        { property: 'pageStep', newVal: 10 },
        { property: 'orientation', newVal: 'vertical' },
        { property: 'value', newVal: 55 },
        { property: 'min', newVal: 20 },
        { property: 'max', newVal: 200 },
        { property: 'enableKeyEvents', newVal: true },
      ].forEach(({ property, newVal }) => {
        it(`can set and get "${property}" property`, () => {
          expect(cjsSlider.accessible[property]).toBe(
            accessibleOptions[property]
          );

          cjsSlider.accessible[property] = newVal;
          stage.accessibilityTranslator.update();
          expect(cjsSlider.accessible[property]).toBe(newVal);
        });
      });
    });

    describe('"onchange" and "onKeyDown" key handlers', () => {
      it('can dispatch "valueChanged" event with the newValue', () => {
        const eventHandler = jest.fn();
        cjsSlider.on('valueChanged', eventHandler);

        const updatedValue = 75;
        ReactTestUtils.Simulate.change(sliderEl, {
          target: { value: updatedValue },
        });

        expect(eventHandler).toBeCalledTimes(1);
        const argument = eventHandler.mock.calls[0][0];
        expect(argument.newValue).toBe(updatedValue);
      });

      it('can dispatch "valueChanged" event with reduced newValue on "pagedown" click', () => {
        const keyDownHandler = jest.fn();
        cjsSlider.on('valueChanged', keyDownHandler);

        const keyCode = KeyCodes.pagedown;
        ReactTestUtils.Simulate.keyDown(sliderEl, { keyCode });
        expect(keyDownHandler).toBeCalledTimes(1);
        const argument = keyDownHandler.mock.calls[0][0];
        expect(argument.newValue).toBeLessThan(accessibleOptions.value);
      });

      it('can dispatch "valueChanged" event with increased newValue on "pageup" click', () => {
        const handler = jest.fn();
        cjsSlider.on('valueChanged', handler);

        const keyCode = KeyCodes.pageup;
        ReactTestUtils.Simulate.keyDown(sliderEl, { keyCode });
        expect(handler).toBeCalledTimes(1);
        const eventData = handler.mock.calls[0][0];
        expect(eventData.newValue).toBeGreaterThan(accessibleOptions.value);
      });

      it('does not emits "valueChanged" event when defaultPrevented is "true"', () => {
        cjsSlider.accessible.enableKeyEvents = true;
        const keyDownHandler = jest.fn();
        cjsSlider.on('valueChanged', keyDownHandler);

        const keyCode = KeyCodes.pagedown;
        ReactTestUtils.Simulate.keyDown(sliderEl, {
          keyCode,
          defaultPrevented: true,
        });
        expect(keyDownHandler).not.toBeCalled();
      });

      it('can dispatch "valueChanged" event when defaultPrevented is "false"', () => {
        cjsSlider.accessible.enableKeyEvents = true;
        const keyDownHandler = jest.fn();
        cjsSlider.on('valueChanged', keyDownHandler);

        const keyCode = KeyCodes.pagedown;
        ReactTestUtils.Simulate.keyDown(sliderEl, {
          keyCode,
          defaultPrevented: false,
        });
        expect(keyDownHandler).toBeCalled();
      });

      it('does not emits "valueChanged" event when pageStep is not set', () => {
        cjsSlider.accessible.pageStep = undefined;
        const keyDownHandler = jest.fn();
        cjsSlider.on('valueChanged', keyDownHandler);

        const keyCode = KeyCodes.pagedown;
        ReactTestUtils.Simulate.keyDown(sliderEl, {
          keyCode,
          defaultPrevented: true,
        });
        expect(keyDownHandler).not.toBeCalled();
      });
    });
  });
});
