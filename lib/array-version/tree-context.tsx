import React, {
  Dispatch,
  MutableRefObject,
  ReactNode,
  useReducer,
  useRef,
} from 'react'
import { MyMap } from 'lib/common/MyMap'
import { TreeNodeType } from 'lib/common/types'
import { getInitialTreeState } from './tree-initialization'
import { TreeActions, treeReducer, TreeState } from './tree-state'

export type TreeViewContextType = {
  state: TreeState
  dispatch: Dispatch<TreeActions>
  elements: MutableRefObject<MyMap<string, HTMLElement>>
}

export const TreeViewContext =
  React.createContext<TreeViewContextType>({
    state: getInitialTreeState([]),
    dispatch: () => {},
    elements: { current: new MyMap<string, HTMLElement>() },
  })

type TreeViewProviderProps = {
  children: ({
    dispatch,
    treeProps,
  }: {
    treeProps: {
      role: 'tree'
      ['aria-label']: string
      ['aria-multi-selectable']: 'false'
    }
    dispatch: React.Dispatch<TreeActions>
    elements: MutableRefObject<MyMap<string, HTMLElement>>
    state: TreeState
  }) => ReactNode | ReactNode[]
  initialTree: TreeNodeType[]
  label: string
}

export function TreeViewProvider({
  children,
  initialTree,
  label,
}: TreeViewProviderProps) {
  const elements = useRef<MyMap<string, HTMLElement>>(new MyMap())
  const [state, dispatch] = useReducer(
    treeReducer,
    getInitialTreeState(initialTree),
  )

  return (
    <TreeViewContext.Provider value={{ dispatch, elements, state }}>
      {children({
        treeProps: {
          role: 'tree',
          'aria-label': label,
          'aria-multi-selectable': 'false',
        },
        dispatch,
        elements,
        state,
      })}
    </TreeViewContext.Provider>
  )
}
