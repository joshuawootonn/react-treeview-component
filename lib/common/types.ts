export type TreeNodeType = {
  id: string;
  name: string;
  children?: TreeNodeType[];
  isFolder?: boolean;
  isExpanded?: boolean;
};
