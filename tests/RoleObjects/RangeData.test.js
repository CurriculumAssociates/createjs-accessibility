import * as createjs from 'createjs-module';
import AccessibilityModule from '../../src/index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('RangeData', () => {
  describe('register role', () => {
    let cjsProgressBar;
    let progressEl;
    let maxVal;
    let minVal;
    let valueVal;
    let valueTextVal;

    beforeEach(() => {
      cjsProgressBar = new createjs.Shape(); // dummy object
      maxVal = 99;
      minVal = 1;
      valueVal = 50;
      valueTextVal = 'value of 50';

      AccessibilityModule.register({
        accessibleOptions: {
          max: maxVal,
          min: minVal,
          value: valueVal,
          valueText: valueTextVal,
        },
        displayObject: cjsProgressBar,
        parent: container,
        role: AccessibilityModule.ROLES.PROGRESSBAR,
      });

      stage.accessibilityTranslator.update();
      progressEl = parentEl.querySelector('progress');
    });

    describe('rendering', () => {
      it('creates progress element', () => {
        expect(progressEl).not.toBeNull();
      });

      it('sets "aria-valuemax" attribute', () => {
        expect(parseInt(progressEl.getAttribute('aria-valuemax'), 10)).toEqual(
          maxVal
        );
      });

      it('sets "aria-valuemin" attribute', () => {
        expect(parseInt(progressEl.getAttribute('aria-valuemin'), 10)).toEqual(
          minVal
        );
      });

      it('sets "aria-valuenow" attribute', () => {
        expect(parseInt(progressEl.getAttribute('aria-valuenow'), 10)).toEqual(
          valueVal
        );
      });

      it('sets "aria-valuetext" attribute', () => {
        expect(progressEl.getAttribute('aria-valuetext')).toEqual(valueTextVal);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "max" property [for "aria-valuemax"]', () => {
        expect(cjsProgressBar.accessible.max).toEqual(maxVal);

        const newVal = -1;
        cjsProgressBar.accessible.max = newVal;
        expect(cjsProgressBar.accessible.max).toEqual(newVal);
      });

      it('can read and set "min" property [for "aria-valuemin"]', () => {
        expect(cjsProgressBar.accessible.min).toEqual(minVal);

        const newVal = -1;
        cjsProgressBar.accessible.min = newVal;
        expect(cjsProgressBar.accessible.min).toEqual(newVal);
      });

      it('can read and set "value" property [for "aria-valuenow"]', () => {
        expect(cjsProgressBar.accessible.value).toEqual(valueVal);

        const newVal = -1;
        cjsProgressBar.accessible.value = newVal;
        expect(cjsProgressBar.accessible.value).toEqual(newVal);
      });

      it('can read and set "valueText" property [for "aria-valuetext"]', () => {
        expect(cjsProgressBar.accessible.valueText).toEqual(valueTextVal);

        const newVal = -1;
        cjsProgressBar.accessible.valueText = newVal;
        expect(cjsProgressBar.accessible.valueText).toEqual(newVal);
      });
    });
  });
});
