import AccessibilityModule from '../../index';

describe('ListItemData', () => {
  describe('register role', () => {
    let cjsListItem;
    let liEl;
    let valueVal;

    beforeEach(() => {
      cjsListItem = new createjs.Shape(); // dummy object
      valueVal = 7;

      AccessibilityModule.register({
        accessibleOptions: {
          value: valueVal,
        },
        displayObject: cjsListItem,
        parent: container,
        role: AccessibilityModule.ROLES.LISTITEM,
      });

      stage.accessibilityTranslator.update();
      liEl = parentEl.querySelector('li');
    });

    describe('rendering', () => {
      it('creates li element', () => {
        expect(liEl).not.toBeNull();
      });

      it('sets "value" attribute', () => {
        expect(liEl.value).toEqual(valueVal);
      });
    });

    describe('options getters and setters', () => {
      it('can read and set "value" property', () => {
        expect(cjsListItem.accessible.value).toEqual(valueVal);

        const newVal = 99;
        cjsListItem.accessible.value = newVal;
        expect(cjsListItem.accessible.value).toEqual(newVal);
      });
    });
  });
});
