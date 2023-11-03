import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import React from 'react';

const UserDropDown = () => {

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    Thông tin cá nhân
                </a>
            ),
            icon: <UserOutlined />
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Đăng xuất
                </a>
            ),
            danger: true,
            icon: <LogoutOutlined />,
        }
    ];

    return (<Dropdown
        menu={{
            items,
        }}
    >
        <Avatar size={40} icon={<UserOutlined />} />
    </Dropdown>);
};
export default UserDropDown;