import type { NextPage } from "next";
import { InitialResearchTree } from "components/research/tree";

const Home: NextPage = () => {
  return (
    <div className="flex flex-row">
      <InitialResearchTree />
    </div>
  );
};

export default Home;
