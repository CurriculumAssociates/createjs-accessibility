import AccessibilityModule from '../../index';

describe('SwitchData', () => {
  describe('register role', () => {
    let cjsSwitch;
    let buttonEl;
    let isChecked;

    beforeEach(() => {
      cjsSwitch = new createjs.Shape(); // dummy object
      isChecked = false;

      AccessibilityModule.register({
        displayObject: cjsSwitch,
        parent: container,
        role: AccessibilityModule.ROLES.SWITCH,
      });

      stage.accessibilityTranslator.update();
      buttonEl = parentEl.querySelector(
        'button[role=switch][aria-checked=false]'
      );
    });

    describe('rendering', () => {
      it('creates button[role=switch][aria-checked=false] element', () => {
        expect(buttonEl).not.toBeNull();
      });
    });

    describe('accessible options getters and setters', () => {
      it('can read and set "checked" property [for "aria-checked"]', () => {
        expect(cjsSwitch.accessible.checked).toEqual(isChecked);

        const newVal = true;
        cjsSwitch.accessible.checked = newVal;
        expect(cjsSwitch.accessible.checked).toEqual(newVal);
      });
    });
  });
});
