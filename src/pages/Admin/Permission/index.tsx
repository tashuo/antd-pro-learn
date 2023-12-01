import React, { useState } from 'react';
import { Button, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getAllMenus, updateMenusOrder } from '@/services/ant-design-pro/menu';
import { useIntl, useRequest } from '@umijs/max';
import { isNil } from 'lodash';
import { PageContainer, ModalForm, ProFormText } from '@ant-design/pro-components';
import { MenuDataItem } from '@umijs/route-utils';
import { ReactNode } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const transTreeData = (menus: API.Menu[]): DataNode[] => {
  return menus.map((v: API.Menu) => {
    v.title = v.name;
    v.key = v.id.toString();
    if (!isNil(v.children) && v.children.length > 0) {
      v.children = transTreeData(v.children) as API.Menu[];
    }
    return v as DataNode;
  });
};

const Menu: React.FC = () => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const intl = useIntl();
  useRequest(
    () => {
      return getAllMenus();
    },
    {
      onSuccess: (data) => {
        setTreeData(transTreeData(data));
        setExpandedKeys(data.map((v) => v.id.toString()));
      },
    },
  );

  const handleSave = () => {
    console.log(treeData);
    setSaveLoading(true);
    updateMenusOrder(treeData as API.Menu[]);
    setSaveLoading(false);
  };

  const titleRender = (nodeData: MenuDataItem): ReactNode => {
    console.log(nodeData);
    return (
      <div className="flex justify-between mr-2">
        <div>{nodeData.title}</div>
        <div className="flex justify-between space-x-2">
          <div>
            <EditOutlined />
          </div>
          <div>
            <DeleteOutlined />
          </div>
        </div>
      </div>
    );
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
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
    const menus = [...treeData];

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
    setTreeData(menus);
  };

  return (
    <PageContainer
      header={{
        extra: [
          <ModalForm
            key={1}
            title="新建表单"
            trigger={<Button type="primary">增加菜单</Button>}
            submitter={{
              render: (props, defaultDoms) => {
                return [
                  ...defaultDoms,
                  <Button
                    key="ok"
                    onClick={() => {
                      props.submit();
                    }}
                  >
                    ok
                  </Button>,
                ];
              },
            }}
            onFinish={async (values) => {
              console.log(values);
              return true;
            }}
          >
            <ProFormText
              width="md"
              name="name"
              label="签约客户名称"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
            />

            <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
          </ModalForm>,
        ],
      }}
      content={intl.formatMessage({
        id: 'pages.admin.menu.title',
        defaultMessage: '配置左侧菜单栏',
      })}
      footer={[
        <Button key="3">重置</Button>,
        <Button key="2" type="primary" onClick={handleSave} loading={saveLoading}>
          保存
        </Button>,
      ]}
    >
      <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDrop={onDrop}
        treeData={treeData}
        defaultExpandedKeys={expandedKeys}
        titleRender={titleRender}
      />
      <p style={{ textAlign: 'center', marginTop: 24 }}>
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
    </PageContainer>
  );
};

export default Menu;
