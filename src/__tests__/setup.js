import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';

let canvasEl;
let parentEl;
let stage;
let container;

global.createjs = createjs;

beforeEach(() => {
  canvasEl = document.createElement('canvas');
  parentEl = document.createElement('div');
  document.body.append(parentEl, canvasEl);

  stage = new createjs.Stage(canvasEl);
  container = new createjs.Container();

  AccessibilityModule.register({
    displayObject: container,
    role: AccessibilityModule.ROLES.MAIN,
  });

  AccessibilityModule.setupStage(stage, parentEl);
  stage.accessibilityTranslator.root = container;
  stage.addChild(container);

  global.canvasEl = canvasEl;
  global.parentEl = parentEl;
  global.stage = stage;
  global.container = container;
});

afterEach(() => {
  AccessibilityModule.releaseStage(stage, parentEl);
  if (parentEl.hasChildNodes()) {
    do {
      parentEl.removeChild(parentEl.firstChild);
    } while (parentEl.firstChild);
  }
});
