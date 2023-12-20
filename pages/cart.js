import {Button, Layout, Select, Table, Typography} from 'antd';

import React from "react";

const {Title, Text} = Typography;

const {Header, Content, Footer} = Layout;


const {Option} = Select;

const Cart = () => {


    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Action',
            key: 'action',
            render: () => <Button type="link">Remove</Button>,
        },
    ];

    const data = [
        {
            key: '1',
            product: 'Product 1',
            price: 10,
            quantity: 2,
            total: 20,
        },
        {
            key: '2',
            product: 'Product 2',
            price: 15,
            quantity: 1,
            total: 15,
        },
        // Add more data as needed
    ];

    return (
        <div><h1>Giỏ mượn sách</h1>
            <Table columns={columns} dataSource={data}/>
            <Button type="primary">Checkout</Button>
        </div>
    );
};

export default Cart;