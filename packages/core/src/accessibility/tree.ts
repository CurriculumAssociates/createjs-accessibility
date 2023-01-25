import { breadth } from 'treeverse';

import { getElement } from '../dom';
import { AccessibilityAdapter } from './adapter';
import {
  AccessibleTreeNode,
  AccessibleTreeNodeOptions,
  wrapForUpdates,
} from './node';
import { Role } from './roles';

export const accessibilityTrees: AccessibleTreeNode[] = [];

export type SetupOptions<ViewObjectType> = Required<
  Pick<AccessibleTreeNodeOptions<ViewObjectType>, 'viewObject' | 'element'>
>;

export function setupTree<ViewObjectType>(
  adapter: AccessibilityAdapter<ViewObjectType>,
  options: SetupOptions<ViewObjectType>
): AccessibleTreeNode<ViewObjectType> {
  const { element, viewObject } = options;

  // use adapter to set height & width of rootNode
  const domRootView = adapter.calcDOMViewForTreeRoot(viewObject);

  // calcDomStylesFromStage

  const rootNode = wrapForUpdates(
    new AccessibleTreeNode({
      element: getElement(element),
      role: Role.none,
      viewObject,
    })
  );

  accessibilityTrees.push(rootNode);
  return rootNode;
}

export interface ReleaseOptions<ViewObjectType> {
  root: ViewObjectType;
}

export function releaseTree<ViewObjectType>(
  adapter: AccessibilityAdapter<ViewObjectType>,
  options: ReleaseOptions<ViewObjectType>
) {
  // const { root } = options;
  // const rootIdx = accessibilityTrees.indexOf(root);
  // const deleted = accessibilityTrees.splice(rootIdx, 1);
  // if (!deleted) throw `Unable to relesae view ${root} as it was not setup`;
}

export function registerTreeNode<ViewObjectType>(
  adapter: AccessibilityAdapter<ViewObjectType>,
  ...options: AccessibleTreeNodeOptions<ViewObjectType>[]
): AccessibleTreeNode<ViewObjectType> {
  const constructedNodes = options.map(createAccessibleTreeNode);
  return constructedNodes?.shift();
}

export function createAccessibleTreeNode<ViewObjectType>(
  options: AccessibleTreeNodeOptions<ViewObjectType>
): AccessibleTreeNode<ViewObjectType> {
  return wrapForUpdates(new AccessibleTreeNode(options));
}

export interface TreeUpdateOptions<ViewObjectType> {
  rootNode?: AccessibleTreeNode<ViewObjectType>;
}

export function updateTreeNodes<ViewObjectType>(
  adapter: AccessibilityAdapter<ViewObjectType>,
  options?: TreeUpdateOptions<ViewObjectType>
) {
  const { rootNode } = options;

  accessibilityTrees.forEach((treeRootNode) => {
    if (rootNode && rootNode !== treeRootNode) return;

    rootNode.syncrhonizeElementWithAccessibleTreeNode(
      adapter.calcDOMViewForTreeRoot(rootNode.viewObject)
    );

    breadth({
      tree: treeRootNode,
      getChildren: (node: AccessibleTreeNode) => node.children,
      filter: (node: AccessibleTreeNode) => node.markedForUpdate,
      visit: (node: AccessibleTreeNode) => {
        node.syncrhonizeElementWithAccessibleTreeNode(
          adapter.calcDOMViewForTreeNode(node.viewObject)
        );
      },
    });
  });
}
