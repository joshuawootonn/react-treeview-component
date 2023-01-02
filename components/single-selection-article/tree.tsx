import { TreeNodeType } from 'lib/common/types'
import { TreeViewProvider } from 'lib/single-selection-article/tree-context'
import { TreeNode } from './tree-node'

type TreeViewProps = {
  initialValue: TreeNodeType[]
}

export function TreeView({ initialValue }: TreeViewProps) {
  return (
    <TreeViewProvider initialData={initialValue}>
      <ul>
        {initialValue.map(rootNode => (
          <TreeNode key={rootNode.id} node={rootNode} />
        ))}
      </ul>
    </TreeViewProvider>
  )
}
