import React, { useState } from 'react';
import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getAllMenus } from '@/services/ant-design-pro/menu';
import { useRequest } from '@umijs/max';
import { isNil } from 'lodash';

const transTreeData = (menus: API.Menu[]): DataNode[] => {
    return menus.map((v: API.Menu) => {
      v.title = v.name;
      v.key = v.id.toString();
      if (!isNil(v.children) && v.children.length > 0) {
        v.children = transTreeData(v.children) as API.Menu[];
      }
      return v as DataNode;
    })
}

const Menu: React.FC = () => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  useRequest(() => {
    return getAllMenus();
  }, {
    onSuccess: (data) => {
      setTreeData(transTreeData(data));
    }
  })
  
  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const menus = treeData as unknown as DataNode[];

    // Find dragObject
    let dragObj: DataNode;
    loop(menus, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(menus, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(menus, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(menus, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    console.log(menus)
    setTreeData(menus)
  };

  return (
    <Tree
      className="draggable-tree"
      draggable
      blockNode
      onDrop={onDrop}
      treeData={treeData}
    />
  );
};

export default Menu;