import type { NextPage } from "next";
import { InitialResearchTree } from "components/research/tree";
import { Tree } from "components/single-selection/tree";

const Home: NextPage = () => {
  return (
    <div className="prose w-full p-8 mx-auto max-w-4xl">
      <h1>Treeview demo</h1>
      <h2>Single selection</h2>
      <div className="w-[300px] h-[400px] space-y-8 flex flex-col not-prose">
        <button>Focusable element before tree</button>
        <Tree />
        <button>Focusable element after tree</button>
      </div>
    </div>
  );
};

export default Home;
