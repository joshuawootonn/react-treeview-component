import { TreeNode } from "components/tree-node";
import { motion } from "framer-motion";
import { data } from "lib/initialValue";
import { TreeViewProvider } from "lib/treeContext";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [state, setState] = useState(data);

  return (
    <motion.div className="flex flex-col justify-start items-start p-12 space-y-12">
      <button> Button before </button>
      <TreeViewProvider>
        <ul
          role="tree"
          aria-label="File Manager"
          aria-multiselectable="false"
          className="w-[200px]"
        >
          {state.children?.map((node) => {
            return <TreeNode key={node.id} isRoot={true} node={node} />;
          })}
        </ul>
      </TreeViewProvider>

      <button> Button after </button>
    </motion.div>
  );
};

export default Home;
