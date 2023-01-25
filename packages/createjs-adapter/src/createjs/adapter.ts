import {
  AccessibilityAdapter,
  AccessibleTreeNode,
  AccessibleTreeNodeDOMView,
  InferredState,
} from '@curriculumassociates/accessibility-core';

export type Stage = createjs.Stage;
export type DisplayObject = createjs.DisplayObject;
export type Container = createjs.Container;

export class CreateJsAccessibilitAdapter
  implements AccessibilityAdapter<DisplayObject | Container>
{
  dispatchEvent(event: Event, eventTarget: AccessibleTreeNode<DisplayObject>) {
    throw new Error('Method not implemented.');
  }

  calcDOMViewForTreeRoot(displayObject: Container): AccessibleTreeNodeDOMView {
    const domView = {
      styles: {},
      bounds: { height: 0, width: 0, y: 0, x: 0 },
    };

    const canvas = displayObject.stage.canvas as HTMLCanvasElement;

    const computedStyle = getComputedStyle(canvas);
    const width = parseInt(computedStyle.width, 10);
    const height = parseInt(computedStyle.height, 10);

    const attrWidth = parseInt(canvas.getAttribute('width'), 10) || width;
    const attrHeight = parseInt(canvas.getAttribute('height'), 10) || height;

    const scaleX = width / attrWidth;
    const scaleY = height / attrHeight;

    domView.bounds = {
      height: attrHeight,
      width: attrWidth,
      y: canvas.offsetTop,
      x: canvas.offsetLeft + attrWidth * scaleX,
    };

    return domView;
  }

  calcDOMViewForTreeNode(
    displayObject: DisplayObject | Container
  ): AccessibleTreeNodeDOMView {
    const domView = {
      styles: {},
      bounds: { height: 0, width: 0, y: 0, x: 0 },
    };

    const parentBounds = displayObject.parent.getBounds();

    let posGlobalSpace = {
      x: parentBounds.x,
      y: parentBounds.y,
    };

    const posParentSpace = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };

    const bounds = displayObject.getBounds();
    posGlobalSpace = displayObject.localToGlobal(bounds.x, bounds.y);
    const lowerRight = displayObject.localToGlobal(
      bounds.x + bounds.width,
      bounds.y + bounds.height
    );

    posParentSpace.x =
      (posGlobalSpace.x - parentBounds.x) *
      (1 / displayObject.stage.scaleX);

    posParentSpace.y =
      (posGlobalSpace.y - parentBounds.y) *
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

    domView.bounds = posParentSpace;

    return domView;
  }

  inferAccessibleState(
    treeNode: DisplayObject
  ): InferredState {
    throw new Error('Method not implemented.');
  }
}
