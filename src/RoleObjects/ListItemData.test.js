import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('ListItemData', () => {
  describe('register role', () => {
    let canvasEl;
    let parentEl;
    let stage;
    let container;
    let cjsListItem;
    let liEl;
    let valueVal;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      parentEl = document.createElement('div');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      cjsListItem = new createjs.Shape(); // dummy object
      valueVal = 7;

      AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
      });
      AccessibilityModule.setupStage(stage, parentEl);
      stage.accessibilityTranslator.root = container;
      stage.addChild(container);

      AccessibilityModule.register({
        accessibleOptions: {
          value: valueVal,
        },
        displayObject: cjsListItem,
        parent: container,
        role: AccessibilityModule.ROLES.LISTITEM,
      });

      stage.accessibilityTranslator.update();
    });

    describe('rendering', () => {
      it('creates li element', () => {
        liEl = parentEl.querySelector('li');
        expect(liEl).not.toBeNull();
      });

      it('sets \'value\' attribute', () => {
        liEl = parentEl.querySelector(`li[value='${valueVal}']`);
        expect(liEl).not.toBeNull();
      });
    });

    describe('options getters and setters', () => {
      it('can read and set \'value\' property', () => {
        expect(cjsListItem.accessible.value).toEqual(valueVal);

        const newVal = 99;
        cjsListItem.accessible.value = newVal;
        expect(cjsListItem.accessible.value).toEqual(newVal);
      });
    });
  });
});
