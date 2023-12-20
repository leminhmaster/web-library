import {Button, Form, Input, message, Modal, PageHeader, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {apiUploadSingleFile} from "../api/uploadApi";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {getBase64} from "../utils/anotherUtils";
import {apiRegister, apiUpdateAccount, apiUserInfoByToken} from "../api/authApi";

const layout = {
    labelCol: {
        span: 8,
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


const UserDetail = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const tokenInStore = useSelector((state) => state.token.token);
    const [fileList, setFileList] = useState([]);
    const [isUpdated, setisUpdated] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const onChange = (info) => {
        const {status, originFileObj} = info.file;
        if (status === 'uploading') {
            apiUploadSingleFile(tokenInStore, 'AVATAR',
                originFileObj, (res) => {
                    const newFileList = fileList.slice();
                    const fileInfo = {
                        id: res.data.id,
                        uid: res.data.id,
                        name: res.data.name,
                        status: 'done',
                        url: res.data.url,
                    }
                    newFileList.push(fileInfo)
                    setFileList(newFileList)
                }, (error) => {
                    const newFileList = fileList.slice();
                    const fileInfo = {
                        ...info.file,
                        status: 'error',
                    }
                    newFileList.push(fileInfo)
                    setFileList(newFileList)
                })
        }
        if (status === 'removed') {
            const newListFile = fileList.filter((ele, currentIndex) => ele.id !== info.file.id)
            setFileList(newListFile)
        }
    };

    useEffect(() => {
        if (tokenInStore === null) {
            console.log("no token")
            setisUpdated(false);
        } else {
            console.log("have token")
            setFormValue()
        }
    }, [tokenInStore]);

    const setFormValue = () => {
        apiUserInfoByToken(tokenInStore, (res) => {
            console.log(res.data)
            form.setFieldsValue(res.data);
            setisUpdated(true);
            const ava = res.data.avatar;
            if (ava !== null && ava !== undefined)
                setFileList([ava]);
        }, (err) => {
            message.error("loi khi call api tt account")
        })
    }

    const onPreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleCancel = () => setPreviewOpen(false);

    const onFinish = (values) => {
        if (isUpdated) {
            console.log('case update')
            const avatarId = fileList[0]?.id;
            const data = {...values, avatarId: avatarId}
            console.log(data)
            apiUpdateAccount(tokenInStore, data, (res) => {
                message.info("Update successful")
                router.push('/');
            }, (err) => {

                message.error(err.data?.errorMessage)
            })
        } else {
            console.log('case regíter')
            const data = {...values, avatarId: null}
            apiRegister(data, (res) => {
                message.info("Register successful")
                router.push('/login');
            }, (err) => {
                console.log(err.response);
                message.error(err.response?.data?.errorMessage)
            })
        }
    };
    return (
        <Form {...layout} name="nest-messages"
              onFinish={onFinish}
              form={form}
              validateMessages={validateMessages}>

            <Form.Item>
                <PageHeader
                    className="site-page-header"
                    title={isUpdated?'Cập nhật tài khoản':'Đăng ký tài khoản'}
                />
            </Form.Item>

            <Form.Item
                name={'name'}
                label="Tên hiển thị"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={'email'}
                label="Email"
                rules={[
                    {
                        type: 'email',
                        required: true
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={'username'}
                label="Username"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={'password'}
                label="Password"
                rules={[
                    {
                        required: !isUpdated,
                    },
                ]}
            >
                <Input placeholder={isUpdated ? "Không nhập nếu ông muốn đổi" : "nhập mật khẩu"}/>
            </Form.Item>

            {isUpdated ? <Form.Item label="Ảnh đại diện">
                <Upload
                    accept={"image/*"}
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={false}
                    onChange={onChange}
                    onPreview={onPreview}
                >
                    {fileList.length < 1 && '+ Upload'}
                </Upload>
            </Form.Item> : null}


            <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
            >
                <div>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </div>

            </Form.Item>

            <Modal open={previewOpen} title={"Ảnh đại diện"} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </Form>
    );
};
export default UserDetail;