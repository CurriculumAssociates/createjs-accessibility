import 'createjs';
import {
  registerTreeNode,
  Role,
  setupTree,
  updateTreeNodes,
} from '@curriculumassociates/accessibility-createjs-adapter';

import AppWindow from './app/appWindow';

const canvas = document.createElement('canvas');
canvas.id = 'stage';
canvas.setAttribute('height', '600px');
canvas.setAttribute('width', '800px');
canvas.tabIndex = -1;
document.body.appendChild(canvas);

const a11yRoot = document.createElement('div');
a11yRoot.id = 'test-a11y-overlay';
document.body.appendChild(a11yRoot);

const stage = new createjs.Stage('stage');
createjs.Touch.enable(stage, true, false);
createjs.Ticker.framerate = 24;

const rootAccessibleNode = setupTree({
  view: stage,
  domRoot: '#test-a11y-overlay',
});

const appWindow = new AppWindow(canvas.height, canvas.width);
stage.addChild(appWindow);
rootAccessibleNode.addChild(appWindow.accessible);

createjs.Ticker.on('tick', () => {
  stage.update();
  updateTreeNodes();
});
