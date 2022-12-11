import { data } from "lib/common/initialValue";
import { TreeViewProvider } from "lib/single-selection/tree-context";
import { TreeNode } from "./tree-node";

export function Tree() {
  return (
    <TreeViewProvider initialTree={data}>
      {({ rootNodeIds }) => (
        <ul
          role="tree"
          aria-label="File Manager"
          aria-multiselectable="false"
          className="h-full overflow-auto"
        >
          {rootNodeIds.map((id) => (
            <TreeNode id={id} key={id} />
          ))}
        </ul>
      )}
    </TreeViewProvider>
  );
}
