import classNames from 'classnames'
import isHotkey from 'is-hotkey'
import { TreeNodeType } from 'lib/common/types'
import {
  TreeActionTypes,
  TreeViewContext,
} from 'lib/single-selection-article/tree-context'
import {
  getNextNode,
  getPreviousNode,
} from 'lib/single-selection-article/tree-traversal'
import { useContext } from 'react'

type TreeNodeProps = {
  node: TreeNodeType
}

export function TreeNode({ node }: TreeNodeProps) {
  const { state, dispatch, elements } = useContext(TreeViewContext)
  return (
    <li
      className={classNames(
        state.selectedId === node.id
          ? 'bg-slate-200'
          : 'bg-transparent',
      )}
      ref={element => {
        if (element) {
          elements.current.set(node.id, element)
        } else {
          elements.current.delete(node.id)
        }
      }}
      tabIndex={state.selectedId === node.id ? 0 : -1}
      onClick={e => {
        e.stopPropagation()
        dispatch({ type: TreeActionTypes.SELECT, id: node.id })
      }}
      onKeyDown={e => {
        e.stopPropagation()
        console.log({ onKeyDown: 'true' })

        if (isHotkey('down', e)) {
          const nextNode = getNextNode(state, node.id)
          elements.current.get(nextNode)?.focus()
        }
        if (isHotkey('up', e)) {
          const prevNode = getPreviousNode(state, node.id)
          elements.current.get(prevNode)?.focus()
        }
      }}
    >
      {node.name}
      <ul className="pl-4">
        {node.children?.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </ul>
    </li>
  )
}
