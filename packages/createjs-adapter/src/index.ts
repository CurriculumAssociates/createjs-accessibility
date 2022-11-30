import {
  AccessibleTreeNodeOptions,
  ReleaseOptions,
  releaseTree as coreReleaseTree,
  registerTreeNode as coreRegisterTreeNode,
  SetupOptions,
  setupTree as coreSetupTree,
  updateTreeNodes as coreUpdateTreeNodes,
  UpdateOptions,
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

// alias
export type StageSetupOptions = SetupOptions<Stage>;

export function setupTree(
  options: StageSetupOptions
): DisplayObjectTreeNode {
  return coreSetupTree(createjsAdapter, options);
}

// alias
export type StageReleaseOptions = ReleaseOptions<Stage>;

export function releaseTree(options: StageReleaseOptions) {
  coreReleaseTree(createjsAdapter, options);
}

// alias
export type DisplayObjectTreeNodeOptions =
  AccessibleTreeNodeOptions<DisplayObject>;

export function registerTreeNode(
  ...options: DisplayObjectTreeNodeOptions[]
): DisplayObjectTreeNode {
  return coreRegisterTreeNode(createjsAdapter, ...options);
}

// alias
export type StageUpdateOptions = UpdateOptions<Stage>;

export function updateTreeNodes(options?: StageUpdateOptions) {
  coreUpdateTreeNodes(createjsAdapter, options);
}
