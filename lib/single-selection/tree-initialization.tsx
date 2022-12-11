import { MyMap } from "lib/common/MyMap";
import { TreeNodeType } from "lib/common/types";
import { TreeState } from "./tree-state";
import { TreeNodeMetadata, TREE_AREA_ID } from "./tree-state";

export function getInitialMetadata(
  nodes: TreeNodeType[]
): [string, TreeNodeMetadata][] {
  if ("children"! in nodes) return [];

  return nodes.reduce<[string, TreeNodeMetadata][]>((acc, curr) => {
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

export function getInitialChildren(
  rootNodes: TreeNodeType[]
): [string, string[]][] {
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

export function getInitialParents(
  rootNodes: TreeNodeType[]
): [string, string][] {
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

export function getInitialTreeState(rootNodes: TreeNodeType[]): TreeState {
  const children = new MyMap<string, string[]>(getInitialChildren(rootNodes));
  const parent = new MyMap<string, string>(getInitialParents(rootNodes));

  return {
    isOpen: new MyMap<string, boolean>(),
    metadata: new MyMap<string, TreeNodeMetadata>(
      getInitialMetadata(rootNodes)
    ),
    children,
    parent,
    focusableId: rootNodes.at(0)?.id,
    focusedId: null,
    selectedId: null,
  };
}
