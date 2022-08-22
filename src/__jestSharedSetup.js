/* eslint-disable import/no-extraneous-dependencies,import/no-mutable-exports */
import * as createjs from 'createjs-module';
import AccessibilityModule from './index.tsx';

let canvasEl;
let parentEl;
let stage;
let container;

beforeEach(() => {
  window.createjs = createjs;

  canvasEl = document.createElement('canvas');
  parentEl = document.createElement('div');
  stage = new createjs.Stage(canvasEl);
  container = new createjs.Container();

  AccessibilityModule.register({
    displayObject: container,
    role: AccessibilityModule.ROLES.MAIN,
  });

  AccessibilityModule.setupStage(stage, parentEl);
  stage.accessibilityTranslator.root = container;
  stage.addChild(container);
});

afterEach(() => {
  if (parentEl.hasChildNodes()) {
    do {
      parentEl.removeChild(parentEl.firstChild);
    } while (parentEl.firstChild);
  }
});

export { canvasEl, container, parentEl, stage };
