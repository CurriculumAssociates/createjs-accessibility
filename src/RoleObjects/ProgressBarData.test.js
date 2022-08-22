import * as createjs from 'createjs-module';
import AccessibilityModule from '../index.tsx';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('ProgressBarData', () => {
  describe('register role', () => {
    let cjsProgressBar;
    let progressEl;
    let maxVal;
    let minVal;
    let valueMaxVal;
    let valueNowVal;
    let valueVal;
    let valueTextVal;

    beforeEach(() => {
      cjsProgressBar = new createjs.Shape(); // dummy object
      maxVal = 99;
      minVal = 1;
      valueMaxVal = 999;
      valueNowVal = 500;
      valueVal = 50;
      valueTextVal = 'value of 50';

      AccessibilityModule.register({
        accessibleOptions: {
          max: maxVal,
          min: minVal,
          value: valueVal,
          valueMax: valueMaxVal,
          valueNow: valueNowVal,
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

      it('sets "max" attribute', () => {
        expect(parseInt(progressEl.getAttribute('max'), 10)).toEqual(
          valueMaxVal
        );
      });

      it('sets "value" attribute', () => {
        expect(parseInt(progressEl.getAttribute('value'), 10)).toEqual(
          valueNowVal
        );
      });

      describe('inherits props from RangeData', () => {
        it('sets "aria-valuemax" attribute', () => {
          expect(
            parseInt(progressEl.getAttribute('aria-valuemax'), 10)
          ).toEqual(maxVal);
        });

        it('sets "aria-valuemin" attribute', () => {
          expect(
            parseInt(progressEl.getAttribute('aria-valuemin'), 10)
          ).toEqual(minVal);
        });

        it('sets "aria-valuenow" attribute', () => {
          expect(
            parseInt(progressEl.getAttribute('aria-valuenow'), 10)
          ).toEqual(valueVal);
        });

        it('sets "aria-valuetext" attribute', () => {
          expect(progressEl.getAttribute('aria-valuetext')).toEqual(
            valueTextVal
          );
        });
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

    describe('other options getters and setters', () => {
      it('can read and set "valueMax" property', () => {
        expect(cjsProgressBar.accessible.valueMax).toEqual(valueMaxVal);

        const newVal = -1;
        cjsProgressBar.accessible.valueMax = newVal;
        expect(cjsProgressBar.accessible.valueMax).toEqual(newVal);
      });

      it('can read and set "valueNow" property', () => {
        expect(cjsProgressBar.accessible.valueNow).toEqual(valueNowVal);

        const newVal = -1;
        cjsProgressBar.accessible.valueNow = newVal;
        expect(cjsProgressBar.accessible.valueNow).toEqual(newVal);
      });
    });
  });
});
