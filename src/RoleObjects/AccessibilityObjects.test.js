import * as createjs from 'createjs-module';
import AccessibilityModule from '../index';
import ReactTestUtils from 'react-dom/test-utils';

describe('Accessibility Objects', ()=>{
    it("Accessibility Object should provide event and keycode with the event", () => {
    let keyboardClickListener = jest.fn()
    let canvas = document.createElement("canvas"), stage;
    let parentEl = document.createElement("div");
    parentEl.id = "parent-element"; 
    stage = new createjs.Stage(canvas);
    const container = new createjs.Container();

    AccessibilityModule.setupStage(stage, parentEl);
    AccessibilityModule.register({
        displayObject: container,
        role: AccessibilityModule.ROLES.MAIN,
        accessibleOptions: {enableKeyEvents:true},
    });
    container.on('keydown', keyboardClickListener);
    stage.accessibilityTranslator.root = container;
    stage.addChild(container);
    
    stage.update()
    stage.accessibilityTranslator.update();

    [['13', 'Enter'], ['a', '65'], ['t', '84'], ['Tab', '9']].forEach(([key, keyCode], i)=>{
        ReactTestUtils.Simulate.keyDown(parentEl.querySelector('main'), {keyCode: keyCode, key:key});
        const keyboardListenerArgument = keyboardClickListener.mock.calls[i][0];
        const receivedKey = keyboardListenerArgument.key;
        const receivedkeyCode = keyboardListenerArgument.keyCode;

        expect(receivedKey).toBe(key);
        expect(receivedkeyCode).toBe(keyCode);
    })
  });
})