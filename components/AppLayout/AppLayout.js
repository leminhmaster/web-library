import {
    DesktopOutlined,
    UnorderedListOutlined,
    TeamOutlined,
    UserOutlined,
    AppstoreAddOutlined,
    AccountBookOutlined,
    HddFilled, InfoCircleFilled,
} from '@ant-design/icons';
import {Layout, Menu, Avatar, Row, Col, Image} from 'antd';
import React, {useState} from 'react';
import {useRouter} from 'next/router';
import UserDropDown from '../UserDropDown/UserDropDown';

const {Header, Content, Sider} = Layout;

const AppLayout = ({children}) => {

    const [collapsed, setCollapsed] = useState('collapsed', false);
    const router = useRouter();
    const onCollapse = () => setCollapsed(!collapsed);
    const navigateToRoute = (path) => {
        console.log("navigateToRoute === " + path);
        router.push(path);
    };

    function getItem(key, label, icon, path, children) {
        return {
            key: key,
            icon: icon,
            label: label,
            children: children,
            path: path
        }
    }

    const items = [
        getItem('book', 'Quản lý tài liêụ', <HddFilled/>, null, [
            getItem('list_book', 'Danh sách tài liệu', <UnorderedListOutlined/>, "/book/list_book"),
            getItem('add_book', 'Thêm mới tài liệu', <AppstoreAddOutlined/>, "/book/add_book")
        ]),
        getItem('customer', 'Quản lý khách hàng', <UserOutlined/>, null, [
            getItem('list_customer', 'Danh sách khách hàng', <UnorderedListOutlined/>, "/customer/list_customer"),
            getItem('add_customer', 'Thêm mới khách hàng', <AppstoreAddOutlined/>, "/customer/add_customer")
        ]),
        getItem('loan', 'Quản lý mượn trả', <DesktopOutlined/>, null, [
            getItem("list_loan", 'Danh sách phiếu mượn', <UnorderedListOutlined/>, "/loan/list_loan"),
            getItem("add_loan", 'Thêm mới phiếu mượn', <AppstoreAddOutlined/>, "/loan/add_loan"),
            getItem("return_loan", 'Trả phiếu mượn', <InfoCircleFilled />, "/loan/return_loan")
        ])
        ,
        getItem('staff', 'Quản lý nhân viên', <TeamOutlined/>, null, [
            getItem('list_staff', 'Danh sách nhân viên', <AccountBookOutlined/>, "/staff/list_staff"),
            getItem('add_staff', 'Thêm mới nhân viên', <UserOutlined/>, "/staff/add_staff"),
        ]),
    ];

    const findItemFromKey = (key, items) => {
        if (items === undefined || items == null || items.size === 0)
            return null;
        let result = {item: null};

        for (const itemKey in items) {
            if (result.item !== null) {
                break;
            }
            if (items[itemKey].key === key) {
                result.item = { ...items[itemKey] };
            }
            findItemInGroupChild(result, items[itemKey].children, key);
        }

        return result.item;
    }

    const findItemInGroupChild = (result, children, key) => {
        if (children === undefined || children === null || children.size === 0) {
            return;
        }
        for (const childrenItem in children) {
            if (result.item !== null) {
                break;
            }
            if (children[childrenItem].key === key) {
                result.item = {...children[childrenItem]};
            }
            findItemInGroupChild(result, children[childrenItem].children, key);
        }
    }

    const onClick = (e) => {
        console.log(e);
        const item = findItemFromKey(e.key, items);
        if (item !== null) {
            navigateToRoute(item.path)
        }
    }

    return (
        <Layout>
            <Header className="header col-12" style={{position: 'sticky', top: 0, zIndex: 1, width: '100%'}}>
                <Row>
                    <Col span={12}>
                        <Row justify='start' align='middle'>
                            <Col>
                                <div className='logo' style={{
                                    color: 'white'
                                }}>
                                    <Image src='/favicon.ico' width={50} preview={false}/>
                                </div>
                            </Col>

                        </Row>

                    </Col>
                    <Col span={12}>
                        <Row justify='end' align='bottom'>
                            <Col>
                                <div className='col-12'>
                                    <UserDropDown/>
                                </div>
                            </Col>
                        </Row>

                    </Col>
                </Row>


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