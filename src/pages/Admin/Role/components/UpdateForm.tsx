import {
    ProFormText,
    ModalForm,
    ProFormTreeSelect,
  } from '@ant-design/pro-components';
  import { FormattedMessage, useIntl } from '@umijs/max';
  import React from 'react';
  import { TreeSelect } from 'antd';
import { getAllMenus } from '@/services/ant-design-pro/menu';

  const { SHOW_PARENT } = TreeSelect;
  
  export type UpdateFormProps = {
    onOpenChange: (state: boolean) => void;
    onFinish: (values: API.AddRole) => Promise<void>;
    updateModalOpen: boolean;
    values: API.Role;
  };
  
  const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const intl = useIntl();
    const transformMenuTree = (menus: API.Menu[], parent?: API.Menu): any => menus.map(menu => (
        {
            value: menu.id,
            label: intl.formatMessage({
                id: `menu.${parent ? `${parent.name}.${menu.name}` : menu.name}`,
                defaultMessage: menu.name,
            }),
            children: menu.children ? transformMenuTree(menu.children, menu) : [],
        }
    ))

    return (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.roles.add',
            defaultMessage: 'New Role',
          })}
          width={400}
          open={props.updateModalOpen}
          onOpenChange={props.onOpenChange}
          onFinish={props.onFinish}
          initialValues={{
            id: props.values.id,
            name: props.values.name,
            slug: props.values.slug,
            menus: props.values.menu_list?.map((v: any) => v.id as number),
          }}
          modalProps={{
            destroyOnClose: true,   // 关闭重置表单
          }}
        >
          <ProFormText
            name="id"
            label="ID"
            disabled
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="manage.role.name"
                    defaultMessage="Rule name is required"
                  />
                ),
              },
            ]}
            name="name"
            label="名称"
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="manage.role.slug"
                    defaultMessage="Rule slug is required"
                  />
                ),
              },
            ]}
            name="slug"
            label="slug"
          />
          <ProFormTreeSelect
              name="menus"
              label="菜单权限"
              fieldProps={{
                  treeCheckable: true,
                  showCheckedStrategy: SHOW_PARENT,
              }}
              placeholder='Please select'
              request={async () => {
                  const result = await getAllMenus();
                  return transformMenuTree(result.data);
              }}
          />
        </ModalForm>
    )
  };
  
  export default UpdateForm;
  