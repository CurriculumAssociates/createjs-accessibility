import AccessibilityModule from '../../index';

describe('RadioGroupData', () => {
  describe('register role', () => {
    let cjsRadioGroup;
    let radioGroupEl;
    let isReadOnly;
    let isRequired;

    beforeEach(() => {
      cjsRadioGroup = new createjs.Shape(); // dummy object
      isReadOnly = false;
      isRequired = false;

      AccessibilityModule.register({
        accessibleOptions: {
          readOnly: isReadOnly,
          required: isRequired,
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

      it('sets "aria-readonly" attribute', () => {
        const ariaReadOnly =
          radioGroupEl.getAttribute('aria-readonly') === 'true';
        expect(ariaReadOnly).toEqual(isReadOnly);
      });

      it('sets "aria-required" attribute', () => {
        const ariaRequired =
          radioGroupEl.getAttribute('aria-required') === 'true';
        expect(ariaRequired).toEqual(isRequired);
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "readOnly" property [for "aria-readonly"]', () => {
        expect(cjsRadioGroup.accessible.readOnly).toEqual(isReadOnly);

        const newVal = true;
        cjsRadioGroup.accessible.readOnly = newVal;
        expect(cjsRadioGroup.accessible.readOnly).toEqual(newVal);
      });

      it('can read and set "required" property [for "aria-required"]', () => {
        expect(cjsRadioGroup.accessible.required).toEqual(isRequired);

        const newVal = true;
        cjsRadioGroup.accessible.required = newVal;
        expect(cjsRadioGroup.accessible.required).toEqual(newVal);
      });
    });
  });
});
