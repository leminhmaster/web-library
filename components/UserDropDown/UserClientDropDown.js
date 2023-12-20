import {LoginOutlined, LogoutOutlined, PlusOutlined, ShoppingCartOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Dropdown} from 'antd';
import React from 'react';
import {useRouter} from "next/router";
import cookieUtils from "../../utils/cookieUtils";
import {setJwtToken} from "../../slices/tokenSlice";
import {useDispatch, useSelector} from "react-redux";

const UserClientDropDown = (props) => {
    const router = useRouter();
    const tokenInStore = useSelector((state) => state.token.token);
    const dispatch = useDispatch()
    const onClick = ({key}) => {
        switch (key) {
            case '1k':
                router.push("/cart");
                return;
            case '2k':
                router.push("/register")
                return;
            case '3k':
                router.push("/login")
                return;
            case '4k':
                router.push("/user")
                return;
            case '5k':
                cookieUtils.removeCookie('token')
                dispatch(setJwtToken(null))
                return;
            default:
                return;
        }
    };


    const items = [
        {
            key: '1k',
            label: (
                <a rel="noopener noreferrer">
                    Giỏ mượn
                </a>
            ),
            icon: <ShoppingCartOutlined/>
        },
        {
            key: '2k',
            label: (
                <a rel="noopener noreferrer">
                    Đăng ký
                </a>
            ),
            hidden: tokenInStore !== null,
            icon: <PlusOutlined/>,
        },
        {
            key: '3k',
            label: (
                <a rel="noopener noreferrer">
                    Đăng nhập
                </a>
            ),
            hidden: tokenInStore !== null,
            icon: <LoginOutlined/>,
        },
        {
            key: '4k',
            label: (
                <a rel="noopener noreferrer">
                    Thông tin cá nhân
                </a>
            ),
            hidden: tokenInStore === null,
            icon: <UserOutlined/>,
        },
        {
            key: '5k',
            label: (
                <a rel="noopener noreferrer">
                    Đăng xuất
                </a>
            ),
            danger: true,
            hidden: tokenInStore === null,
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
            {props.avaUrl !== null && props.avaUrl !== undefined ? <Avatar size={40} src={props.avaUrl}/> :
                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} size={40}>{props.Uname!==null&&props.Uname!==undefined ? props.Uname[0] : 'U'}</Avatar>}
        </a>

    </Dropdown>);
};
export default UserClientDropDown;