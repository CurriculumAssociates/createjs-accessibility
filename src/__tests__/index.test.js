import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

describe('AccessibilityModule', () => {
  describe('setupStage', () => {
    let canvasEl;
    let stage;
    let container;
    let parentElement;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      parentElement = document.createElement('div');
      parentElement.id = 'parent-element';
    });

    it('renders main element inside parentElement when setupStage is called', () => {
      expect(parentElement.childElementCount).toEqual(0);

      AccessibilityModule.register({
        displayObject: container,
        role: 'main',
      });
      AccessibilityModule.setupStage(stage, parentElement, () => {
        stage.accessibilityTranslator.root = container;
      });

      expect(parentElement.childElementCount).toEqual(1);
    });

    it('find parentElement by id if passed a string', () => {
      const getElementByIdSpy = jest
        .spyOn(document, 'getElementById')
        .mockReturnValue(parentElement);

      AccessibilityModule.register({
        displayObject: container,
        role: 'main',
      });
      AccessibilityModule.setupStage(stage, parentElement.id);

      expect(getElementByIdSpy).toBeCalledWith(parentElement.id);
    });

    it('should call onReady callback', () => {
      const onReady = jest.fn();

      AccessibilityModule.register({
        displayObject: container,
        role: 'main',
      });
      AccessibilityModule.setupStage(stage, parentElement, onReady);

      expect(onReady).toBeCalled();
    });
  });
});
