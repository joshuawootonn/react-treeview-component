import type { NextPage } from 'next'
import { InitialResearchTree } from 'components/research/tree'
import { Tree as DraftSingleSelectTree } from 'components/single-selection/tree'
import { TreeView } from 'components/single-selection-article/tree'
import { initialValue } from 'lib/common/initialValue'

const Home: NextPage = () => {
  return (
    <div className="prose w-full p-8 mx-auto max-w-4xl">
      <h1>Treeview demo</h1>
      <h2>Single selection wip</h2>
      <div className="w-[300px]  space-y-8 flex flex-col not-prose">
        <button>Focusable element before tree</button>
        {/* <DraftSingleSelectTree /> */}
        <TreeView initialValue={initialValue} />
        <button>Focusable element after tree</button>
      </div>
      <h2>Single selection</h2>
      <div className="w-[300px] h-[400px] space-y-8 flex flex-col not-prose">
        <button>Focusable element before tree</button>
        <DraftSingleSelectTree />
        {/* <TreeView initialValue={initialValue} /> */}
        <button>Focusable element after tree</button>
      </div>
    </div>
  )
}

export default Home
