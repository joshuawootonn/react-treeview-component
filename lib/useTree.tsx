import React, {
  ComponentPropsWithRef,
  useContext,
  useLayoutEffect,
} from "react";
import {
  TreeActionTypes,
  getNextFocusableNode,
  getPreviousFocusableNode,
  TreeViewContext,
  TreeViewContextType,
} from "./treeContext";
import isHotkey from "is-hotkey";

export function useTreeView(
  id: string,
  childrenIds: string[],
  isRoot?: boolean
): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isFocused: boolean;
  isSelected: boolean;
  getTreeProps: any;
} {
  const { state, dispatch, elements } =
    useContext<TreeViewContextType>(TreeViewContext);
  const { isOpen, focusableId } = state;
  const isFolder = state.children.get(id)?.length;

  useLayoutEffect(() => {
    dispatch({
      type: isRoot
        ? TreeActionTypes.REGISTER_ROOT_NODE
        : TreeActionTypes.REGISTER_NODE,
      id,
      childrenIds,
    });

    return () => {
      dispatch({
        type: isRoot
          ? TreeActionTypes.DEREGISTER_ROOT_NODE
          : TreeActionTypes.DEREGISTER_NODE,
        id,
        childrenIds,
      });
    };
  }, [isRoot]);

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
    getTreeProps: (): ComponentPropsWithRef<"li"> => ({
      ref: function (current: HTMLElement | null) {
        if (current) {
          elements.current.set(id, current);
        } else {
          elements.current.delete(id);
        }
      },
      tabIndex: focusableId === id ? 0 : -1,
      onMouseDown: function (event: React.MouseEvent) {
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        if (event.button === 0) {
          event.stopPropagation();

          if (isFolder) {
            isOpen.get(id)
              ? dispatch({ type: TreeActionTypes.CLOSE, id })
              : dispatch({ type: TreeActionTypes.OPEN, id });
          }

          dispatch({ type: TreeActionTypes.SELECT, id });
        }
      },
      onKeyDown: function (event: React.KeyboardEvent) {
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
      onFocus: function (event: React.FocusEvent) {
        event.stopPropagation();
        dispatch({ type: TreeActionTypes.FOCUS, id });
      },
      onBlur: function (event: React.FocusEvent) {
        event.stopPropagation();
        dispatch({ type: TreeActionTypes.BLUR, id });
      },
    }),
  };
}

// if(children && isExpanded) firstChild

// if(!isExpanded || !children) {
//     if(isRoot) {
//         nextRoot
//     }
//     else {
//         getParent

//     goto next child
//     }
// }
