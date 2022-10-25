import {
  ViewReleaseOptions,
  ViewSetupOptions,
  ViewUpdateOptions,
  NodeRegisterOptions,
} from "@curriculumassociates/accessibility-core";

import { CreateJsAdapter, DisplayObjectNode } from "./accessibility";

type Stage = createjs.Stage;
type DisplayObject = createjs.DisplayObject;

let adapter: CreateJsAdapter;

export type StageSetupOptions = ViewSetupOptions<Stage> & {};

export async function setup(
  opts: StageSetupOptions
): Promise<DisplayObjectNode> {
  if (!adapter) {
    adapter = new CreateJsAdapter();
  }

  const rootNode = adapter.setupView(opts);
  opts?.done(rootNode);
  return rootNode;
}

export function legacySetup(view: Stage, root: HTMLElement, onReady: Function) {
  setup({
    view,
    root,
    done: onReady,
  });
}

export async function release(opts: ViewReleaseOptions<Stage>) {
  return adapter.releaseView<Stage>(opts);
}

export type DisplayObjectRegisterOptions =
  NodeRegisterOptions<DisplayObject> & {};

export async function register(opts: DisplayObjectRegisterOptions) {
  
}

export type StageUpdateOptions =
  ViewUpdateOptions<Stage> & {};

export async function update(opts: StageUpdateOptions) {
  adapter.updateAccessibilityNodes<Stage, DisplayObject>(opts);
}
