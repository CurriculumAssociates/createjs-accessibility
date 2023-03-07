import AccessibilityModule from '../../index';

describe('SelectData', () => {
  describe('register role', () => {
    let cjsRadioGroup;
    let radioGroupEl;
    let orientationVal;

    beforeEach(() => {
      cjsRadioGroup = new createjs.Shape(); // dummy object
      orientationVal = 'horizontal';

      AccessibilityModule.register({
        accessibleOptions: {
          orientation: orientationVal,
        },
        displayObject: cjsRadioGroup,
        parent: container,
        role: AccessibilityModule.ROLES.RADIOGROUP,
      });

      stage.accessibilityTranslator.update();
      radioGroupEl = parentEl.querySelector('div[role=radiogroup]');
    });

    describe('rendering', () => {
      it('creates div[role=radiogroup] element', () => {
        expect(radioGroupEl).not.toBeNull();
      });

      it('sets "aria-orientation" attribute', () => {
        expect(radioGroupEl.getAttribute('aria-orientation')).toEqual(
          orientationVal
        );
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "orientation" property [for "aria-orientation"]', () => {
        expect(cjsRadioGroup.accessible.orientation).toEqual(orientationVal);

        const newVal = 'vertical';
        cjsRadioGroup.accessible.orientation = newVal;
        expect(cjsRadioGroup.accessible.orientation).toEqual(newVal);
      });
    });
  });
});
