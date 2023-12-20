import {Card, Col, Row} from "antd";
import React from "react";

export default function HomePage() {
    return (
        <div>
            <h1>Chào mừng bạn đến với trang quản lý thư viện</h1>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card title="Books" bordered={false}>
                        <p>Total Books: 100</p>
                        <p>Available Books: 80</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Members" bordered={false}>
                        <p>Total Members: 50</p>
                        <p>Active Members: 40</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Borrowings" bordered={false}>
                        <p>Total Borrowings: 120</p>
                        <p>Overdue Borrowings: 10</p>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}