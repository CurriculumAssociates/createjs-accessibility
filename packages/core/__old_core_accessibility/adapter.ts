// import { getElement } from '../utils/domUtils';
// import { Node, NodeOptions } from './node';

// export interface ViewSetupOptions<ContainerType> {
//   root: HTMLElement | string;
//   view: ContainerType;
// }

// export interface ViewReleaseOptions<ContainerType> {
//   view: ContainerType;
// }

// export interface ViewUpdateOptions<ContainerType> {
//   view: ContainerType;
//   boundOptions?: ViewBoundOptions;
// }

// export interface BoundingRect {
//   height: number;
//   width: number;
//   x: number;
//   y: number;
// }

// export interface NodeUpdateOptions<
//   ContainerType,
//   NodeType,
//   N extends Node<NodeType>
// > {
//   node: N;
//   prentBounds?: BoundingRect;
//   view: ContainerType;
// }

// export interface EventPropogationOptions<
//   E extends Event,
//   ContainerType,
//   NodeType,
//   N extends Node<NodeType>
// > {
//   event: E;
//   node: N;
//   view: ContainerType;
// }

// export interface ViewBoundOptions {
//   /**
//    * Allows for additional styles to be applied to the root HTMLElement that's
//    * registered with the View determining the View's bounds (e.g., transforms)
//    */
//   additionalStyles?: Partial<CSSStyleDeclaration>;
// }

// export interface InferenceOptions<
//   ContainerType,
//   NodeType,
//   N extends Node<NodeType>
// > {
//   node: N;
//   view: ContainerType;
//   visibility?: boolean;
//   enabled?: boolean;
// }

// export interface AccessibilityAdapter<ContainerType, NodeType> {
//   getBoundingRect<N extends Node<NodeType>>(
//     opts: NodeUpdateOptions<ContainerType, NodeType, N>
//   ): BoundingRect;

//   getViewBoundingRect(opts: ViewUpdateOptions<ContainerType>): BoundingRect;

//   propogateEvent<E extends Event>(
//     opts: EventPropogationOptions<E, ContainerType, NodeType, Node<NodeType>>
//   );

//   infer<
//     N extends Node<NodeType>,
//     Options extends InferenceOptions<ContainerType, NodeType, N>
//   >(
//     opts: Options
//   ): {
//     disabled?: boolean;
//     visible?: boolean;
//   };

//   setupView<
//     RootNode extends Node<NodeType>,
//     Options extends ViewSetupOptions<ContainerType>
//   >(
//     opts: Options
//   ): RootNode;

//   releaseView<
//     RootNode extends Node<NodeType>,
//     Options extends ViewReleaseOptions<ContainerType>
//   >(
//     opts: Options
//   ): RootNode;

//   registerNode<N extends Node<NodeType>, Options extends NodeOptions<NodeType>>(
//     opts: Options,
//     c: new (Options) => N
//   ): N;

//   updateAccessibilityNodes<
//     RootNode extends Node<NodeType>,
//     Options extends ViewUpdateOptions<ContainerType>
//   >(
//     opts: ViewUpdateOptions<ContainerType>
//   );
// }

// export abstract class BaseAdapter<ContainerType, NodeType>
//   implements AccessibilityAdapter<ContainerType, NodeType>
// {
//   #registeredRoots: Map<ContainerType, Node<NodeType>> = new Map();

//   abstract getBoundingRect<N extends Node<NodeType>>(
//     opts: NodeUpdateOptions<ContainerType, NodeType, N>
//   ): BoundingRect;

//   abstract getViewBoundingRect(opts: ViewUpdateOptions<ContainerType>): BoundingRect;

//   abstract propogateEvent<E extends Event>(
//     opts: EventPropogationOptions<E, ContainerType, NodeType, Node<NodeType>>
//   );

//   abstract infer<
//     N extends Node<NodeType>,
//     Options extends InferenceOptions<ContainerType, NodeType, N>
//   >(opts: Options): { disabled?: boolean; visible?: boolean };

//   setupView<
//     N extends Node<NodeType>,
//     Options extends ViewSetupOptions<ContainerType>
//   >(opts: Options): N {
//     const { root, view } = opts;

//     const rootNode = new Node<NodeType>({
//       element: getElement(root),
//     });

//     this.#registeredRoots.set(view, rootNode);

//     return rootNode as N;
//   }

//   releaseView<
//     N extends Node<NodeType>,
//     Options extends ViewReleaseOptions<ContainerType>
//   >(opts: Options): N {
//     const { view } = opts;

//     const rootNode: Node<NodeType> = this.#registeredRoots.get(view);
//     this.#registeredRoots.delete(view);

//     return rootNode as N;
//   }

//   registerNode<N extends Node<NodeType>, Options extends NodeOptions<NodeType>>(
//     opts: Options,
//     c: new (Options) => N
//   ): N {
//     const node = new c(opts);
//     return node as N;
//   }

//   updateAccessibilityNodes<
//     RootNode extends Node<NodeType>,
//     Options extends ViewUpdateOptions<ContainerType>
//   >(opts: ViewUpdateOptions<ContainerType>) {
//     const { view } = opts;
//     const rootNode: Node<NodeType> = this.#registeredRoots.get(view);

//     // TODO: iterate and update the tree

//     return rootNode;
//   }
// }
