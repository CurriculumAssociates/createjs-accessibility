
// export function useAdapter() {
  
// }

// // import {
// //   Node,
// //   PublicAPI,
// //   ViewReleaseOptions,
// //   ViewSetupOptions,
// //   ViewUpdateOptions,
// // } from "@curriculumassociates/accessibility-core";

// // import {
// //   CreateJsAdapter,
// //   DisplayObject,
// //   DisplayObjectNode,
// //   DisplayObjectOptions,
// //   Stage,
// //   StageUpdateOptions,
// //   StageSetupOptions,
// //   StageReleaseOptions,
// // } from "./_accessibility";

// // let adapter: CreateJsAdapter;

// // const publicApi: PublicAPI<Stage, DisplayObject> = {
// //   setup: async function<DisplayObjectNode>(
// //     opts: StageSetupOptions
// //   ): Promise<DisplayObjectNode> {
// //     if (!adapter) {
// //       adapter = new CreateJsAdapter();
// //     }

// //     const rootNode = adapter.setupView<
// //       Node<DisplayObject>,
// //       ViewSetupOptions<Stage>
// //     >(opts as ViewSetupOptions<Stage>);

// //     return rootNode as DisplayObjectNode;
// //   },

// //   release: async function<DisplayObjectNode>(
// //     opts: StageReleaseOptions
// //   ): Promise<DisplayObjectNode> {
// //     const rootNode = adapter.releaseView(opts as ViewReleaseOptions<Stage>);
// //     return rootNode as DisplayObjectNode;
// //   },

// //   register: async function<DisplayObjectNode>(
// //     opts: DisplayObjectOptions
// //   ): Promise<DisplayObjectNode> {
// //     return adapter.registerNode(opts, DisplayObjectNode) as DisplayObjectNode;
// //   },

// //   update: async function<DisplayObjectNode>(
// //     opts: StageUpdateOptions
// //   ): Promise<DisplayObjectNode> {
// //     return adapter.updateAccessibilityNodes(opts) as DisplayObjectNode;
// //   },
// // };

// // export const setup = publicApi.setup;
// // export const release = publicApi.release;
// // export const register = publicApi.register;
// // export const update = publicApi.update;

// // // const overlay: AccessibilityOverlay = {
// // //   setup: async function <Stage, DisplayObject>(
// // //     opts: StageSetupOptions
// // //   ): Promise<DisplayObjectNode> {
// // //     if (!adapter) {
// // //       adapter = new CreateJsAdapter();
// // //     }
// // //     const rootNode = adapter.setupView(opts);
// // //     opts?.done(rootNode);

// // //     return rootNode;
// // //   },

// // //   release: async function <Stage, DisplayObject>(
// // //     opts: StageReleaseOptions
// // //   ): Promise<DisplayObjectNode> {
// // //     return adapter.releaseView(opts);
// // //   },

// // //   register: async function <DisplayObject>(
// // //     opts: DisplayObjectRegisterOptions
// // //   ): Promise<DisplayObjectNode> {
// // //     throw new Error("Function not implemented.");
// // //   },

// // //   update: async function <Stage, DisplayObject>(
// // //     opts: StageUpdateOptions
// // //   ): Promise<DisplayObjectNode> {
// // //     throw new Error("Function not implemented.");
// // //   },
// // // };

// // // export default { ...overlay };

// // // setup(
// // //   opts: StageSetupOptions
// // // ): Promise<DisplayObjectNode> {
// // //   if (!adapter) {
// // //     adapter = new CreateJsAdapter();
// // //   }
// // //   const rootNode = adapter.setupView(opts);
// // //   opts?.done(rootNode);
// // //   return rootNode;
// // // }

// // // legacySetup(view: Stage, root: HTMLElement, onReady: Function) {
// // //   setup({
// // //     view,
// // //     root,
// // //     done: onReady,
// // //   });
// // // }

// // // release<Stage, DisplayObject>(opts: ViewReleaseOptions<Stage>) {
// // //   return adapter.releaseView<Stage>(opts);
// // // }

// // // register(opts: DisplayObjectRegisterOptions) {
// // // }

// // // update(opts: StageUpdateOptions) {
// // //   adapter.updateAccessibilityNodes<Stage, DisplayObject>(opts);
// // // }
