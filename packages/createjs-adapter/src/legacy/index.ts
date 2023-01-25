import { setupTree, releaseTree, registerTreeNode } from '../index';

export class LegacyAccessibilityObject {}

export function setupStage(
  stage: createjs.Stage,
  parentElement: HTMLElement,
  onReady = () => {}
) {
  setupTree({
    viewObject: stage,
    element: parentElement,
  });

  onReady();
}

export function releaseStage(stage) {
  releaseTree({ root: stage });
}

export function resize(stage) {}

export type ConfigObject = {};

export function register(
  configObjects: ConfigObject | ConfigObject[]
): void /*LegacyAccessibilityObject*/ {
  let configs = Array.isArray(configObjects) ? [configObjects] : configObjects;

  // foreach registerTreeNode();
}
