import {
  AccessibilityAdapter,
  AccessibleTreeNode,
  Bounds,
  InferableAccessibleTreeNodeState,
} from '@curriculumassociates/accessibility-core';

export type Stage = createjs.Stage;
export type DisplayObject = createjs.DisplayObject;

export class CreateJsAccessibilitAdapter
  implements AccessibilityAdapter<Stage, DisplayObject>
{
  dispatchEvent(evt: Event) {
    throw new Error('Method not implemented.');
  }

  getViewBounds(view: Stage): Bounds {
    const canvas = view.canvas as HTMLCanvasElement;

    const computedStyle = getComputedStyle(canvas);
    const width = parseInt(computedStyle.width, 10);
    const height = parseInt(computedStyle.height, 10);

    const attrWidth = parseInt(canvas.getAttribute('width'), 10) || width;
    const attrHeight = parseInt(canvas.getAttribute('height'), 10) || height;

    const scaleX = width / attrWidth;
    const scaleY = height / attrHeight;

    const bounds = {
      height: attrHeight,
      width: attrWidth,
      x: canvas.offsetLeft + attrWidth * scaleX,
      y: canvas.offsetTop,
    };

    return bounds;
  }

  getViewObjectBounds(node: AccessibleTreeNode<DisplayObject>): Bounds {
    const { viewObject: displayObject } = node;

    let posGlobalSpace: Partial<Bounds> = {
      x: node.parent.bounds.x,
      y: node.parent.bounds.y,
    };

    const posParentSpace: Bounds = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };

    const bounds: Partial<Bounds> = displayObject.getBounds();
    posGlobalSpace = displayObject.localToGlobal(bounds.x, bounds.y);
    const lowerRight = displayObject.localToGlobal(
      bounds.x + bounds.width,
      bounds.y + bounds.height
    );

    posParentSpace.x =
      (posGlobalSpace.x - node.parent.bounds.x) *
      (1 / displayObject.stage.scaleX);

    posParentSpace.y =
      (posGlobalSpace.y - node.parent.bounds.y) *
      (1 / displayObject.stage.scaleY);

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

  inferAccessibleState(
    node: AccessibleTreeNode<DisplayObject>
  ): InferableAccessibleTreeNodeState {
    throw new Error('Method not implemented.');
  }

  onViewResize() {
    throw new Error('Method not implemented.');
  }
}
