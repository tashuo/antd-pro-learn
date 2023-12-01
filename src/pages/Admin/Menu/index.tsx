import React, { useState } from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Tree,
  TreeSelect,
} from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getAllMenus, updateMenusOrder } from '@/services/ant-design-pro/menu';
import { useIntl, useRequest } from '@umijs/max';
import { isNil } from 'lodash';
import {
  PageContainer,
  ModalForm,
  ProFormText,
  ProFormTreeSelect,
  ProFormSelect,
  DrawerForm,
  ProForm,
  ProFormDateRangePicker,
} from '@ant-design/pro-components';
import { MenuDataItem } from '@umijs/route-utils';
import { ReactNode } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const Menu: React.FC = () => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const intl = useIntl();
  const transTreeData = (menus: API.Menu[], parent?: API.Menu): DataNode[] => {
    return menus.map((v: API.Menu) => {
      const intl_key = parent ? `${parent.name}.${v.name}` : v.name;
      v.title = intl.formatMessage({
        id: `menu.${intl_key}`,
        defaultMessage: v.name,
      });
      v.key = v.id.toString();
      if (!isNil(v.children) && v.children.length > 0) {
        v.children = transTreeData(v.children, v) as API.Menu[];
      }
      return v as DataNode;
    });
  };

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
    // console.log(nodeData)
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

  const [form] = Form.useForm<{ name: string; company: string }>();
  return (
    <PageContainer
      header={{
        extra: [
          <DrawerForm<{
            name: string;
            company: string;
          }>
            key={2}
            title="新建表单"
            resize={{
              onResize() {
                console.log('resize!');
              },
              maxWidth: window.innerWidth * 0.8,
              minWidth: 300,
            }}
            form={form}
            trigger={
              <Button type="primary">
                <PlusOutlined />
                新建表单
              </Button>
            }
            autoFocusFirstInput
            drawerProps={{
              destroyOnClose: true,
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
              console.log(values.name);
              // 不返回不会关闭弹框
              return true;
            }}
          >
            <ProForm.Group>
              <ProFormText
                name="name"
                width="md"
                label="签约客户名称"
                tooltip="最长为 24 位"
                placeholder="请输入名称"
              />
              <ProFormText
                rules={[
                  {
                    required: true,
                  },
                ]}
                width="md"
                name="company"
                label="我方公司名称"
                placeholder="请输入名称"
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText width="md" name="contract" label="合同名称" placeholder="请输入名称" />
              <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                options={[
                  {
                    value: 'chapter',
                    label: '盖章后生效',
                  },
                ]}
                width="xs"
                name="useMode"
                label="合同约定生效方式"
              />
              <ProFormSelect
                width="xs"
                options={[
                  {
                    value: 'time',
                    label: '履行完终止',
                  },
                ]}
                formItemProps={{
                  style: {
                    margin: 0,
                  },
                }}
                name="unusedMode"
                label="合同约定失效效方式"
              />
            </ProForm.Group>
            <ProFormText width="sm" name="id" label="主合同编号" />
            <ProFormText name="project" disabled label="项目名称" initialValue="xxxx项目" />
            <ProFormText
              width="xs"
              name="mangerName"
              disabled
              label="商务经理"
              initialValue="启途"
            />
          </DrawerForm>,
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

            <ProFormTreeSelect
              width="md"
              name="roles"
              label="角色"
              options={[
                {
                  title: 'Light',
                  value: 'light',
                  children: [{ title: 'Bamboo', value: 'bamboo' }],
                },
              ]}
            />

            <Form.Item label="测试角色" name="roles2" style={{ width: 'md' }}>
              <TreeSelect
                treeData={[
                  {
                    title: 'Light',
                    value: 'light',
                    children: [{ title: 'Bamboo', value: 'bamboo' }],
                  },
                ]}
              />
            </Form.Item>

            <ProFormSelect
              width="md"
              name="users"
              label="用户"
              options={[
                {
                  value: 'zhejiang',
                  label: '章三',
                },
                {
                  value: 'lisi',
                  label: '李四',
                },
              ]}
            />
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
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ size: 'default' }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Form Size" name="size">
          <Radio.Group>
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="large">Large</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Input">
          <Input />
        </Form.Item>
        <Form.Item label="Select">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="TreeSelect">
          <TreeSelect
            treeData={[
              { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] },
            ]}
          />
        </Form.Item>
        <Form.Item label="Cascader">
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [{ value: 'hangzhou', label: 'Hangzhou' }],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="InputNumber">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Switch" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Button">
          <Button>Button</Button>
        </Form.Item>
      </Form>
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
