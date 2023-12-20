import {Col, Image, Layout, message, Row, Typography} from 'antd';

import React, {useEffect, useState} from "react";
import UserClientDropDown from "../UserDropDown/UserClientDropDown";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {apiUserInfoByToken} from "../../api/authApi";

const {Title, Text} = Typography;

const {Header, Content, Footer} = Layout;

const AppClientLayout = ({children}) => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({});
    const tokenInStore = useSelector((state) => state.token.token);

    useEffect(() => {
        setFormValue();
    }, [tokenInStore]);

    const setFormValue = () => {
        apiUserInfoByToken(tokenInStore, (res) => {
            setUserInfo(res.data)
        }, (err) => {
            message.error("loi khi call api tt account")
        })
    }

    return <Layout>
        <Header>
            <Header className="header col-12" style={{position: 'sticky', top: 0, zIndex: 1, width: '100%'}}>
                <Row>
                    <Col span={12}>
                        <Row justify='start' align='middle'>
                            <Col>
                                <div className='logo'
                                     style={{display: 'flex', alignItems: 'center', color: 'white'}}>
                                    <a onClick={() => router.push("/")}>
                                        <Image src='/library-book-svgrepo-com.svg' width={50} preview={false}/>
                                    </a>
                                    <h3 style={{color: 'white', paddingLeft: 10}}>Thư viện NTH</h3>
                                </div>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={12}>
                        <Row justify='end' align='bottom'>
                            <Col>
                                <div className='col-12' style={{display: 'flex', alignItems: 'center', color: 'white'}}>
                                    <h3 style={{color: 'white', paddingRight: 10}}>Xin chào {userInfo?.name} </h3>
                                    <UserClientDropDown Uname={userInfo.name} avaUrl={userInfo.avatar?.url}/>
                                </div>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Header>
        </Header>
        <Content style={{padding: '0 50px'}}>
            {children}
        </Content>
        <Footer>
            <div>Trang web thư viện NTH ©2023 Created by Minh Lee</div>
            <div>Bạn là nhân viên thư viện? <span><a href={"/login"}>vào trang quản lý</a></span></div>
        </Footer>
    </Layout>
}

export default AppClientLayout