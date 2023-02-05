import { MyMap } from 'lib/common/MyMap'
import { TreeNodeType } from 'lib/common/types'
import { TreeState } from './tree-context'

export const TREE_ID = 'tree'

// export function getInitialChildren(
//   rootNodes: TreeNodeType[],
// ): [string, string[]][] {
//   function traverse(node: TreeNodeType): [string, string[]][] {
//     if (node.children == null) {
//       return []
//     }

//     return [
//       [
//         node.id,
//         node.children.map(
//           (child: TreeNodeType): string => child.id,
//         ) ?? [],
//       ],
//       ...node.children.map(child => traverse(child)),
//     ]
//   }

//   return [
//     [TREE_ID, rootNodes.map(node => node.id)],
//     ...rootNodes.flatMap(node => {
//       console.log(traverse(node))

//       return traverse(node)
//     }),
//   ]
// }
function traverseForInitialChildren(
  node: TreeNodeType,
): [string, string[]][] {
  if (node.children == null) {
    return []
  }

  return [
    [
      node.id,
      node.children.map((child: TreeNodeType): string => child.id),
    ],
    ...node.children.flatMap(child =>
      traverseForInitialChildren(child),
    ),
  ]
}

export function getInitialChildren(
  rootNodes: TreeNodeType[],
): [string, string[]][] {
  // console.log(rootNodes)

  return [
    [TREE_ID, rootNodes.map(node => node.id)],
    ...rootNodes.flatMap(node => {
      return traverseForInitialChildren(node)
    }),
  ]
}

function traverseForInitialParent(
  node: TreeNodeType,
): [string, string][] {
  if (node.children == null) {
    return []
  }

  return [
    ...node.children.map((child: TreeNodeType): [string, string] => [
      child.id,
      node.id,
    ]),
    ...node.children.flatMap(child =>
      traverseForInitialParent(child),
    ),
  ]
}

export function getInitialParent(
  rootNodes: TreeNodeType[],
): [string, string][] {
  return [
    ...rootNodes.map((node): [string, string] => [node.id, TREE_ID]),
    ...rootNodes.flatMap(node => {
      return traverseForInitialParent(node)
    }),
  ]
}
export function getInitialTreeState(
  rootNodes: TreeNodeType[],
): TreeState {
  return {
    children: new MyMap<string, string[]>(
      getInitialChildren(rootNodes),
    ),
    parent: new MyMap<string, string>(getInitialParent(rootNodes)),
    selectedId: null,
    isOpen: new MyMap<string, boolean>([[TREE_ID, true]]),
  }
}
