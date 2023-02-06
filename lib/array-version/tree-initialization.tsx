// todo: the initialization calls are really verbose and could be combined.

import { MyMap } from 'lib/common/MyMap'
import { TreeNodeType } from 'lib/common/types'
import { TreeState } from './tree-state'
import { TreeNodeMetadata, TREE_ID } from './tree-state'

function traverseForInitialMetadata(
  node: TreeNodeType,
): [string, TreeNodeMetadata][] {
  return [
    [
      node.id,
      {
        name: node.name,
        isFolder: (node.children?.length ?? 0) > 0,
      },
    ],
    ...(node?.children?.flatMap(traverseForInitialMetadata) ?? []),
  ]
}

export function getInitialMetadata(
  rootNodes: TreeNodeType[],
): [string, TreeNodeMetadata][] {
  return [
    [TREE_ID, { name: '', isFolder: true }],
    ...rootNodes.flatMap(traverseForInitialMetadata),
  ]
}

function traverseForInitialChildren(
  node: TreeNodeType,
): [string, string[]][] {
  if (node.children == null) {
    return []
  }

  return [
    [
      node.id,
      node.children.map((child: TreeNodeType): string => child.id) ??
        [],
    ],
    ...node.children.flatMap(traverseForInitialChildren),
  ]
}

export function getInitialChildren(
  rootNodes: TreeNodeType[],
): [string, string[]][] {
  return [
    [TREE_ID, rootNodes.map(node => node.id)],
    ...rootNodes.flatMap(traverseForInitialChildren),
  ]
}

export function getInitialTreeState(
  rootNodes: TreeNodeType[],
): TreeState {
  return {
    isOpen: new MyMap<string, boolean>([[TREE_ID, true]]),
    metadata: new MyMap<string, TreeNodeMetadata>(
      getInitialMetadata(rootNodes),
    ),
    children: new MyMap<string, string[]>(
      getInitialChildren(rootNodes),
    ),
    focusableId: rootNodes.at(0)?.id,
    focusedId: null,
    selectedId: null,
  }
}
