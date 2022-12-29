import classNames from 'classnames'
import { TreeNodeType } from 'lib/common/types'
import { useTreeNode } from 'lib/single-selection-article/useTreeNode'

type TreeNodeProps = {
  node: TreeNodeType
}

export function TreeNode({ node }: TreeNodeProps) {
  const { isSelected, treeNodeProps } = useTreeNode(node.id)
  return (
    <li
      className={classNames(
        'focus:outline-none [&:focus>div]:border-slate-400',
      )}
      {...treeNodeProps}
    >
      <div
        className={classNames(
          'border-[1.5px] border-transparent',
          isSelected ? 'bg-slate-200' : 'bg-transparent',
        )}
      >
        {node.name}
      </div>
      <ul className="pl-4 ">
        {node.children?.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </ul>
    </li>
  )
}
