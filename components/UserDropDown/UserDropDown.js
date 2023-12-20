import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Dropdown} from 'antd';
import React, {useContext} from 'react';
import {AuthContext} from "../../contexts/AuthContext";
import {router} from "next/client";

const UserDropDown = () => {

    const authContextValue = useContext(AuthContext);

    const onClick = ({key}) => {
        switch (key) {
            case '1':
                router.push("/user_detail")
                return;
            case '2':
                authContextValue?.logout()
                return;
        }
    };


    const items = [
        {
            key: '1',
            label: (
                <a rel="noopener noreferrer">
                    Thông tin cá nhân
                </a>
            ),
            icon: <UserOutlined/>
        },
        {
            key: '2',
            label: (
                <a rel="noopener noreferrer">
                    Đăng xuất
                </a>
            ),
            danger: true,
            icon: <LogoutOutlined/>,
        }
    ];

    return (<Dropdown
        menu={{
            items,
            onClick,
        }}
    >
        <a onClick={(e) => e.preventDefault()}>
            <Avatar size={40} icon={<UserOutlined/>}/>
        </a>

    </Dropdown>);
};
export default UserDropDown;