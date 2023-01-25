import {
  AccessibleTreeNodeOptions,
  ReleaseOptions,
  releaseTree as coreReleaseTree,
  registerTreeNode as coreRegisterTreeNode,
  SetupOptions,
  setupTree as coreSetupTree,
  updateTreeNodes as coreUpdateTreeNodes,
  TreeUpdateOptions,
  AccessibleTreeNode,
} from '@curriculumassociates/accessibility-core';

export { Role } from '@curriculumassociates/accessibility-core';

import {
  Stage,
  DisplayObject,
  CreateJsAccessibilitAdapter,
} from './createjs/adapter';

// Only exporting for unit testing at the moment
export const createjsAdapter = new CreateJsAccessibilitAdapter();

export type DisplayObjectTreeNode = AccessibleTreeNode<DisplayObject>;

export function setupTree(
  options: SetupOptions<Stage>
): DisplayObjectTreeNode {
  return coreSetupTree(createjsAdapter, options);
}

export function releaseTree(options: ReleaseOptions<Stage>) {
  coreReleaseTree(createjsAdapter, options);
}

export function registerTreeNode(
  ...options: AccessibleTreeNodeOptions<DisplayObject>[]
): DisplayObjectTreeNode {
  return coreRegisterTreeNode(createjsAdapter, ...options);
}

export function updateTreeNodes(options?: TreeUpdateOptions<Stage>) {
  coreUpdateTreeNodes(createjsAdapter, options);
}
