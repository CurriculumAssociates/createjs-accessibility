import { getElement } from "../utils/domUtils";
import { Node, NodeOptions } from "./node";

export interface ViewSetupOptions<ViewType> {
  root: HTMLElement | string;
  view: ViewType;
}

export interface ViewReleaseOptions<ViewType> {
  view: ViewType;
}

export interface ViewUpdateOptions<ViewType> {
  view: ViewType;
  boundOptions?: ViewBoundOptions;
}

export interface BoundingRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface NodeUpdateOptions<ViewType, NodeType, N extends Node<NodeType>> {
  view: ViewType;
  node: N;
  prentBounds?: BoundingRect;
}

export interface ViewBoundOptions {
  /**
   * Allows for additional styles to be applied to the root HTMLElement that's
   * registered with the View determining the View's bounds (e.g., transforms)
   */
  additionalStyles?: Partial<CSSStyleDeclaration>;
}

export abstract class Adapter<ViewType, NodeType> {
  #registeredRoots: Map<ViewType, Node<NodeType>> = new Map();

  abstract getBoundingRect<N extends Node<NodeType>>(
    opts: NodeUpdateOptions<ViewType, NodeType, N>
  ): BoundingRect;

  abstract getViewBoundingRect(
    opts: ViewUpdateOptions<ViewType>
  ): BoundingRect;

  setupView<
    RootNode extends Node<NodeType>,
    Options extends ViewSetupOptions<ViewType>
  >(opts: Options): RootNode {
    const { root, view } = opts;

    const rootNode = new Node<NodeType>({
      element: getElement(root),
    });

    this.#registeredRoots.set(view, rootNode);

    return rootNode as RootNode;
  }

  releaseView<
    RootNode extends Node<NodeType>,
    Options extends ViewReleaseOptions<ViewType>
  >(opts: Options): RootNode {
    const { view } = opts;

    const rootNode: Node<NodeType> = this.#registeredRoots.get(view);
    this.#registeredRoots.delete(view);

    return rootNode as RootNode;
  }

  registerNode<
    N extends Node<NodeType>,
    Options extends NodeOptions<NodeType>
  >(
    opts: Options,
    c: new (Options) => N
  ): N {
    const node = new c(opts);
    return node as N;
  }

  updateAccessibilityNodes<
    RootNode extends Node<NodeType>,
    Options extends ViewUpdateOptions<ViewType>
  >(opts: ViewUpdateOptions<ViewType>) {
    const { view } = opts;
    const rootNode: Node<NodeType> = this.#registeredRoots.get(view);

    

    return rootNode;
  }
}

export interface PublicAPI<ViewType, NodeType> {
  setup<
    RootNode extends Node<NodeType>,
    Options extends ViewSetupOptions<ViewType>
  >(
    opts: Options
  ): Promise<RootNode>;

  release<
    RootNode extends Node<NodeType>,
    Options extends ViewReleaseOptions<ViewType>
  >(
    opts: Options
  ): Promise<RootNode>;

  register<
    T extends Node<NodeType>,
    Options extends NodeOptions<NodeType>
  >(
    opts: Options
  ): Promise<T>;

  update<
    RootNode extends Node<NodeType>,
    Options extends ViewUpdateOptions<ViewType>
  >(
    opts: Options
  ): Promise<RootNode>;
}
