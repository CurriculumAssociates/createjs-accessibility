/* eslint-disable import/no-extraneous-dependencies,import/no-mutable-exports */
import * as createjs from 'createjs-module';
import { globals } from '../.eslintrc';
import 'jest-canvas-mock';
import AccessibilityModule from '../src/index';

let canvasEl;
let parentEl;
let stage;
let container;

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

if (parentEl.hasChildNodes()) {
  do {
    parentEl.removeChild(parentEl.firstChild);
  } while (parentEl.firstChild);
}


global.canvasEl = canvasEl;
global.parentEl = parentEl;
global.stage = stage;
global.container = container;