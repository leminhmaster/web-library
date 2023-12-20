import {Button, Tag, Tooltip} from "antd";
import React from "react";
import {nanoid} from "nanoid";
import Login from "../pages/login";
import Home from "../pages/home";
import Cart from "../pages/cart";
import UserDetail from "../pages/user_detail";
import AppClientLayout from "../components/AppLayout/AppClientLayout";

export const genButton = (titleToolTip, icon, type, actionBtn) => {
    return (
        <Tooltip title={titleToolTip}>
            <Button icon={icon} type={type} onClick={actionBtn}></Button>
        </Tooltip>
    )
}

export const genTag = (color, icon, text) => {
    return (
        <Tag icon={icon} color={color} key={nanoid()}>
            {text}
        </Tag>
    )
}

export const genTagNoIcon = (color, text) => {
    return (
        <Tag color={color} key={nanoid()}>
            {text}
        </Tag>
    )
}

export const routingClientWeb = (routeString) => {
    switch (routeString) {
        case '/':
        case '':
        case '/home':
            return <AppClientLayout><Home/></AppClientLayout>
        case '/login':
            return <Login/>
        case '/cart':
            return <AppClientLayout><Cart/></AppClientLayout>
        case '/user':
        case '/register':
            return <AppClientLayout><UserDetail/></AppClientLayout>
        default:
            return <h1>Lỗi! Trang khong ton tai</h1>
    }
}

export const addKeyToRecord = (list) => {
    return list.map((item, index) => {
        return {...item, key: nanoid()}
    })
}