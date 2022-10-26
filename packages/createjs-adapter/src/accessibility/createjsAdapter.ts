import {
  Adapter,
  NodeOptions,
  NodeBoundOptions,
  BoundingRect,
  ViewBoundOptions,
  ViewSetupOptions,
  ViewReleaseOptions,
  ViewUpdateOptions,
  Node,
  NodeUpdateOptions,
  EventPropogationOptions,
} from "@curriculumassociates/accessibility-core";

import { DisplayObjectNode } from "./displayObjectNode";

export type DisplayObject = createjs.DisplayObject;
export type Stage = createjs.Stage;

export interface StageSetupOptions extends ViewSetupOptions<createjs.Stage> {}

export interface StageReleaseOptions
  extends ViewReleaseOptions<createjs.Stage> {}

export interface StageUpdateOptions extends ViewUpdateOptions<createjs.Stage> {}

export interface DisplayObjectOptions
  extends NodeOptions<createjs.DisplayObject> {}

export class CreateJsAdapter extends Adapter<
  createjs.Stage,
  createjs.DisplayObject
> {
  getBoundingRect<N extends Node<createjs.DisplayObject>, ViewType>(
    opts: NodeUpdateOptions<ViewType, createjs.DisplayObject, N>
  ): BoundingRect {
    const {
      view,
      node: { node: displayObject, parent: container },
      prentBounds,
    } = opts;

    const localBounds = displayObject.getBounds();
    const posGlobalSpace = displayObject.localToGlobal(
      localBounds.x,
      localBounds.y
    );
    const lowerRight = displayObject.localToGlobal(
      localBounds.x + localBounds.width,
      localBounds.y + localBounds.height
    );

    const posParentSpace: BoundingRect = {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    };

    posParentSpace.x =
      (posGlobalSpace.x - prentBounds.x) * (1 / displayObject.stage.scaleX);

    posParentSpace.y =
      (posGlobalSpace.y - prentBounds.y) * (1 / displayObject.stage.scaleY);

    posParentSpace.width =
      (lowerRight.x - posGlobalSpace.x) * (1 / displayObject.stage.scaleX);

    posParentSpace.height =
      (lowerRight.y - posGlobalSpace.y) * (1 / displayObject.stage.scaleY);

    if (posParentSpace.width < 0) {
      posParentSpace.width = -posParentSpace.width;
      posParentSpace.x -= posParentSpace.width;
    }

    if (posParentSpace.height < 0) {
      posParentSpace.height = -posParentSpace.height;
      posParentSpace.y -= posParentSpace.height;
    }

    return posParentSpace;
  }

  getViewBoundingRect(opts: ViewUpdateOptions<createjs.Stage>): BoundingRect {
    const { view } = opts;

    const canvas = view.canvas as HTMLElement;

    const computedStyle = getComputedStyle(canvas);
    const width = parseInt(computedStyle.width, 10);
    const height = parseInt(computedStyle.height, 10);

    const attrWidth = parseInt(canvas.getAttribute("width"), 10) || width;
    // const attrHeight = parseInt(canvas.getAttribute('height'), 10) || height;

    const scale = width / attrWidth;

    const bounds = {
      height,
      width,
      x: canvas.offsetLeft + attrWidth * scale,
      y: canvas.offsetTop,
    };
    return bounds;
  }

  propogateEvent<E extends Event>(opts: EventPropogationOptions<E, Stage, DisplayObject, DisplayObjectNode>) {
    const { event } = opts;
    const createjsEvent = new createjs.Event(event.type, true, true);
    opts.node.node.dispatchEvent(createjsEvent);
  }
}
