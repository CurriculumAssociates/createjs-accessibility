import createjs from 'createjs';
import $ from 'jquery';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import AppWindow from './widgets/AppWindow.js';

function init() {
  const stage = new createjs.Stage('stage');
  createjs.Touch.enable(stage, true, false);
  createjs.Ticker.framerate = 24;

  // todo: delete
  window.stage = stage;

  AccessibilityModule.setupStage(stage, 'cam-test');
  const canvas = $(stage.canvas);
  const appWindow = new AppWindow(parseInt(canvas.attr('width')), parseInt(canvas.attr('height')));
  // note: AppWindow's constructor attaches and fills in its AccessibilityObject
  stage.accessibilityTranslator.root = appWindow;
  stage.addChild(appWindow);

  createjs.Ticker.on('tick', (evt) => {
    stage.update();
    stage.accessibilityTranslator.update();
  });

  // todo: add window resize handler that allows for testing repositioning translated DisplayObjects so that they still have the correct position for screen magnifiers by resizing the canvas to match the window size
}

init();
