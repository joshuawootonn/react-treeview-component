import { motion, AnimatePresence } from "framer-motion";
import { MyTreeNodeForNestedLad } from "lib/types";
import { useTreeView } from "lib/useTree";
import { Folder, File } from "./icons";
type TreeNodeProps = {
  node?: MyTreeNodeForNestedLad;
  isRoot: boolean;
};
export function TreeNode({ node, isRoot }: TreeNodeProps) {
  if (node == null) return null;

  const { isOpen, toggleOpen, getTreeProps } = useTreeView(
    node.id,
    node.children?.map((a) => a.id) ?? [],
    isRoot
  );

  return (
    <li
      role="treeitem"
      key={node.id + "div"}
      onClick={(e) => {
        e.stopPropagation();
        toggleOpen();
      }}
      className="cursor-pointer select-none flex flex-col"
      aria-expanded={
        node.children?.length != null &&
        node.children.length > 0 &&
        node.isExpanded
      }
      {...getTreeProps()}
    >
      <div className="flex flex-row items-center">
        {node.children?.length ?? 0 > 0 ? (
          <Folder isExpanded={node.isExpanded} className="h-4 w-4 mr-2 mb-1" />
        ) : (
          <File className="h-4 w-4 mr-2 mb-1" />
        )}
        {node.name}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            key={node.id + "ul"}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.25,
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.05,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.25,
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
            className="[&>li]:pl-3"
          >
            {node.children?.map((childNode) => {
              return (
                <TreeNode key={childNode.id} node={childNode} isRoot={false} />
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
