import { TreeState } from './tree-context'

export function getNextNode(
  state: TreeState,
  id: string,
  prevId?: string,
): string {
  const children = state.children.get(id)
  const isOpen = state.isOpen.get(id)

  if (isOpen && children != null && children.length > 0) {
    const currentNode = children.findIndex(
      childId => childId === prevId,
    )

    const siblingNode = children.at(currentNode + 1)

    if (siblingNode) {
      return siblingNode
    }
  }

  const parent = state.parent.get(id)

  if (parent) {
    return getNextNode(state, parent, id)
  }

  return id
}

function getDeepestChild(state: TreeState, id: string): string {
  const isOpen = state.isOpen.get(id)
  if (!isOpen) return id

  const children = state.children.get(id)
  const deeperChild = children?.at(children.length - 1)
  if (deeperChild == null) return id
  return getDeepestChild(state, deeperChild)
}

export function getPreviousNode(
  state: TreeState,
  id: string,
): string {
  const parent = state.parent.get(id)
  const siblings = state.children.get(parent ?? '')
  if (parent != null && siblings != null) {
    if (siblings?.at(0) === id) {
      return parent
    } else {
      const currentNode = siblings?.findIndex(
        childId => childId === id,
      )

      const siblingNode = siblings.at(currentNode - 1)

      if (siblingNode) {
        return getDeepestChild(state, siblingNode)
      }
    }
  }

  return id
}
