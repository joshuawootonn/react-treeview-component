import { AnimatePresence, motion } from "framer-motion";
import { initialValue } from "lib/initialValue";
import { TreeViewContext, TreeViewProvider } from "lib/treeContext";
import { MyTreeNode } from "lib/types";
import type { NextPage } from "next";
import { useContext, useState } from "react";
import { File, Folder } from "../components/icons";

function TreeNode({ node }: { node?: MyTreeNode }) {
  if (node == null) return null;

  const { arr, obj, updateNode, getChildren } = useContext(TreeViewContext);

  return (
    <div
      role="treeitem"
      key={node.id + "div"}
      onClick={(e) => {
        e.stopPropagation();
        return updateNode({ ...node, isExpanded: !node.isExpanded });
      }}
      className="cursor-pointer select-none flex flex-col"
      aria-expanded={getChildren(node).length > 0 && node.isExpanded}
    >
      <div className="flex flex-row items-center">
        {node.isFolder ? (
          <Folder isExpanded={node.isExpanded} className="h-4 w-4 mr-2 mb-1" />
        ) : (
          <File className="h-4 w-4 mr-2 mb-1" />
        )}
        {node.name}
      </div>
      <AnimatePresence initial={false}>
        {node.isExpanded && (
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
            {arr.map((id) => {
              const curr = obj[id];
              if (curr.parentId !== node.id) return;
              console.log(curr);

              return (
                <motion.li key={node.id + curr.id + "li"}>
                  <TreeNode node={curr} />
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const Home: NextPage = () => {
  const [value, setValue] = useState(() => {
    return {
      rootId: initialValue.find((curr) => curr.parentId == null)?.id ?? "0",
      arr: initialValue.map((curr) => curr.id),
      obj: initialValue.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr }),
        {}
      ) as Record<string, MyTreeNode>,
    };
  });

  return (
    <motion.div className="flex flex-col justify-start items-start p-12">
      <TreeViewProvider>
        <ul role="tree" aria-label="File Manager" aria-multiselectable="false">
          {value.arr.map((id) => {
            if (value.obj[id].parentId != null) {
              return null;
            }
            return (
              <li>
                <TreeNode node={value.obj[id]} />
              </li>
            );
          })}
        </ul>
      </TreeViewProvider>
      <p>content</p>
      <button> nice</button>
    </motion.div>
  );
};

export default Home;
