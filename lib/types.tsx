export type TreeNodeType = {
  id: string;
  name: string;
  children?: TreeNodeType[];
  isFolder?: boolean;
  isExpanded?: boolean;
};
export type MyTreeNodeForArray = {
  id: string;
  name: string;
  parentId?: string;
  // childrenIds?: string[];
  isFolder?: boolean;
  isExpanded?: boolean;
};
