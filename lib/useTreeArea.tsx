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

export function useTreeArea(id: string): {
  isFocused: boolean;
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
  const { focusableId } = state;

  return {
    isFocused: state.focusedId === id,
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
        // // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        // if (event.button === 0) {
        //   event.stopPropagation();

        //   dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id });
        // }
      },
      onKeyDown: function (event: KeyboardEvent) {
        // event.stopPropagation();
        // if (isHotkey("up", event)) {
        //   const prevId = getPreviousFocusableNode(state, id);
        //   dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: prevId });
        //   elements.current.get(prevId)?.focus();
        // }

        // if (isHotkey("down", event)) {
        //   const nextId = getNextFocusableNode(state, id);
        //   dispatch({ type: TreeActionTypes.SET_FOCUSABLE, id: nextId });
        //   elements.current.get(nextId)?.focus();
        // }
      },
      onFocus: function (event: FocusEvent) {
        // event.stopPropagation();
        // dispatch({ type: TreeActionTypes.FOCUS, id });
      },
      onBlur: function (event: FocusEvent) {
        // event.stopPropagation();
        // dispatch({ type: TreeActionTypes.BLUR, id });
      },
    }),
  };
}
