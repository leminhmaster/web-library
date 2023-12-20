import {Button, Card, Col, Image, Input, Layout, Modal, Pagination, Row, Select, Typography} from 'antd';

import React, {useState} from "react";
import UserClientDropDown from "../components/UserDropDown/UserClientDropDown";

const {Title, Text} = Typography;

const {Header, Content, Footer} = Layout;

const books = [
    {
        id: 1,
        title: 'Sách 1',
        description: 'Mô tả sách 1',
        price: '$10',
        image: 'http://localhost:8481/file/58'
    },
    {
        id: 2,
        title: 'Sách 2',
        description: 'Mô tả sách 2',
        price: '$15',
        image: 'http://localhost:8481/file/58'
    },
    {
        id: 2,
        title: 'Sách 2',
        description: 'Mô tả sách 2',
        price: '$15',
        image: 'http://localhost:8481/file/58'
    },
    {
        id: 2,
        title: 'Sách 2',
        description: 'Mô tả sách 2',
        price: '$15',
        image: 'http://localhost:8481/file/58'
    },
    {
        id: 2,
        title: 'Sách 2',
        description: 'Mô tả sách 2',
        price: '$15',
        image: 'http://localhost:8481/file/58'
    },
    {
        id: 2,
        title: 'Sách 2',
        description: 'Mô tả sách 2',
        price: '$15',
        image: 'http://localhost:8481/file/58'
    },
    {
        id: 2,
        title: 'Sách 2',
        description: 'Mô tả sách 2',
        price: '$15',
        image: 'http://localhost:8481/file/58'
    },
    // Thêm các sách khác vào đây
];

const {Option} = Select;

const Home = () => {

    const [viewTaiLieuVisible, setViewTaiLieuVisible] = useState(false);


    const book = {
        title: 'Sách A',
        author: 'Tác giả A',
        description: 'Mô tả về sách A',
        price: 10.99,
        image: 'https://example.com/book-image.jpg',
    };


    const openViewTaiLieuDetail = (taiLieu) => {
        setViewTaiLieuVisible(true);
    };
    const handleCancel = () => {
        setViewTaiLieuVisible(false);
    };
    return (
        <div style={{padding: '24px'}}>
            <Title level={2}>Thư viện sách</Title>
            <Row gutter={[16, 16]} style={{paddingBottom: '24px'}}>
                <Col xs={24} md={12} lg={6}>
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề"

                    />
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <Select
                        placeholder="Tìm kiếm theo danh mục"
                    >
                        <Option value="">Tất cả danh mục</Option>
                        <Option value="Học tập">Học tập</Option>
                        <Option value="Giải trí">Giải trí</Option>
                        {/* Thêm các danh mục khác vào đây */}
                    </Select>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <Button type="primary">Tìm kiếm</Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {books.map(book => (
                    <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            onClick={openViewTaiLieuDetail}
                            cover={<img alt={book.title} src={book.image}/>}
                            hoverable
                        >
                            <Title level={4}>{book.title}</Title>
                            <Text>{book.description}</Text>
                            <Text strong>Giá: {book.price}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Pagination
                    // current={currentPage}
                    // pageSize={pageSize}
                    // total={books.length}
                    // onChange={page => setCurrentPage(page)}
                    style={{marginTop: '24px', textAlign: 'center'}}
                />
            </Row>

            <Modal
                title="Thông tin tài liệu"
                visible={viewTaiLieuVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                width={1000}
            >
                <Card
                    cover={<img alt={book.title} src={book.image}/>}
                    style={{marginBottom: '24px'}}
                >
                    <Title level={2}>{book.title}</Title>
                    <Text strong>Tác giả: {book.author}</Text>
                    <Text>{book.description}</Text>
                    <Text strong>Giá: {book.price}</Text>
                    <Button type="primary" style={{marginTop: '16px'}}>Thêm vào giỏ mượn</Button>
                </Card>
            </Modal>
        </div>

    );
};

export default Home;