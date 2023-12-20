import {Button, Form, Input, message, Modal, PageHeader, Select} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {nanoid} from "nanoid";
import {apiListSex} from "../../api/publicApi";
import {AuthContext} from "../../contexts/AuthContext";
import {chiTietNhanVien, suaNhanVien, themNhanVien} from "../../api/nhanVienApi";
import {chiTietTKNhanVien, updateTKNhanVien} from "../../api/taiKhoanApi";

function AddStaffPage({id}) {

    const authContextValue = useContext(AuthContext);
    const [form] = Form.useForm();
    const [formTK] = Form.useForm();
    const [nhanVien, setNhanVien] = useState({
        maNV: '',
        hoten: '',
        gioiTinh: null,
        soCCCD: '',
        diaChi: '',
        sdt: '',
    })
    const [listGioiTinh, setListGioiTinh] = useState([])
    const router = useRouter();
    const [isUpdate, setIsUpdate] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);


    useEffect(() => {
        apiListSex((res) => {
            setListGioiTinh(res.data);
        })

        if (id === undefined || id === null || id === '') {
            setIsUpdate(false);
        } else {
            chiTietNhanVien(authContextValue?.token, id, (res) => {
                setNhanVien(res.data);
                setIsUpdate(true)
                setFormValue(res.data);
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

    const handleCancel = () => setPreviewOpen(false);

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

    const setFormValue = (info) => {
        form.setFieldsValue({
            maNV: info.maNV,
            tenNV: info.hoten,
            gt: info.gioiTinh,
            soCCCD: info.soCCCD,
            diaChi: info.diaChi,
            sdt: info.sdt,
        })
    }

    const onFinish = () => {
        if (isUpdate) {
            console.log("case update")
            console.log(nhanVien)
            suaNhanVien(authContextValue?.token, id, nhanVien, (res) => {
                router.push("/staff/list_staff")
            }, (err) => {
                message.error("co loi khi sua")
            })
        } else {
            console.log("case create")
            console.log(nhanVien)
            themNhanVien(authContextValue?.token, nhanVien, (res) => {
                router.push("/staff/list_staff")
            }, (err) => {
                message.error("co loi khi them")
            })
        }
    }

    const onFinishTK = (values) => {
        updateTKNhanVien(authContextValue?.token, nhanVien.maNV, values, (res) => {
            message.success("cap nhat thanh cong")
        }, (err) => {
            message.error("cap nhat tk nhan vien khong thanh cong")
        })
    }

    const setFormTKData = (info) => {
        formTK.setFieldsValue(info)
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
                    onBack={() => router.push('/staff/list_staff')}
                    title={isUpdate ? 'Chỉnh sửa thông tin nhân viên' : 'Tạo mới thông tin nhân viên'}
                />
            </Form.Item>
            <Form.Item
                name={"maNV"}
                label={"Mã nhân viên"}
                rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        maNV: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.maNV}/>
            </Form.Item>
            <Form.Item
                name={"tenNV"}
                label={"Tên nhân viên"}
                rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        hoten: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.hoten}/>
            </Form.Item>
            <Form.Item name={"gt"}
                       label={"Giới tính"}
                       rules={[{required: true,},]}>
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
            <Form.Item
                name={"soCCCD"}
                label={"Số CCCD"}
                rules={[{required: true,},]}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        soCCCD: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.soCCCD}/>
            </Form.Item>
            <Form.Item
                name={"diaChi"}
                label={"Địa chỉ"}>
                <Input onChange={(e) => {
                    const newValue = {
                        ...nhanVien,
                        diaChi: e.target.value
                    }
                    setNhanVien(newValue)
                }} value={nhanVien.diaChi}/>
            </Form.Item>
            <Form.Item name={"sdt"}
                       label={"Số điện thoại"}
                       rules={[{required: true,},]}>
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
                <Button type="primary" htmlType="submit" style={{marginRight: 10,}}>
                    {isUpdate ? 'Chỉnh sửa' : 'Tạo mới'}
                </Button>

                {isUpdate ? (<Button danger
                                     style={{marginRight: 10,}}
                                     onClick={() => {
                                         chiTietTKNhanVien(authContextValue?.token, nhanVien.maNV, (res) => {
                                             setFormTKData(res.data);

                                         }, (err) => {
                                             message.info("chua co tai khoan")
                                         })
                                         setPreviewOpen(true)
                                     }}
                    >Tài khoản nhân viên</Button>)
                    : (null)}


                <Button type="info" onClick={() => {
                    router.push("/staff/list_staff")
                }}>Hủy</Button>

                <Modal open={previewOpen} title={"Tài khoản nhân viên"} footer={null} onCancel={handleCancel}>
                    <Form form={formTK} onFinish={onFinishTK}>
                        <Form.Item
                            label="Name"
                            name="username"
                            rules={[
                                {required: true, message: 'Please enter your name'},
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {required: true, message: 'Please enter your email'},
                                {type: 'email', message: 'Please enter a valid email'},
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item>
                            <Button style={{marginRight: 10,}} type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>

                    </Form>
                </Modal>

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

