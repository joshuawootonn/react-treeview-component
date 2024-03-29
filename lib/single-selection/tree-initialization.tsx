// todo: the initialization calls are really verbose and could be combined.

import { MyMap } from 'lib/common/MyMap'
import { TreeNodeType } from 'lib/common/types'
import { TreeState } from './tree-state'
import { TreeNodeMetadata, TREE_ID } from './tree-state'

export function getInitialMetadata(
  nodes: TreeNodeType[],
): [string, TreeNodeMetadata][] {
  if ('children'! in nodes) return []

  return nodes.reduce<[string, TreeNodeMetadata][]>((acc, curr) => {
    const children = curr.children
      ? getInitialMetadata(curr.children)
      : []
    return [
      ...acc,
      [
        curr.id,
        {
          name: curr.name,
          isFolder: (curr.children?.length ?? 0) > 0,
        },
      ],
      ...children,
    ]
  }, [])
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
    ...node.children.flatMap(child =>
      traverseForInitialChildren(child),
    ),
  ]
}

export function getInitialChildren(
  rootNodes: TreeNodeType[],
): [string, string[]][] {
  return [
    [TREE_ID, rootNodes.map(node => node.id)],
    ...rootNodes.flatMap(node => {
      return traverseForInitialChildren(node)
    }),
  ]
}

export function getInitialParents(
  rootNodes: TreeNodeType[],
): [string, string][] {
  if ('children'! in rootNodes) return []

  function traverse(
    nodes: TreeNodeType[],
    initialValues?: [string, string][],
  ): [string, string][] {
    if ('children'! in nodes) return []

    return nodes.reduce<[string, string][]>(
      (acc, curr) => {
        const children = curr.children ? traverse(curr.children) : []
        return [
          ...acc,
          ...(curr.children?.map((child): [string, string] => [
            child.id,
            curr.id,
          ]) ?? []),
          ...children,
        ]
      },
      initialValues ? initialValues : [],
    )
  }

  return traverse(
    rootNodes,
    rootNodes.map(node => [node.id, TREE_ID]),
  )
}

export function getInitialTreeState(
  rootNodes: TreeNodeType[],
): TreeState {
  const children = new MyMap<string, string[]>(
    getInitialChildren(rootNodes),
  )

  const parent = new MyMap<string, string>(
    getInitialParents(rootNodes),
  )

  return {
    isOpen: new MyMap<string, boolean>([[TREE_ID, true]]),
    metadata: new MyMap<string, TreeNodeMetadata>(
      getInitialMetadata(rootNodes),
    ),
    children,
    parent,
    focusableId: rootNodes.at(0)?.id,
    focusedId: null,
    selectedId: null,
  }
}
