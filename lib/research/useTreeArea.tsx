import { useContext, FocusEvent, MouseEvent, KeyboardEvent } from "react";
import {
  TreeActionTypes,
  getNextFocusableNode,
  getPreviousFocusableNode,
  TreeViewContext,
  TreeViewContextType,
} from "./treeContext";
import isHotkey from "is-hotkey";
import { TREE_AREA_ID } from "components/research/tree-area";

export function useTreeArea(id: string): {
  isFocused: boolean;
  pasteIntoTreeArea: (() => void) | null;
  getTreeAreaProps: () => {
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
  const { focusableId, copiedId } = state;

  // console.log({ focusedId: state.focusedId });

  return {
    isFocused: state.focusedId === id,
    pasteIntoTreeArea:
      copiedId != null
        ? function () {
            dispatch({ type: TreeActionTypes.PASTE, to: TREE_AREA_ID });
            dispatch({ type: TreeActionTypes.SELECT, id: copiedId });
            dispatch({
              type: TreeActionTypes.SET_FOCUSABLE,
              id: copiedId,
            });
            dispatch({ type: TreeActionTypes.FOCUS, id: copiedId });
          }
        : null,
    getTreeAreaProps: () => ({
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

          dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id });
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

        if (isHotkey("cmd+v", event) && state.copiedId != null) {
          dispatch({ type: TreeActionTypes.PASTE, to: id });
          dispatch({ type: TreeActionTypes.SELECT, id: state.copiedId });
          dispatch({
            type: TreeActionTypes.SET_FOCUSABLE,
            id: state.copiedId,
          });
          dispatch({ type: TreeActionTypes.FOCUS, id: state.copiedId });
        }
      },
      onFocus: function (event: FocusEvent) {
        event.stopPropagation();
        console.log("your click is just focusing the tree-area");

        dispatch({ type: TreeActionTypes.FOCUS, id });
      },
      onBlur: function (event: FocusEvent) {
        event.stopPropagation();
        dispatch({ type: TreeActionTypes.BLUR, id });
      },
    }),
  };
}
