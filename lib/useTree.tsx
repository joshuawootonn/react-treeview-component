import { ComponentPropsWithRef, useContext, useLayoutEffect } from "react";
import {
  getNextFocusableNode,
  getPreviousFocusableNode,
  TreeType,
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
  toggleOpen: () => void;
  getTreeProps: any;
} {
  const { state, dispatch, elements } =
    useContext<TreeViewContextType>(TreeViewContext);
  const { isOpen, focusableId } = state;

  useLayoutEffect(() => {
    dispatch({
      type: isRoot ? "REGISTER_ROOT_NODE" : "REGISTER_NODE",
      id,
      childrenIds,
    });

    return () => {
      dispatch({
        type: isRoot ? "DEREGISTER_ROOT_NODE" : "DEREGISTER_NODE",
        id,
        childrenIds,
      });
    };
  }, [isRoot]);

  return {
    isOpen: isOpen.get(id) ?? false,
    toggleOpen: function () {
      dispatch({ type: "TOGGLE_OPEN", id });
    },
    getTreeProps: (): ComponentPropsWithRef<"li"> => ({
      ref: function (current: HTMLElement | null) {
        if (current) {
          elements.current.set(id, current);
        } else {
          elements.current.delete(id);
        }
      },
      tabIndex: focusableId === id ? 0 : -1,
      onKeyDown: function (event: React.KeyboardEvent) {
        event.stopPropagation();
        if (isHotkey("up", event)) {
          //   console.log("up");
          const prevId = getPreviousFocusableNode(state, id);
          //   console.log({ prevId });
          dispatch({ type: "FOCUS", id: prevId });
          elements.current.get(prevId)?.focus();
        }

        if (isHotkey("down", event)) {
          console.log("down", event);
          const nextId = getNextFocusableNode(state, id);
          console.log({ nextId });
          dispatch({ type: "FOCUS", id: nextId });
          elements.current.get(nextId)?.focus();
        }

        if (isHotkey("left", event) || isHotkey("right", event)) {
          dispatch({ type: "TOGGLE_OPEN", id });
        }
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
