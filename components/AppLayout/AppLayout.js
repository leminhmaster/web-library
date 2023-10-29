import {
  DesktopOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  AccountBookOutlined,
  HddFilled,
} from '@ant-design/icons';
import { Layout, Menu, Avatar } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
const { Header, Content, Sider } = Layout;

const AppLayout = ({ children }) => {

  const [collapsed, setCollapsed] = useState('collapsed', false);
  const router = useRouter();
  const onCollapse = () => setCollapsed(!collapsed);
  const navigateToRoute = (path) => {
    console.log("navigateToRoute === " + path);
    router.push(path);
  };
  function getItem(key, label, icon, path, children) {
    return {
      key,
      icon,
      label,
      children,
      path
    }
  }
  const items = [
    getItem('book', 'Quản lý sách', <HddFilled />, null, [
      getItem('list_book', 'Danh sách đầu sách', <UnorderedListOutlined />, "/book/list_book"),
      getItem('add_book', 'Thêm mới đầu sách', <AppstoreAddOutlined />, "/book/add_book")
    ]),
    getItem('customer', 'Quản lý khách hàng', <UserOutlined />, null, [
      getItem('list_customer', 'Danh sách khách hàng', <UnorderedListOutlined />,"/customer/list_customer"),
      getItem('add_customer', 'Thêm mới khách hàng', <AppstoreAddOutlined />,"/customer/add_customer")
    ]),
    getItem('loan', 'Quản lý mượn trả', <DesktopOutlined />, null, [
      getItem("list_loan", 'Danh sách phiếu mượn', <UnorderedListOutlined />,"/loan/list_loan"),
      getItem("add_loan", 'Thêm mới phiếu mượn', <AppstoreAddOutlined />,"/loan/add_loan"),
      // getItem("", 'Trả phiếu mượn', <InfoCircleFilled />)
    ]),
    getItem('account','Quản lý tài khoản',  <TeamOutlined />, null, [
      getItem('account_library','Quản lý tài khoản thủ thư', <AccountBookOutlined />),
      getItem('account_customer', 'Quản lý tài khoản khách hàng', <UserOutlined />)]),
  ];

  const findPathFromKey = (key, items) => {
    if(items === null || items === undefined){
      return null;
    }
    let path = null;
    for(let item in items) {
        if(item.key == key){
          path = item.path
        } else {
          path = findPathFromKey(key, items[item].children)
        }
    }
    return path
  }

  const onClick = (e) => {
    console.log("click" , e)
    items.forEach(item => {
      if(item.key == e.key){
        navigateToRoute(item.path)
      } else {
        let path = findPathFromKey(e.key, item.children);
        if(path !== null){
          navigateToRoute(path)
        }
      }
    })
  }

  return (
    <Layout>
      <Header className="header" style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <Avatar></Avatar>
      </Header>
      <Layout className='site-layout'>
        <Sider className="site-layout-background"
          collapsible
          collapsed={collapsed}
          defaultCollapsed={collapsed}
          onCollapse={onCollapse}
          collapsedWidth={40}
          width={230}
          theme='light'
          style={{
            overflow: 'auto',
            height: '100%',
            position: 'fixed',
          }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            onClick={onClick}
            style={{
              borderRight: 1,
            }}
            items={items}
          />
        </Sider>
        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            defaultCollapsed={collapsed}
            onCollapse={onCollapse}
            collapsedWidth={48}
            width={236}
            style={{
              visibility: 'hidden'
            }}
          />
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default AppLayout