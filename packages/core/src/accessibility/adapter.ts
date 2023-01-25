import {
  AccessibleTreeNode,
  AccessibleTreeNodeDOMView,
  InferredState,
} from './node';

export interface AccessibilityAdapter<ViewObjectType> {
  dispatchEvent(event: Event, eventTarget: AccessibleTreeNode<ViewObjectType>);

  calcDOMViewForTreeRoot(
    rootTreeNode: ViewObjectType
  ): AccessibleTreeNodeDOMView;

  calcDOMViewForTreeNode(treeNode: ViewObjectType): AccessibleTreeNodeDOMView;

  inferAccessibleState(treeNode: ViewObjectType): InferredState;
}
