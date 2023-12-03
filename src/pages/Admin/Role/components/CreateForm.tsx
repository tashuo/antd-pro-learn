import { getAllMenus } from '@/services/ant-design-pro/menu';
import {
    ProFormText,
    ModalForm,
    ProFormTreeSelect,
  } from '@ant-design/pro-components';
  import { FormattedMessage, useIntl } from '@umijs/max';
  import { TreeSelect } from 'antd';
  import React from 'react';

  const { SHOW_PARENT } = TreeSelect;
  
  export type CreateFormProps = {
    onOpenChange: (state: boolean) => void;
    onFinish: (values: API.AddRole) => Promise<void>;
    open: boolean;
  };

  const CreateForm: React.FC<CreateFormProps> = (props) => {
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
        open={props.open}
        onOpenChange={props.onOpenChange}
        onFinish={props.onFinish}
      >
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
        //   width="md"
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
        //   width="md"
          name="slug"
          label="slug"
        />
        <ProFormTreeSelect
            // width="md"
            name="menus"
            label="菜单权限"
            fieldProps={{
                treeCheckable: true,
                showCheckedStrategy: SHOW_PARENT,
            }}
            placeholder='Please select'
            request={async () => {
                const result = await getAllMenus();
                console.log(result, transformMenuTree(result.data))
                return transformMenuTree(result.data);
            }}
        />
      </ModalForm>
    )
  };
  
  export default CreateForm;
  