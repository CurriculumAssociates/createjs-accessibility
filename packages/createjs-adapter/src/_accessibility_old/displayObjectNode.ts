import { Node, NodeOptions } from "@curriculumassociates/accessibility-core";

type DisplayObject = createjs.DisplayObject;

export class DisplayObjectNode extends Node<DisplayObject> {
  constructor(opts: NodeOptions<DisplayObject>) {
    super(opts);
    Object.assign(this.node, { accessible: this });
  }
}
