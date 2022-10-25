
import createjs from "easeljs";
import { setup, release, register, update } from '@curriculumassociates/accessibility-createjs-adapter';

console.log(setup, release, register, update);

const a11yRoot = document.createElement('div');
a11yRoot.id = 'cam-test';

const canvas = document.createElement('canvas');
canvas.id = 'stage';
canvas.setAttribute('height', '600px');
canvas.setAttribute('width', '800px');
canvas.tabIndex = -1;

const stage = new createjs.Stage('stage');
createjs.Touch.enable(stage, true, false);
createjs.Ticker.framerate = 24;

setup({
  view: stage,
  root: '#cam-test',
});

createjs.Ticker.on('tick', () => {
  stage.update();
  update({
    view: stage,
  });
});