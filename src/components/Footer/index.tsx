import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} 饺子`}
      // links={[
      //   {
      //     key: 'github',
      //     title: <GithubOutlined />,
      //     href: 'https://github.com/tashuo/antd-pro-learn',
      //     blankTarget: true,
      //   },
      //   {
      //     key: 'Community',
      //     title: 'Community',
      //     href: 'https://nextjs-mui-learn.vercel.app/',
      //     blankTarget: true,
      //   },
      // ]}
    />
  );
};

export default Footer;
