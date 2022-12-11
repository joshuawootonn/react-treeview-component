import React, {
  Dispatch,
  MutableRefObject,
  ReactNode,
  RefObject,
  useReducer,
  useRef,
} from "react";
import { MyMap } from "../common/MyMap";
import { TreeNodeType } from "../common/types";

export type TreeType = {
  state: ReducerState;
  dispatch: Dispatch<Actions>;
};

export type TreeNodeMetadataType = {
  isFolder: boolean;
  name: string;
};

function getInitialMetadata(
  nodes: TreeNodeType[]
): [string, TreeNodeMetadataType][] {
  if ("children"! in nodes) return [];

  return nodes.reduce<[string, TreeNodeMetadataType][]>((acc, curr) => {
    const children = curr.children ? getInitialMetadata(curr.children) : [];
    return [
      ...acc,
      [
        curr.id,
        { name: curr.name, isFolder: (curr.children?.length ?? 0) > 0 },
      ],
      ...children,
    ];
  }, []);
}

export const TREE_AREA_ID = "tree-area";

function getInitialChildren(rootNodes: TreeNodeType[]): [string, string[]][] {
  if ("children"! in rootNodes) return [];

  function traverse(
    nodes: TreeNodeType[],
    initialValues?: [string, string[]][]
  ): [string, string[]][] {
    if ("children"! in nodes) return [];

    return nodes.reduce(
      (acc, curr) => {
        const children = curr.children ? traverse(curr.children) : [];
        return [
          ...acc,
          [curr.id, curr.children?.map((child): string => child.id) ?? []],
          ...children,
        ];
      },
      initialValues ? initialValues : []
    );
  }

  return traverse(rootNodes, [
    [TREE_AREA_ID, rootNodes.map((node) => node.id)],
  ]);
}

function getInitialParents(rootNodes: TreeNodeType[]): [string, string][] {
  if ("children"! in rootNodes) return [];

  function traverse(
    nodes: TreeNodeType[],
    initialValues?: [string, string][]
  ): [string, string][] {
    if ("children"! in nodes) return [];

    return nodes.reduce<[string, string][]>(
      (acc, curr) => {
        const children = curr.children ? traverse(curr.children) : [];
        return [
          ...acc,
          ...(curr.children?.map((child): [string, string] => [
            child.id,
            curr.id,
          ]) ?? []),
          ...children,
        ];
      },
      initialValues ? initialValues : []
    );
  }

  return traverse(
    rootNodes,
    rootNodes.map((node) => [node.id, TREE_AREA_ID])
  );
}

function getInitialState(rootNodes: TreeNodeType[]): ReducerState {
  const children = new MyMap<string, string[]>(getInitialChildren(rootNodes));
  const parent = new MyMap<string, string>(getInitialParents(rootNodes));

  return {
    isOpen: new MyMap<string, boolean>(),
    metadata: new MyMap<string, TreeNodeMetadataType>(
      getInitialMetadata(rootNodes)
    ),
    children,
    parent,
    focusableId: rootNodes.at(0)?.id,
    focusedId: null,
    selectedId: null,
  };
}

export const TreeViewContext = React.createContext<TreeViewContextType>({
  state: getInitialState([]),
  dispatch: () => {},
  elements: { current: new MyMap<string, HTMLElement>() },
});

export type TreeViewContextType = TreeType & {
  elements: MutableRefObject<MyMap<string, HTMLElement>>;
};

type ReducerState = {
  children: MyMap<string, string[]>;
  parent: MyMap<string, string>;

  isOpen: MyMap<string, boolean>;
  metadata: MyMap<string, TreeNodeMetadataType>;

  focusableId?: string | null;
  focusedId?: string | null;
  selectedId?: string | null;
  copiedId?: string | null;
};

export enum TreeActionTypes {
  REGISTER_NODE = "REGISTER_NODE",
  DEREGISTER_NODE = "DEREGISTER_NODE",
  FOCUS = "FOCUS",
  BLUR = "BLUR",
  SELECT = "SELECT",
  UNSELECT = "UNSELECT",
  SET_FOCUSABLE = "SET_FOCUSABLE",
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  MOVE = "MOVE",
  COPY = "COPY",
  PASTE = "PASTE",
}

type Actions =
  | {
      type: TreeActionTypes.REGISTER_NODE;
      id: string;
      childrenIds: string[];
    }
  | { type: TreeActionTypes.DEREGISTER_NODE; id: string; childrenIds: string[] }
  | { type: TreeActionTypes.FOCUS; id: string }
  | { type: TreeActionTypes.BLUR; id: string }
  | { type: TreeActionTypes.SELECT; id: string }
  | { type: TreeActionTypes.UNSELECT; id: string }
  | { type: TreeActionTypes.SET_FOCUSABLE; id: string }
  | {
      type: TreeActionTypes.OPEN;
      id: string;
    }
  | {
      type: TreeActionTypes.CLOSE;
      id: string;
    }
  | {
      type: TreeActionTypes.MOVE;
      id: string;
      to: string;
    }
  | {
      type: TreeActionTypes.COPY;
      id: string;
    }
  | {
      type: TreeActionTypes.PASTE;
      to: string;
    };

export function getNextFocusableNode(
  state: ReducerState,
  originalId: string
): string {
  return traverse(originalId);

  function traverse(id: string, prevId?: string): string {
    if (id === TREE_AREA_ID) {
      let arr = state.children.get(TREE_AREA_ID);
      if (!arr) return id;

      if (prevId) {
        let indexOfPrevId = arr.findIndex((ele: any) => prevId === ele);
        let nextNodeId = arr[indexOfPrevId + 1];
        if (nextNodeId == null) return originalId;
        return nextNodeId;
      } else {
        return arr[0] ?? originalId;
      }
    }

    const isCurrentOpen = state.isOpen.get(id);
    const currentChildren = state.children.get(id);
    if (
      isCurrentOpen &&
      currentChildren &&
      (currentChildren?.length ?? 0) > 0
    ) {
      if (originalId == id) {
        return currentChildren?.at(0) ?? id;
      }

      const currentLocation = currentChildren.findIndex(
        (childId) => childId === prevId
      );

      if (currentLocation !== currentChildren.length - 1) {
        return currentChildren.at(currentLocation + 1) ?? prevId ?? id;
      }
    }

    const parent = state.parent.get(id);
    // console.log({ parent, id });

    if (parent) {
      return traverse(parent, id);
    }

    return id;
  }
}

export function getPreviousFocusableNode(
  state: ReducerState,
  originalId: string
): string {
  if (originalId === TREE_AREA_ID) {
    return TREE_AREA_ID;
  }
  const parent = state.parent.get(originalId);
  if (parent) {
    const siblingNodes = state.children.get(parent);

    if (siblingNodes == null || siblingNodes.length === 0) {
      throw new Error("shouldn't be here");
    }
    if (siblingNodes?.at(0) === originalId) {
      return parent;
    } else {
      //enter child after current
      const currentSiblingPosition = siblingNodes?.findIndex(
        (childId) => childId === originalId
      );

      if (currentSiblingPosition != null && currentSiblingPosition !== 0) {
        return traverse(
          siblingNodes.at(currentSiblingPosition - 1) ?? originalId
        );
      }
    }
  }

  throw new Error("Woops! Only the root should not have a parent");

  function traverse(id: string): string {
    // console.log(id);

    const children = state.children.get(id);
    // console.log({ children, isOpen: state.isOpen.get(id) == false });

    if (
      children == null ||
      children.length === 0 ||
      state.isOpen.get(id) == null ||
      state.isOpen.get(id) == false
    ) {
      return id;
    }
    return traverse(children.at(children.length - 1) ?? id);
  }
}

function reducer(state: ReducerState, action: Actions): ReducerState {
  switch (action.type) {
    case TreeActionTypes.REGISTER_NODE:
      const nextParentMap: MyMap<string, string> = new MyMap(state.parent);
      action.childrenIds.forEach((childId) => {
        nextParentMap.set(childId, action.id);
      });
      return {
        ...state,
        children: new MyMap(state.children).set(action.id, action.childrenIds),
        parent: nextParentMap,

        focusableId:
          state.children.size() === 0 ? action.id : state.focusableId,
      };

    case TreeActionTypes.DEREGISTER_NODE:
      return state;

    case TreeActionTypes.FOCUS:
      return {
        ...state,
        focusedId: action.id,
      };

    case TreeActionTypes.BLUR:
      return {
        ...state,
        focusedId: state.focusedId === action.id ? null : state.focusedId,
      };

    case TreeActionTypes.SET_FOCUSABLE:
      return {
        ...state,
        focusableId: action.id,
      };

    case TreeActionTypes.OPEN:
      return {
        ...state,
        isOpen: new MyMap(state.isOpen).set(action.id, true),
      };

    case TreeActionTypes.CLOSE:
      return {
        ...state,
        isOpen: new MyMap(state.isOpen).set(action.id, false),
      };

    case TreeActionTypes.SELECT:
      return {
        ...state,
        selectedId: action.id,
      };

    case TreeActionTypes.UNSELECT:
      return {
        ...state,
        selectedId: null,
      };

    case TreeActionTypes.MOVE:
      const prevParent = state.parent.get(action.id);
      const nextParent = action.to;

      if (prevParent === nextParent || nextParent === action.id) return state;

      if (prevParent == null) {
        throw new Error("You can only move nodes with a parent");
      }

      return {
        ...state,
        children: new MyMap(state.children)
          .set(
            prevParent,
            state.children
              .get(prevParent)
              ?.filter((children) => children !== action.id) ?? []
          )
          .set(nextParent, [
            ...(state.children.get(nextParent) ?? []),
            action.id,
          ]),
        parent: new MyMap(state.parent).set(action.id, nextParent),
      };

    case TreeActionTypes.COPY:
      return { ...state, copiedId: action.id };

    case TreeActionTypes.PASTE:
      if (state.copiedId == null || action.to === state.copiedId) return state;

      const isFolder = (state.children.get(action.to)?.length ?? 0) > 0;
      const parent = state.parent.get(action.to);

      if (!isFolder && parent) {
        return reducer(state, {
          to: parent,
          type: TreeActionTypes.PASTE,
        });
      }

      return reducer(
        { ...state, copiedId: null },
        {
          type: TreeActionTypes.MOVE,
          id: state.copiedId,
          to: action.to,
        }
      );

    default:
      throw new Error("Reducer received an unknown action");
  }
}

type TreeViewProviderProps = {
  children: ({
    rootNodeIds,
    dispatch,
  }: {
    rootNodeIds: string[];
    dispatch: React.Dispatch<Actions>;
    elements: RefObject<MyMap<string, HTMLElement>>;
  }) => ReactNode | ReactNode[];
  initialTree: TreeNodeType[];
};

export function TreeViewProvider({
  children,
  initialTree,
}: TreeViewProviderProps) {
  const elements = useRef<MyMap<string, HTMLElement>>(new MyMap());
  const [state, dispatch] = useReducer(reducer, getInitialState(initialTree));

  return (
    <TreeViewContext.Provider value={{ dispatch, elements, state }}>
      {children({
        rootNodeIds: state.children.get(TREE_AREA_ID) ?? [],
        dispatch,
        elements,
      })}
    </TreeViewContext.Provider>
  );
}
