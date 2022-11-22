export type MyTreeNodeForNestedLad = {
  id: string;
  name: string;
  children?: MyTreeNodeForNestedLad[];
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
