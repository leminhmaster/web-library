import {Button, Checkbox, Form, Input, Card} from 'antd';
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import React from 'react';
import {apiLogin} from "../api/authApi";
import {message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setJwtToken} from "../slices/tokenSlice";
import {useRouter} from "next/router";
import { Typography } from "antd";
const { Title } = Typography;

const Login = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const tokenInStore = useSelector((state) => state.token.token);

    const onFinish = (values) => {
        console.log('Success:', values);

        apiLogin(values, (res) => {
            var accessToken = res.data.accessToken;
            dispatch(setJwtToken(accessToken));
            router.push("/book/list_book");
            console.log("data: " + JSON.stringify(res.data))
        }, (error) => {

            console.log("error: " + JSON.stringify(error))
        })

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Card style={{width: 500}}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Title level={2}>Company Logo </Title>
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
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="">register now!</a>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
export default Login;