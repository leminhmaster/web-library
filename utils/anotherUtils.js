import {Button, Tag, Tooltip} from "antd";
import React from "react";
import {nanoid} from "nanoid";

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


export const addKeyToRecord = (list) => {
    return list.map((item, index) => {
        return {...item, key: nanoid()}
    })
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });