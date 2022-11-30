import { AccessibleTreeNode, AccessibleTreeNodeDOMView, Infer } from './node';

export interface AccessibilityAdapter<ViewObjectType> {
  dispatchEvent(event: Event, eventTarget: AccessibleTreeNode<ViewObjectType>);

  calcDOMViewForTreeRoot(
    rootTreeNode: AccessibleTreeNode<ViewObjectType>
  ): AccessibleTreeNodeDOMView;

  calcDOMViewForTreeNode(
    treeNode: AccessibleTreeNode<ViewObjectType>
  ): AccessibleTreeNodeDOMView;

  inferAccessibleState(
    treeNode: AccessibleTreeNode<ViewObjectType>
  ): Record<keyof typeof Infer, boolean | string>;
}
