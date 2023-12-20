import {Button, Card, Form, Image, Input, message, Typography} from 'antd';
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React from 'react';
import {apiLogin} from "../api/authApi";
import {useDispatch, useSelector} from "react-redux";
import {setJwtToken} from "../slices/tokenSlice";
import {useRouter} from "next/router";

const {Title} = Typography;

const Login = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const onFinish = (values) => {
        console.log('Success:', values);

        apiLogin(values, (res) => {
            dispatch(setJwtToken(res.data.accessToken));
            router.push("/");
        }, (error) => {
            message.error("Đăng nhập không thành công")
        })

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div style={{
            backgroundImage: 'url("/img_lib.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100vw',
            height: '100vh',
        }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",

                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Card style={{
                    width: 500,
                    borderRadius: '20px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.16)',
                    opacity: 0.9,
                    color: 'tranparent'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image width={50} src={'/img_1.png'} preview={false}/>
                        <Title level={3}>Thư viện MIN</Title>
                        <Title level={5}>Đăng nhập để vào trang quản lý</Title>
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"
                                    style={{width: '100%'}}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};
export default Login;