import { MyMap } from 'lib/common/MyMap'
import { TreeNodeType } from 'lib/common/types'
import {
  createContext,
  Dispatch,
  ReactNode,
  useReducer,
  MutableRefObject,
  useRef,
} from 'react'
import { getInitialTreeState } from './tree-initialization'

export type TreeState = {
  selectedId: string | null
  isOpen: MyMap<string, boolean>
  children: MyMap<string, string[]>
  parent: MyMap<string, string>
}

export enum TreeActionTypes {
  SELECT = 'SELECT',
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export type TreeActions =
  | { type: TreeActionTypes.SELECT; id: string }
  | {
      type: TreeActionTypes.OPEN
      id: string
    }
  | {
      type: TreeActionTypes.CLOSE
      id: string
    }

export type TreeViewContextType = {
  state: TreeState
  dispatch: Dispatch<TreeActions>
  elements: MutableRefObject<MyMap<string, HTMLElement>>
}

export const TreeViewContext = createContext<TreeViewContextType>({
  elements: { current: new MyMap() },
  state: {
    selectedId: null,
    isOpen: new MyMap(),
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
    case TreeActionTypes.OPEN:
      return {
        ...state,
        isOpen: new MyMap(state.isOpen).set(action.id, true),
      }
    case TreeActionTypes.CLOSE:
      return {
        ...state,
        isOpen: new MyMap(state.isOpen).set(action.id, false),
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
