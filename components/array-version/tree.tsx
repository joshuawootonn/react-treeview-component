import { TreeViewProvider } from 'lib/array-version/tree-context'
import { initialValue } from 'lib/common/initialValue'
import { TreeNode } from './tree-node'

export function Tree() {
  return (
    <TreeViewProvider initialTree={initialValue} label="File manager">
      {({ treeProps, rootIds }) => (
        <ul {...treeProps} className="h-full overflow-auto">
          {rootIds.map(id => (
            <TreeNode id={id} key={id} />
          ))}
        </ul>
      )}
    </TreeViewProvider>
  )
}
