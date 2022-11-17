export type MyTreeNode = {
  id: string;
  name: string;
  parentId?: string;
  // childrenIds?: string[];
  isFolder?: boolean;
  isExpanded?: boolean;
};
