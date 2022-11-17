import { MyTreeNode } from "./types";

// export const data: Node = {
//   id: "root",
//   name: "Parent",
//   children: [
//     {
//       id: "1",
//       name: "Child - 1",
//       children: [
//         {
//           id: "3",
//           name: "Child - 3",
//           children: [
//             {
//               id: "6",
//               name: "Child - 6",
//               children: [
//                 {
//                   id: "8",
//                   name: "Child - 8",
//                   children: [
//                     {
//                       id: "10",
//                       name: "Child - 10",
//                     },
//                     {
//                       id: "11",
//                       name: "Child - 11",
//                     },
//                   ],
//                 },
//                 {
//                   id: "9",
//                   name: "Child - 9",
//                 },
//               ],
//             },
//             {
//               id: "7",
//               name: "Child - 7",
//               children: [
//                 {
//                   id: "8",
//                   name: "Child - 8",
//                   children: [
//                     {
//                       id: "10",
//                       name: "Child - 10",
//                     },
//                     {
//                       id: "11",
//                       name: "Child - 11",
//                     },
//                   ],
//                 },
//                 {
//                   id: "9",
//                   name: "Child - 9",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           id: "4",
//           name: "Child - 4",
//         },
//         {
//           id: "5",
//           name: "Child - 5",
//           children: [
//             {
//               id: "10",
//               name: "Child - 10",
//             },
//             {
//               id: "11",
//               name: "Child - 11",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "3",
//       name: "Child - 3",
//       children: [
//         {
//           id: "3",
//           name: "Child - 3",
//           children: [
//             {
//               id: "6",
//               name: "Child - 6",
//               children: [
//                 {
//                   id: "8",
//                   name: "Child - 8",
//                   children: [
//                     {
//                       id: "10",
//                       name: "Child - 10",
//                     },
//                     {
//                       id: "11",
//                       name: "Child - 11",
//                     },
//                   ],
//                 },
//                 {
//                   id: "9",
//                   name: "Child - 9",
//                 },
//               ],
//             },
//             {
//               id: "7",
//               name: "Child - 7",
//             },
//           ],
//         },
//         {
//           id: "4",
//           name: "Child - 4",
//         },
//         {
//           id: "5",
//           name: "Child - 5",
//         },
//       ],
//     },
//     {
//       id: "3",
//       name: "Child - 3",
//       children: [
//         {
//           id: "3",
//           name: "Child - 3",
//           children: [
//             {
//               id: "6",
//               name: "Child - 6",
//               children: [
//                 {
//                   id: "8",
//                   name: "Child - 8",
//                   children: [
//                     {
//                       id: "10",
//                       name: "Child - 10",
//                     },
//                     {
//                       id: "11",
//                       name: "Child - 11",
//                     },
//                   ],
//                 },
//                 {
//                   id: "9",
//                   name: "Child - 9",
//                 },
//               ],
//             },
//             {
//               id: "7",
//               name: "Child - 7",
//             },
//           ],
//         },
//         {
//           id: "4",
//           name: "Child - 4",
//         },
//         {
//           id: "5",
//           name: "Child - 5",
//           children: [
//             {
//               id: "8",
//               name: "Child - 8",
//               children: [
//                 {
//                   id: "10",
//                   name: "Child - 10",
//                 },
//                 {
//                   id: "11",
//                   name: "Child - 11",
//                 },
//               ],
//             },
//             {
//               id: "9",
//               name: "Child - 9",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

export const initialValue: MyTreeNode[] = [
  {
    id: "1",
    name: "Folder - Root",
    isFolder: true,
    isExpanded: true,
  },
  {
    id: "2",
    name: "Folder - 1",
    isFolder: true,
    isExpanded: true,
    parentId: "1",
  },
  {
    id: "3",
    name: "File - 3",
    isFolder: false,
    parentId: "1",
  },
  {
    id: "4",
    name: "File - 4",
    isFolder: false,
    parentId: "1",
  },
  {
    id: "5",
    name: "File - 5",
    isFolder: false,
    parentId: "2",
  },
  {
    id: "6",
    name: "File - 6",
    isFolder: false,
    parentId: "2",
  },
  {
    id: "11",
    name: "Folder - Root 2",
    isFolder: true,
    isExpanded: true,
  },
  {
    id: "21",
    name: "Folder - 11",
    isFolder: true,
    isExpanded: true,
    parentId: "11",
  },
  {
    id: "31",
    name: "Folder - 31",
    isFolder: true,
    parentId: "11",
  },
  {
    id: "41",
    name: "File - 41",
    isFolder: false,
    parentId: "11",
  },
  {
    id: "51",
    name: "File - 51",
    isFolder: false,
    parentId: "31",
  },
  {
    id: "61",
    name: "File - 61",
    isFolder: false,
    parentId: "31",
  },
];

// export const initialValue: MyTreeNode[] = [
//   {
//     id: "1",
//     name: "Folder - Root",
//     isFolder: true,
//     isExpanded: true,
//     childrenIds: ["2", "3", "4"],
//   },
//   {
//     id: "2",
//     name: "Folder - 1",
//     isFolder: true,
//     isExpanded: true,
//     childrenIds: ["5", "6"],
//   },
//   {
//     id: "3",
//     name: "File - 1",
//     isFolder: false,
//   },
//   {
//     id: "4",
//     name: "File - 2",
//     isFolder: true,
//   },
//   {
//     id: "5",
//     name: "File - 5",
//     isFolder: false,
//   },
//   {
//     id: "6",
//     name: "File - 6",
//     isFolder: true,
//   },
// ];
