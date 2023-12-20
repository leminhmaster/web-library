import {Button, DatePicker, Form, Input, message, PageHeader} from "antd";
import React, {useContext, useEffect, useState} from "react";
import moment from "moment/moment";
import {AuthContext} from "../../contexts/AuthContext";
import {chiTietKhachHang, suaKhachHang, themKhachHang} from "../../api/khachHangApi";
import {useRouter} from "next/router";

function AddCustomerPage({id}) {

    const authContextValue = useContext(AuthContext);
    const [khachHang, setKhachHang] = useState({
        maKH: '',
        hoTenKH: '',
        ngaySinh: null,
        soCCCD: '',
        diaChi: '',
        sdt: '',
    })
    const [isUpdate, setIsUpdate] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();


    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    useEffect(() => {
        if (id === undefined || id === null || id === '') {
            setIsUpdate(false);
        } else {
            chiTietKhachHang(authContextValue?.token, id, (res) => {
                setKhachHang(res.data);
                setIsUpdate(true)
                setFormData(res.data);
            }, (err) => {
                setIsUpdate(false);
            })
        }
    }, []);

    const onFinish = (values) => {
        if (isUpdate) {
            suaKhachHang(authContextValue?.token, id, khachHang, (res) => {
                router.push("/customer/list_customer")
            }, (err) => {
                message.error("loi khi tao")
            })
        } else {
            themKhachHang(authContextValue?.token, khachHang, (res) => {
                router.push("/customer/list_customer")
            }, (err) => {
                message.error("loi khi tao")
            })
        }
    }

    const setFormData = (info) => {
        form.setFieldsValue(info);
    }

    return (
        <Form
            {...layout}
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
        >
            <Form.Item>
                <PageHeader
                    className="site-page-header"
                    onBack={() => router.push('/customer/list_customer')}
                    title={isUpdate ? 'Chỉnh sửa thông tin khách hàng' : 'Tạo mới thông tin khách hàng'}
                />
            </Form.Item>
            <Form.Item
                name={"maKH"}
                label={"Mã khách hàng"}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...khachHang,
                        maKH: e.target.value
                    }
                    setKhachHang(newValue)
                }} value={khachHang.maKH} readOnly/>
            </Form.Item>
            <Form.Item
                name={"hoTenKH"}
                label={"Tên khách hàng"}
                rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...khachHang,
                        hoTenKH: e.target.value
                    }
                    setKhachHang(newValue)
                }} value={khachHang.hoTenKH}/>
            </Form.Item>
            <Form.Item
                label={"Ngày sinh"}>
                <DatePicker value={khachHang.ngaySinh !== null ? moment(khachHang.ngaySinh, 'YYYY-MM-DD') : undefined}
                            onChange={(date, dateString) => {
                                const newValue = {
                                    ...khachHang,
                                    ngaySinh: date?.format('YYYY-MM-DD') ?? null
                                }
                                setKhachHang(newValue)
                            }}/>
            </Form.Item>
            <Form.Item
                name={"soCCCD"}
                label={"Số CCCD"} rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...khachHang,
                        soCCCD: e.target.value
                    }
                    setKhachHang(newValue)
                }} value={khachHang.soCCCD}/>
            </Form.Item>
            <Form.Item
                name={"diaChi"}
                label={"Địa chỉ"}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...khachHang,
                        diaChi: e.target.value
                    }
                    setKhachHang(newValue)
                }} value={khachHang.diaChi}/>
            </Form.Item>
            <Form.Item
                name={"sdt"}
                label={"Số điện thoại"}
                rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...khachHang,
                        sdt: e.target.value
                    }
                    setKhachHang(newValue)
                }} value={khachHang.sdt}/>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
            >
                <Button type="primary" htmlType="submit" style={{marginRight: 10,}}>
                    {isUpdate ? 'Chỉnh sửa' : 'Tạo mới'}
                </Button>
                <Button type="danger" onClick={() => {
                    router.push("/customer/list_customer")
                }}>Hủy</Button>
            </Form.Item>


        </Form>
    )
}


AddCustomerPage.getInitialProps = async ({query}) => {
    const {id} = query;

    return {
        id,
    }
}

export default AddCustomerPage

