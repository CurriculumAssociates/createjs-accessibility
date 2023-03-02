import * as createjs from 'createjs-module';
import AccessibilityModule from '../../index';

const { container, parentEl, stage } = global;

describe('TimerData', () => {
  describe('register role', () => {
    let cjsTimer;
    let timeEl;
    let dateTimeVal;

    beforeEach(() => {
      cjsTimer = new createjs.Shape(); // dummy object
      dateTimeVal = '2022-06-06';

      AccessibilityModule.register({
        accessibleOptions: {
          dateTime: dateTimeVal,
        },
        displayObject: cjsTimer,
        parent: container,
        role: AccessibilityModule.ROLES.TIMER,
      });

      stage.accessibilityTranslator.update();
      timeEl = parentEl.querySelector('time');
    });

    describe('rendering', () => {
      it('creates time element', () => {
        expect(timeEl).not.toBeNull();
      });

      it('sets "datetime" attribute', () => {
        expect(timeEl.getAttribute('datetime')).toEqual(dateTimeVal);
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "dateTime" property', () => {
        expect(cjsTimer.accessible.dateTime).toEqual(dateTimeVal);

        const newVal = '1970-01-01';
        cjsTimer.accessible.dateTime = newVal;
        expect(cjsTimer.accessible.dateTime).toEqual(newVal);
      });
    });
  });
});
