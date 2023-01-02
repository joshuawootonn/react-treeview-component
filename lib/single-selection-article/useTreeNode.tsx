import isHotkey from 'is-hotkey'
import { useContext, KeyboardEvent, MouseEvent } from 'react'
import {
  TreeActionTypes,
  TreeViewContext,
  TreeViewContextType,
} from './tree-context'
import { getNextNode, getPreviousNode } from './tree-traversal'

export function useTreeNode(id: string): {
  isSelected: boolean
  treeNodeProps: {
    ref: (current: HTMLElement | null) => void
    tabIndex: number
    onClick: (event: MouseEvent) => void
    onKeyDown: (event: KeyboardEvent) => void
  }
} {
  const { state, dispatch, elements } =
    useContext<TreeViewContextType>(TreeViewContext)

  return {
    isSelected: state.selectedId === id,
    treeNodeProps: {
      ref: function (current: HTMLElement | null) {
        if (current) {
          elements.current.set(id, current)
        } else {
          elements.current.delete(id)
        }
      },
      tabIndex: state.selectedId === id ? 0 : -1,
      onClick: function (e: MouseEvent) {
        e.stopPropagation()
        dispatch({ type: TreeActionTypes.SELECT, id })
      },
      onKeyDown: function (e: KeyboardEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (isHotkey('down', e)) {
          const nextNode = getNextNode(state, id)
          elements.current.get(nextNode)?.focus()
        }
        if (isHotkey('up', e)) {
          const prevNode = getPreviousNode(state, id)
          elements.current.get(prevNode)?.focus()
        }
        if (isHotkey('space', e) || isHotkey('enter', e)) {
          dispatch({ type: TreeActionTypes.SELECT, id: id })
        }
      },
    },
  }
}
