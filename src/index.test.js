// import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-16';
import * as createjs from 'createjs-module';
import { configure } from 'enzyme';
import AccessibilityModule from './index';

configure({ adapter: new Adapter() });

describe('AccessibilityModule', () => {
  describe('setupStage', () => {
    let canvasEl;
    let stage;
    let container;
    let parentElement;
    let renderSpy;

    beforeEach(() => {
      canvasEl = document.createElement('canvas');
      stage = new createjs.Stage(canvasEl);
      container = new createjs.Container();
      parentElement = document.createElement('div');
      parentElement.id = 'parent-element';
      renderSpy = jest.spyOn(ReactDOM, 'render');
    });


    it('calls ReactDOM.render and renders inside parentElement', () => {
      expect(parentElement.childElementCount).toEqual(0);

      AccessibilityModule.register({
        displayObject: container,
        role: 'main',
      });
      AccessibilityModule.setupStage(stage, parentElement, () => {
        stage.accessibilityTranslator.root = container;
      });

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(parentElement.childElementCount).toEqual(1);
    });


    it('find parentElement by id if passed a string', () => {
      const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(parentElement);

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
