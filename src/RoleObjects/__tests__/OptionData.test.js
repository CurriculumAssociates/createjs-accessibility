import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';
import { parentEl, stage, container } from '../../__tests__/__jestSharedSetup';

describe('OptionData', () => {
  describe('register role', () => {
    let cjsSelect;
    let cjsCell;
    let liEl;
    let isEnabled;
    let positionInSetVal;
    let sizeVal;
    let valueVal;

    beforeEach(() => {
      cjsSelect = new createjs.Shape(); // dummy object
      cjsCell = new createjs.Shape(); // dummy child object
      isEnabled = false;
      positionInSetVal = 7;
      sizeVal = 99;
      valueVal = 7;

      AccessibilityModule.register({
        accessibleOptions: {
          enabled: isEnabled,
          positionInSet: positionInSetVal,
          setSize: sizeVal,
          value: valueVal,
        },
        displayObject: cjsSelect,
        parent: container,
        role: AccessibilityModule.ROLES.SINGLESELECTOPTION,
      });

      AccessibilityModule.register({
        displayObject: cjsCell,
        role: AccessibilityModule.ROLES.CELL,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates li[role=menuitem] element', () => {
        liEl = parentEl.querySelector('li[role=option]');
        expect(liEl).not.toBeNull();
      });

      it('sets "aria-disabled" attribute', () => {
        expect(
          parentEl.querySelector(
            `li[role=option][aria-disabled='${!isEnabled}']`
          )
        ).not.toBeNull();
      });

      it('sets "aria-posinset" attribute', () => {
        expect(parseInt(liEl.getAttribute('aria-posinset'), 10)).toEqual(
          positionInSetVal
        );
      });

      it('sets "aria-setsize" attribute', () => {
        expect(parseInt(liEl.getAttribute('aria-setsize'), 10)).toEqual(
          sizeVal
        );
      });
    });

    describe('children checking', () => {
      const errorObj = /singleselectoption cannot have children/;
      it('throws error attempting to add child using addChild() ', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsSelect.accessible.addChild(cjsCell);
        }).toThrowError(errorObj);
      });

      it('throws error attempting to add child using addChildAt()', () => {
        expect(() => {
          stage.accessibilityTranslator.update();
          cjsSelect.accessible.addChildAt(cjsCell, 0);
        }).toThrowError(errorObj);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "enabled" property [for "aria-disabled"]', () => {
        expect(cjsSelect.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsSelect.accessible.enabled = newVal;
        expect(cjsSelect.accessible.enabled).toEqual(newVal);
      });

      it('can read and set "setSize" property [for "aria-setsize"]', () => {
        expect(cjsSelect.accessible.setSize).toEqual(sizeVal);

        const newVal = -1;
        cjsSelect.accessible.setSize = newVal;
        expect(cjsSelect.accessible.setSize).toEqual(newVal);
      });

      it('can read and set "positionInSet" property [for "aria-posinset"]', () => {
        expect(cjsSelect.accessible.positionInSet).toEqual(positionInSetVal);

        const newVal = -1;
        cjsSelect.accessible.positionInSet = newVal;
        expect(cjsSelect.accessible.positionInSet).toEqual(newVal);
      });
    });

    describe('other options getters and setters', () => {
      it('can read and set "enabled" property', () => {
        expect(cjsSelect.accessible.enabled).toEqual(isEnabled);

        const newVal = true;
        cjsSelect.accessible.enabled = newVal;
        expect(cjsSelect.accessible.enabled).toEqual(newVal);
      });

      it('can read and set "value" property', () => {
        expect(cjsSelect.accessible.value).toEqual(valueVal);

        const newVal = 99;
        cjsSelect.accessible.value = newVal;
        expect(cjsSelect.accessible.value).toEqual(newVal);
      });
    });
  });
});
