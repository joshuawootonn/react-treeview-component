import { useContext, FocusEvent, MouseEvent, KeyboardEvent } from "react";
import isHotkey from "is-hotkey";

import { TreeViewContextType, TreeViewContext } from "./tree-context";
import { TreeActionTypes, TREE_AREA_ID, TREE_ID } from "./tree-state";
import {
  getFirstChildNode,
  getFirstNode,
  getLastNode,
  getNextByTypeahead,
  getNextFocusable,
  getParentNode,
  getPreviousFocusable,
} from "./tree-traversal";
import { TreeNodeMetadataType } from "lib/research/treeContext";

export function useTreeNode(id: string): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isFocused: boolean;
  isSelected: boolean;
  children: string[];
  metadata: TreeNodeMetadataType;
  getTreeNodeProps: () => {
    ref: (current: HTMLElement | null) => void;
    tabIndex: number;
    onClick: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onBlur: (event: FocusEvent) => void;
    onFocus: (event: FocusEvent) => void;
  };
} {
  const { state, dispatch, elements } =
    useContext<TreeViewContextType>(TreeViewContext);
  const { focusableId } = state;

  const isOpen = state.isOpen.get(id) ?? false;
  const metadata = state.metadata.get(id) ?? {
    name: "Untitled",
    isFolder: false,
  };
  const children = state.children.get(id) ?? [];

  return {
    isOpen,
    metadata,
    children,
    isFocused: state.focusedId === id,
    isSelected: state.selectedId === id,
    open: function () {
      dispatch({ type: TreeActionTypes.OPEN, id });
    },
    close: function () {
      dispatch({ type: TreeActionTypes.CLOSE, id });
    },
    getTreeNodeProps: () => ({
      ref: function (current: HTMLElement | null) {
        if (current) {
          elements.current.set(id, current);
        } else {
          elements.current.delete(id);
        }
      },
      tabIndex: focusableId === id ? 0 : -1,
      onClick: function (event: MouseEvent) {
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        // is this the left mouse button / main mouse button
        if (event.button === 0) {
          event.stopPropagation();

          if (metadata.isFolder) {
            isOpen
              ? dispatch({ type: TreeActionTypes.CLOSE, id })
              : dispatch({ type: TreeActionTypes.OPEN, id });
          }
          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id });
          dispatch({ type: TreeActionTypes.SELECT, id });
        }
      },
      onKeyDown: function (event: KeyboardEvent) {
        event.stopPropagation();
        if (isHotkey("up", event)) {
          const prevId = getPreviousFocusable(state, id);
          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: prevId });
          elements.current.get(prevId)?.focus();
        }

        if (isHotkey("down", event)) {
          const nextId = getNextFocusable(state, id);
          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: nextId });
          elements.current.get(nextId)?.focus();
        }

        if (isHotkey("left", event)) {
          if (isOpen && metadata.isFolder) {
            dispatch({ type: TreeActionTypes.CLOSE, id });
          } else if (state.parent.get(id) !== TREE_ID) {
            const prevId = getParentNode(state, id);
            dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: prevId });
            elements.current.get(prevId)?.focus();
          }
        }

        if (isHotkey("right", event)) {
          if (isOpen && metadata.isFolder) {
            const nextId = getFirstChildNode(state, id);
            dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: nextId });
            elements.current.get(nextId)?.focus();
          } else {
            dispatch({ type: TreeActionTypes.OPEN, id });
          }
        }

        if (isHotkey("home", event)) {
          const id = getFirstNode(state);
          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id });
          elements.current.get(id)?.focus();
        }

        if (isHotkey("end", event)) {
          const id = getLastNode(state);

          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id });
          elements.current.get(id)?.focus();
        }

        if (isHotkey("space", event)) {
          dispatch({ type: TreeActionTypes.SELECT, id });
        }

        if (metadata.isFolder && isHotkey("space", event)) {
          isOpen
            ? dispatch({ type: TreeActionTypes.CLOSE, id })
            : dispatch({ type: TreeActionTypes.OPEN, id });
        }

        if (/^[a-z]$/i.test(event.key) && state.focusedId) {
          const id = getNextByTypeahead(state, event.key);

          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id });
          elements.current.get(id)?.focus();
        }
      },
      onFocus: function (event: FocusEvent) {
        event.stopPropagation();
        dispatch({ type: TreeActionTypes.FOCUS, id });
      },
      onBlur: function (event: FocusEvent) {
        event.stopPropagation();
        dispatch({ type: TreeActionTypes.BLUR, id });
      },
    }),
  };
}
