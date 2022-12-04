import { useContext, FocusEvent, MouseEvent, KeyboardEvent } from "react";
import {
  TreeActionTypes,
  getNextFocusableNode,
  getPreviousFocusableNode,
  TreeViewContext,
  TreeViewContextType,
  TreeNodeMetadataType,
} from "./treeContext";
import isHotkey from "is-hotkey";

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
  const { isOpen, focusableId } = state;
  const isFolder = state.children.get(id)?.length;
  const metadata = state.metadata.get(id) ?? {
    name: "Untitled",
    isFolder: false,
  };

  return {
    isOpen: isOpen.get(id) ?? false,
    open: function () {
      dispatch({ type: TreeActionTypes.OPEN, id });
    },
    close: function () {
      dispatch({ type: TreeActionTypes.CLOSE, id });
    },
    isFocused: state.focusedId === id,
    isSelected: state.selectedId === id,
    children: state.children.get(id) ?? [],
    metadata,
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
        if (event.button === 0) {
          event.stopPropagation();

          if (metadata.isFolder) {
            isOpen.get(id)
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
          const prevId = getPreviousFocusableNode(state, id);
          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: prevId });
          elements.current.get(prevId)?.focus();
        }

        if (isHotkey("down", event)) {
          const nextId = getNextFocusableNode(state, id);
          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: nextId });
          elements.current.get(nextId)?.focus();
        }

        if (isHotkey("left", event)) {
          dispatch({ type: TreeActionTypes.CLOSE, id });
        }

        if (isHotkey("right", event)) {
          dispatch({ type: TreeActionTypes.OPEN, id });
        }

        if (!isFolder && isHotkey("space", event)) {
          dispatch({ type: TreeActionTypes.SELECT, id });
        }

        if (isFolder && isHotkey("space", event)) {
          isOpen.get(id)
            ? dispatch({ type: TreeActionTypes.OPEN, id })
            : dispatch({ type: TreeActionTypes.CLOSE, id });
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
