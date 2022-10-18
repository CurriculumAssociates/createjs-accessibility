import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('SeparatorData', () => {
  describe('register role', () => {
    let cjsSeparator;
    let cjsSpan;
    let hrEl;
    let orientationVal;
    let valueMaxVal;
    let valueMinVal;
    let valueNowVal;
    let valueTextVal;

    beforeEach(() => {
      cjsSeparator = new createjs.Shape(); // dummy object
      cjsSpan = new createjs.Shape(); // dummy child object
      orientationVal = 'horizontal';
      valueMaxVal = 99;
      valueMinVal = 1;
      valueNowVal = 50;
      valueTextVal = 'value of 50';

      AccessibilityModule.register({
        accessibleOptions: {
          orientation: orientationVal,
          valueMax: valueMaxVal,
          valueMin: valueMinVal,
          valueNow: valueNowVal,
          valueText: valueTextVal,
        },
        displayObject: cjsSeparator,
        parent: container,
        role: AccessibilityModule.ROLES.SEPARATOR,
      });

      AccessibilityModule.register({
        displayObject: cjsSpan,
        role: AccessibilityModule.ROLES.SPAN,
      });

      stage.accessibilityTranslator.update();
      hrEl = parentEl.querySelector('hr');
    });

    describe('rendering', () => {
      it('creates hr element', () => {
        expect(hrEl).not.toBeNull();
      });

      it('sets "aria-orientation" attribute', () => {
        expect(hrEl.getAttribute('aria-orientation')).toEqual(orientationVal);
      });

      it('sets "aria-valuemax" attribute', () => {
        expect(parseInt(hrEl.getAttribute('aria-valuemax'), 10)).toEqual(
          valueMaxVal
        );
      });

      it('sets "aria-valuemin" attribute', () => {
        expect(parseInt(hrEl.getAttribute('aria-valuemin'), 10)).toEqual(
          valueMinVal
        );
      });

      it('sets "aria-valuenow" attribute', () => {
        expect(parseInt(hrEl.getAttribute('aria-valuenow'), 10)).toEqual(
          valueNowVal
        );
      });

      it('sets "aria-valuetext" attribute', () => {
        expect(hrEl.getAttribute('aria-valuetext')).toEqual(valueTextVal);
      });
    });

    describe('children checking', () => {
      let errorObj;

      beforeEach(() => {
        errorObj = /separator cannot have children/;
        stage.accessibilityTranslator.update();
      });

      it('throws error attempting to add child using addChild() ', () => {
        expect(() => {
          cjsSeparator.accessible.addChild(cjsSpan);
        }).toThrowError(errorObj);
      });

      it('throws error attempting to add child using addChildAt()', () => {
        expect(() => {
          cjsSeparator.accessible.addChildAt(cjsSpan, 0);
        }).toThrowError(errorObj);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "orientation" property [for "aria-orientation"]', () => {
        expect(cjsSeparator.accessible.orientation).toEqual(orientationVal);

        const newVal = 'vertical';
        cjsSeparator.accessible.orientation = newVal;
        expect(cjsSeparator.accessible.orientation).toEqual(newVal);
      });

      it('can read and set "valueMax" property [for "aria-valuemax"]', () => {
        expect(cjsSeparator.accessible.valueMax).toEqual(valueMaxVal);

        const newVal = -1;
        cjsSeparator.accessible.valueMax = newVal;
        expect(cjsSeparator.accessible.valueMax).toEqual(newVal);
      });

      it('can read and set "valueMin" property [for "aria-valuemin"]', () => {
        expect(cjsSeparator.accessible.valueMin).toEqual(valueMinVal);

        const newVal = -1;
        cjsSeparator.accessible.valueMin = newVal;
        expect(cjsSeparator.accessible.valueMin).toEqual(newVal);
      });

      it('can read and set "valueNow" property [for "aria-valuenow"]', () => {
        expect(cjsSeparator.accessible.valueNow).toEqual(valueNowVal);

        const newVal = -1;
        cjsSeparator.accessible.valueNow = newVal;
        expect(cjsSeparator.accessible.valueNow).toEqual(newVal);
      });

      it('can read and set "valueText" property [for "aria-valuetext"]', () => {
        expect(cjsSeparator.accessible.valueText).toEqual(valueTextVal);

        const newVal = -1;
        cjsSeparator.accessible.valueText = newVal;
        expect(cjsSeparator.accessible.valueText).toEqual(newVal);
      });
    });
  });
});
