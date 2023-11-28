import {Button, DatePicker, Form, Input, message, PageHeader, Select} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {nanoid} from "nanoid";
import {apiListSex} from "../../api/publicApi";
import {chiTietKhachHang} from "../../api/khachHangApi"
import {AuthContext} from "../../contexts/AuthContext";
import {chiTietNhanVien, suaNhanVien, themNhanVien} from "../../api/nhanVienApi";

function AddStaffPage({id}) {

    const authContextValue = useContext(AuthContext);
    const [nhanVien, setNhanVien] = useState({
        maNV: '',
        hoten: '',
        gioiTinh: null,
        soCCCD: '',
        diaChi:'',
        sdt: '',
    })
    const [listGioiTinh, setListGioiTinh] = useState([])
    const router = useRouter();
    const [isUpdate, setIsUpdate] = useState(false);


    useEffect(() => {
        apiListSex((res) => {
            setListGioiTinh(res.data);
        })

        if (id === undefined || id === null || id === '') {
            setIsUpdate(false);
        }else {
            chiTietNhanVien(authContextValue?.token, id, (res) => {
                setNhanVien(res.data);
                setIsUpdate(true)
            }, (err) => {
                setIsUpdate(false);
                message.error("loi khi call get api")
            })
        }


    }, []);


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
    const onFinish = (values) => {
        if (isUpdate) {
            console.log("case update")
            console.log(nhanVien)
            suaNhanVien(authContextValue?.token, id, nhanVien, (res) => {
                router.push("/staff/list_staff")
            }, (err) => {
                message.error("co loi khi sua")
            })
        }else {
            console.log("case create")
            console.log(nhanVien)
            themNhanVien(authContextValue?.token, nhanVien, (res) => {
                router.push("/staff/list_staff")
            }, (err) => {
                message.error("co loi khi them")
            })
        }
    }

    return (
        <Form
            {...layout}
            onFinish={onFinish}
            validateMessages={validateMessages}
        >
            <Form.Item>
                <PageHeader
                    className="site-page-header"
                    onBack={() => router.push('/staff/list_staff')}
                    title={isUpdate ? 'Chỉnh sửa thông tin nhân viên' : 'Tạo mới thông tin nhân viên'}
                />
            </Form.Item>
            <Form.Item label={"Mã nhân viên"} rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        maNV: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.maNV}/>
            </Form.Item>
            <Form.Item label={"Tên nhân viên"} rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        hoten: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.hoTen}/>
            </Form.Item>
            <Form.Item label={"Giới tính"} rules={[{required: true,},]}>
                <Select
                    placeholder="Chọn giới tính"
                    value={nhanVien.gioiTinh}
                    defaultValue={nhanVien.gioiTinh}
                    onChange={(value) => {
                        const newTTTLValue = {
                            ...nhanVien,
                            gioiTinh: value
                        }
                        setNhanVien(newTTTLValue)
                    }}
                    allowClear={true}
                    optionLabelProp="label">
                    {listGioiTinh.map((item, index) => (
                        <Option key={nanoid()} value={item.code} label={item.name}>{item.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label={"Số CCCD"} rules={[{required: true,},]} >
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        soCCCD: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.soCCCD}/>
            </Form.Item>
            <Form.Item label={"Địa chỉ"}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        diaChi: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.diaChi}/>
            </Form.Item>
            <Form.Item label={"Số điện thoại"} rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        sdt: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.sdt}/>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
            >
                <Button type="primary" htmlType="submit">
                    {isUpdate ? 'Chỉnh sửa' : 'Tạo mới'}
                </Button>
                <Button type="info" onClick={() => {
                    router.push("/staff/list_staff")
                }}>Hủy</Button>
            </Form.Item>

        </Form>
    )
}


AddStaffPage.getInitialProps = async ({query}) => {
    const {id} = query;

    return {
        id,
    }
}

export default AddStaffPage

