import {
  Adapter,
  Node,
  NodeBoundOptions,
  BoundingRect,
  ViewBoundOptions,
} from "@curriculumassociates/accessibility-core";

export class CreateJsAdapter extends Adapter<
  createjs.Stage,
  createjs.DisplayObject
> {

  getBoundingRect<NodeType, ViewType>(
    node: Node<NodeType>,
    view: ViewType,
    opts: NodeBoundOptions
  ): BoundingRect {
    throw new Error("Method not implemented.");
  }

  getViewBoundingRect<ViewType>(
    view: ViewType,
    opts: ViewBoundOptions
  ): BoundingRect {
    throw new Error("Method not implemented.");
  }
}
