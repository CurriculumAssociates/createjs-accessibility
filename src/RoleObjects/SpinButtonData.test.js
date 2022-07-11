import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import KeyCodes from 'keycodes-enum';
import AccessibilityModule from '../index';
import { parentEl, stage, container } from '../__jestSharedSetup';

describe('SpinButtonData', () => {
  describe('register role', () => {
    let cjsSpin;
    let spinEl;
    const accessibleOptions = {};

    beforeEach(() => {
      cjsSpin = new createjs.Shape();
      accessibleOptions.enableKeyEvents = false;
      accessibleOptions.value = 10;
      accessibleOptions.min = 5;
      accessibleOptions.max = 50;
      accessibleOptions.readOnly = false;
      accessibleOptions.required = false;
      AccessibilityModule.register({
        displayObject: cjsSpin,
        parent: container,
        role: AccessibilityModule.ROLES.SPINBUTTON,
        accessibleOptions,
      });

      stage.accessibilityTranslator.update();
      spinEl = parentEl.querySelector(`#${cjsSpin.accessible.domId}`);
    });

    describe('rendering', () => {
      it('creates spin Button element', () => {
        expect(spinEl).not.toBeUndefined();
      });
    });

    describe('"addChild" and "addChildAt"', () => {
      it('thorws Error if child is added', () => {
        const childObj = new createjs.Shape();
        expect(() => {
          cjsSpin.accessible.addChild(childObj);
        }).toThrowError(/spinbutton cannot have children/);
        expect(() => {
          cjsSpin.accessible.addChildAt(childObj, 0);
        }).toThrowError(/spinbutton cannot have children/);
      });
    });

    describe('Accessible getters and setters methods', () => {
      it('can get and set "enableKeyEvent" property', () => {
        expect(cjsSpin.accessible.enableKeyEvents).toBe(false);

        cjsSpin.accessible.enableKeyEvents = true;
        expect(cjsSpin.accessible.enableKeyEvents).toBe(true);
      });

      it('can get and set "value" property', () => {
        expect(cjsSpin.accessible.value).toBe(accessibleOptions.value);

        cjsSpin.accessible.value = 25;
        stage.accessibilityTranslator.update();
        expect(cjsSpin.accessible.value).toBe(25);
        expect(+spinEl.getAttribute('value')).toBe(25);
      });

      it('can get and set "min" and "max" property', () => {
        expect(cjsSpin.accessible.min).toBe(accessibleOptions.min);
        expect(cjsSpin.accessible.max).toBe(accessibleOptions.max);

        cjsSpin.accessible.min = 0;
        cjsSpin.accessible.max = 100;
        stage.accessibilityTranslator.update();
        expect(cjsSpin.accessible.min).toBe(0);
        expect(cjsSpin.accessible.max).toBe(100);
        expect(+spinEl.getAttribute('min')).toBe(0);
        expect(+spinEl.getAttribute('max')).toBe(100);
      });

      it('can get and set "readOnly" and "required" property', () => {
        expect(cjsSpin.accessible.readOnly).toBe(accessibleOptions.readOnly);
        expect(cjsSpin.accessible.required).toBe(accessibleOptions.required);

        cjsSpin.accessible.readOnly = true;
        cjsSpin.accessible.required = true;
        stage.accessibilityTranslator.update();
        expect(cjsSpin.accessible.readOnly).toBe(true);
        expect(cjsSpin.accessible.required).toBe(true);
        expect(spinEl.getAttribute('aria-readonly')).toBe('true');
        expect(spinEl.getAttribute('aria-required')).toBe('true');
      });
    });

    describe('"onKeyDown" and "onChange" event listeneres', () => {
      it('can dispatch "increment" event when key up is clicked', () => {
        const onIncrement = jest.fn();
        cjsSpin.on('increment', onIncrement);
        const keyCode = KeyCodes.up;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        expect(onIncrement).toBeCalledTimes(1);
      });

      it('can dispatch "decrement" event when key down is clicked', () => {
        const onDecrement = jest.fn();
        cjsSpin.on('decrement', onDecrement);
        const keyCode = KeyCodes.down;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        expect(onDecrement).toBeCalledTimes(1);
      });

      it('can dispatch "keyDown" event if "enableKeyEvents" is enabled', () => {
        const onKeyDown = jest.fn();
        cjsSpin.on('keydown', onKeyDown);

        const keyCode = KeyCodes.down;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        expect(onKeyDown).toBeCalledTimes(0);

        cjsSpin.accessible.enableKeyEvents = true;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        expect(onKeyDown).toBeCalledTimes(1);
      });

      it('can prevent default events if "defaultPrevented" is true', () => {
        const onKeyDown = jest.fn();
        const onDecrement = jest.fn();
        cjsSpin.on('keydown', onKeyDown);
        cjsSpin.on('decrement', onKeyDown);

        const keyCode = KeyCodes.down;
        cjsSpin.accessible.enableKeyEvents = true;
        ReactTestUtils.Simulate.keyDown(spinEl, {
          keyCode,
          defaultPrevented: true,
        });
        expect(onKeyDown).toBeCalledTimes(1);
        expect(onDecrement).toBeCalledTimes(0);
      });

      it('can dispatch "change" event when home key is clicked and min value is defined', () => {
        const onChange = jest.fn();
        cjsSpin.on('change', onChange);
        const keyCode = KeyCodes.home;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        const eventData = onChange.mock.calls[0][0];
        expect(onChange).toBeCalledTimes(1);
        expect(eventData.value).toBe(accessibleOptions.min);
      });

      it('can dispatch "change" event when End key is clicked and max value is defined', () => {
        const onChange = jest.fn();
        cjsSpin.on('change', onChange);
        const keyCode = KeyCodes.end;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        const eventData = onChange.mock.calls[0][0];
        expect(onChange).toBeCalledTimes(1);
        expect(eventData.value).toBe(accessibleOptions.max);
      });

      it('can dispatch "change" event when the value is changed', () => {
        const onChange = jest.fn();
        cjsSpin.on('change', onChange);
        ReactTestUtils.Simulate.change(spinEl, {
          target: { value: 25 },
        });
        const eventData = onChange.mock.calls[0][0];
        expect(onChange).toBeCalledTimes(1);
        expect(eventData.value).toBe(25);
      });

      it('does not dispatch "change" event when Home key is clicked and min value is undefined', () => {
        const onChange = jest.fn();
        cjsSpin.on('change', onChange);
        cjsSpin.accessible.min = undefined;
        const keyCode = KeyCodes.home;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        expect(onChange).toBeCalledTimes(0);
      });

      it('does not dispatch "change" event when End key is clicked and max value is undefined', () => {
        const onChange = jest.fn();
        cjsSpin.on('change', onChange);
        cjsSpin.accessible.max = undefined;
        const keyCode = KeyCodes.end;
        ReactTestUtils.Simulate.keyDown(spinEl, { keyCode });
        expect(onChange).toBeCalledTimes(0);
      });
    });
  });
});
