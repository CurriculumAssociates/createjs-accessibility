import { DisplayObjectTreeNode, registerTreeNode, Role } from "@curriculumassociates/accessibility-createjs-adapter";
import Button from "./widgets/button";

export default class AppWindow extends createjs.Container {
  accessible: DisplayObjectTreeNode;

  constructor(width, height) {
    super();

    this.accessible = registerTreeNode({
      viewObject: this,
      role: Role.none,
      attributes: {
        id: 'app-window',
      },
    });

    const button = new Button({
      value: 'Test Button',
      disabled: false,
    }, 1);

    this.accessible.addChild(button.accessible);
    this.addChild(button);
  }
}