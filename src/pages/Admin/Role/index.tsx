import { addRole, getRoles, removeRole, updateRole } from '@/services/ant-design-pro/role';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import CreateForm from './components/CreateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.AddRole) => {
  const hide = message.loading('正在添加');
  try {
    await addRole(fields);
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.AddRole) => {
  const hide = message.loading('正在更新');
  try {
    await updateRole(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param role
 */
const handleRemove = async (role: API.Role) => {
  const hide = message.loading('正在删除');
  if (!role) return true;
  try {
    await removeRole(role.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请稍后再试');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Role>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.Role>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      search: false,
    },
    {
      title: <FormattedMessage id="manage.role.name" defaultMessage="name" />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="manage.role.slug" defaultMessage="slug" />,
      dataIndex: 'slug',
      tip: 'The slug is the unique key',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type='default'
          size='small'
          key="edit"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.edit" defaultMessage="edit" />
        </Button>,
        <Popconfirm
          key="delete"
          title=""
          description="确认删除改角色?"
          okText="删除"
          cancelText="取消"
          onConfirm={
            async () => {
              await handleRemove(record);
              actionRef.current?.reloadAndRest?.();
            }
          }
        >
          <Button danger size='small'>Delete</Button>
        </Popconfirm>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Role, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.roles.title',
          defaultMessage: 'role list',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getRoles}
        columns={columns}
      />
      <CreateForm
          open={createModalOpen}
          onOpenChange={handleModalOpen}
          onFinish={async (value) => {
            console.log(value)
            const success = await handleAdd(value as API.AddRole);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
      />
      <UpdateForm
        onFinish={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onOpenChange={handleUpdateModalOpen}
        updateModalOpen={updateModalOpen}
        values={currentRow || {} as API.Role}
      />
    </PageContainer>
  );
};

export default TableList;
