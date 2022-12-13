import { TreeState } from "./tree-state";
import { TREE_ID } from "./tree-state";

export function getFirstNode(state: TreeState): string {
  return state.children.get(TREE_ID)?.at(0) ?? TREE_ID;
}

export function getLastNode(state: TreeState): string {
  function traverse(id: string): string {
    const lastChildId = state.children.get(id)?.at(-1);

    if (lastChildId == null) return id;

    const metadata = state.metadata.get(lastChildId);
    const isOpen = state.isOpen.get(lastChildId);
    const hasChildren = (state.children.get(lastChildId)?.length ?? 0) > 0;

    if (metadata?.isFolder && isOpen && hasChildren) {
      return traverse(lastChildId);
    }

    return lastChildId;
  }

  return traverse(TREE_ID);
}

export function getParentNode(state: TreeState, childId: string): string {
  return state.parent.get(childId) ?? childId;
}

export function getFirstChildNode(state: TreeState, parentId: string): string {
  return state.children.get(parentId)?.at(0) ?? parentId;
}

export function getNextFocusable(state: TreeState, originalId: string): string {
  return traverse(originalId);

  function traverse(id: string, prevId?: string): string {
    if (id === TREE_ID) {
      let arr = state.children.get(TREE_ID);
      if (!arr) return id;

      if (prevId) {
        let indexOfPrevId = arr.findIndex((ele: any) => prevId === ele);
        let nextNodeId = arr[indexOfPrevId + 1];
        if (nextNodeId == null) return originalId;
        return nextNodeId;
      } else {
        return arr[0] ?? originalId;
      }
    }

    const isCurrentOpen = state.isOpen.get(id);
    const currentChildren = state.children.get(id);
    if (
      isCurrentOpen &&
      currentChildren &&
      (currentChildren?.length ?? 0) > 0
    ) {
      if (originalId == id) {
        return currentChildren?.at(0) ?? id;
      }

      const currentLocation = currentChildren.findIndex(
        (childId) => childId === prevId
      );

      if (currentLocation !== currentChildren.length - 1) {
        return currentChildren.at(currentLocation + 1) ?? prevId ?? id;
      }
    }

    const parent = state.parent.get(id);
    // console.log({ parent, id });

    if (parent) {
      return traverse(parent, id);
    }

    return id;
  }
}

export function getPreviousFocusable(
  state: TreeState,
  originalId: string
): string {
  if (originalId === TREE_ID) {
    return TREE_ID;
  }
  const parent = state.parent.get(originalId);
  if (parent) {
    const siblingNodes = state.children.get(parent);

    if (siblingNodes == null || siblingNodes.length === 0) {
      throw new Error("shouldn't be here");
    }
    if (siblingNodes?.at(0) === originalId) {
      return parent;
    } else {
      //enter child after current
      const currentSiblingPosition = siblingNodes?.findIndex(
        (childId) => childId === originalId
      );

      if (currentSiblingPosition != null && currentSiblingPosition !== 0) {
        return traverse(
          siblingNodes.at(currentSiblingPosition - 1) ?? originalId
        );
      }
    }
  }

  throw new Error("Woops! Only the root should not have a parent");

  function traverse(id: string): string {
    // console.log(id);

    const children = state.children.get(id);
    // console.log({ children, isOpen: state.isOpen.get(id) == false });

    if (
      children == null ||
      children.length === 0 ||
      state.isOpen.get(id) == null ||
      state.isOpen.get(id) == false
    ) {
      return id;
    }
    return traverse(children.at(children.length - 1) ?? id);
  }
}

export function getNextByTypeahead(state: TreeState, typeaheadValue: string) {
  function traverse(state: TreeState, key: string, id: string): string {
    const lastId = getLastNode(state);
    const nextId =
      id === lastId ? getFirstNode(state) : getNextFocusable(state, id);
    const name = state.metadata.get(nextId)?.name;

    if (name?.charAt(0).toLowerCase() === key.charAt(0).toLowerCase()) {
      return nextId;
    }

    return traverse(state, nextId, key);
  }

  return traverse(
    state,
    typeaheadValue,
    state.focusedId ?? getFirstNode(state)
  );
}
