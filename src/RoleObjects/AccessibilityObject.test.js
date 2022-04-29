import * as createjs from 'createjs-module';
import ReactTestUtils from 'react-dom/test-utils';
import AccessibilityModule from '../index';

describe('AccessibilityObject', () => {
  it('Accessibility Object should provide event and keycode with the event', () => {
    const keyboardClickListener = jest.fn();
    const canvas = document.createElement('canvas');
    const parentEl = document.createElement('div');
    const stage = new createjs.Stage(canvas);
    const container = new createjs.Container();
    window.createjs = createjs;
    AccessibilityModule.register({
      displayObject: container,
      role: AccessibilityModule.ROLES.MAIN,
      accessibleOptions: { enableKeyEvents: true },
    });
    AccessibilityModule.setupStage(stage, parentEl);
    stage.accessibilityTranslator.root = container;
    stage.addChild(container);
    container.on('keydown', keyboardClickListener);
    stage.update();
    stage.accessibilityTranslator.update();

    [
      ['Enter', 13],
      ['a', 65],
      ['t', 84],
      ['Tab', 9],
    ].forEach(([key, keyCode], i) => {
      ReactTestUtils.Simulate.keyDown(parentEl.querySelector('main'), {
        keyCode,
        key,
      });
      const keyboardListenerArgument = keyboardClickListener.mock.calls[i][0];
      const receivedKey = keyboardListenerArgument.key;
      const receivedkeyCode = keyboardListenerArgument.keyCode;

      expect(receivedKey).toBe(key);
      expect(receivedkeyCode).toBe(keyCode);
    });
  });
});
