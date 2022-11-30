import { setupTree, releaseTree, registerTreeNode } from '../index';

export class LegacyAccessibilityObject {}

export function setupStage(
  stage: createjs.Stage,
  parentElement: HTMLElement,
  onReady = () => {}
) {
  setupTree({
    view: stage,
    domRoot: parentElement,
  });

  onReady();
}

export function releaseStage(stage) {
  releaseTree({ view: stage });
}

export function resize(stage) {}

export type ConfigObject = {};

export function register(
  configObjects: ConfigObject | ConfigObject[]
): void /*LegacyAccessibilityObject*/ {
  let configs = Array.isArray(configObjects) ? [configObjects] : configObjects;

  // foreach registerTreeNode();
}
