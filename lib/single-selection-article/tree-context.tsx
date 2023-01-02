import { MyMap } from 'lib/common/MyMap'
import { TreeNodeType } from 'lib/common/types'
import {
  createContext,
  Dispatch,
  ReactNode,
  useReducer,
  MutableRefObject,
  createRef,
  useRef,
} from 'react'
import {
  getInitialChildren,
  getInitialParent,
  getInitialTreeState,
} from './tree-initialization'

export type TreeState = {
  selectedId: string | null
  children: MyMap<string, string[]>
  parent: MyMap<string, string>
}

export enum TreeActionTypes {
  SELECT = 'SELECT',
}

export type TreeActions = { type: TreeActionTypes.SELECT; id: string }

export type TreeViewContextType = {
  state: TreeState
  dispatch: Dispatch<TreeActions>
  elements: MutableRefObject<MyMap<string, HTMLElement>>
}

export const TreeViewContext = createContext<TreeViewContextType>({
  elements: { current: new MyMap() },
  state: {
    selectedId: null,
    children: new MyMap(),
    parent: new MyMap(),
  },
  dispatch: () => {
    console.error(
      'Woopsie! Looks like dispatch was called outside of a TreeViewContext',
    )
  },
})

export function reducer(
  state: TreeState,
  action: TreeActions,
): TreeState {
  switch (action.type) {
    case TreeActionTypes.SELECT:
      return {
        ...state,
        selectedId: action.id,
      }
    default:
      return state
  }
}

type TreeViewProviderProps = {
  children: ReactNode
  initialData: TreeNodeType[]
}

export function TreeViewProvider({
  children,
  initialData,
}: TreeViewProviderProps) {
  const [state, dispatch] = useReducer(
    reducer,
    getInitialTreeState(initialData),
  )
  const elements = useRef<MyMap<string, HTMLElement>>(new MyMap())

  return (
    <TreeViewContext.Provider value={{ state, dispatch, elements }}>
      {children}
    </TreeViewContext.Provider>
  )
}
