import type { NextPage } from "next";
import { InitialResearchTree } from "components/research/tree";
import { Tree } from "components/single-selection/tree";

const Home: NextPage = () => {
  return (
    <div className="flex flex-row">
      <div className="w-[300px] h-[400px] space-y-8">
        <button> Button before </button>
        <Tree />
        <button> Button after </button>
      </div>
      <InitialResearchTree />
    </div>
  );
};

export default Home;
