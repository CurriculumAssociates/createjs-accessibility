import $ from 'jquery';
import AccessibilityModule from '@curriculumassociates/createjs-accessibility';
import AppWindow from './widgets/AppWindow';

function init() {
  const stage = new createjs.Stage('stage');
  createjs.Touch.enable(stage, true, false);
  createjs.Ticker.framerate = 24;

  AccessibilityModule.setupStage(stage, 'cam-test');
  const canvas = $(stage.canvas);
  const appWindow = new AppWindow(
    parseInt(canvas.attr('width'), 10),
    parseInt(canvas.attr('height'), 10)
  );
  // note: AppWindow's constructor attaches and fills in its AccessibilityObject
  stage.accessibilityTranslator.root = appWindow;
  stage.addChild(appWindow);

  createjs.Ticker.on('tick', () => {
    stage.update();
    stage.accessibilityTranslator.update();
  });
}

init();
