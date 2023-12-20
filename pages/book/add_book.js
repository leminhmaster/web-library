import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    PageHeader,
    Popconfirm,
    Select,
    Table,
    Upload
} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {apiUploadSingleFile} from "../../api/uploadApi";
import {AuthContext} from "../../contexts/AuthContext";
import {
    apiListLoaiTaiLieu,
    apiListNgonNgu,
    apiListNhaXuatBan,
    apiListQuocGia,
    apiListTacGia,
    apiListTaiLieuStatus,
    apiListTheLoai
} from "../../api/publicApi";
import {nanoid} from "nanoid";
import {chiTietTailieu, suaTaiLieu, themTaiLieu, timKiemTaiLieuDetail, xoaTaiLieuDetail} from "../../api/taiLieuApi";
import {useRouter} from "next/router";
import moment from "moment";
import {addKeyToRecord} from "../../utils/anotherUtils";

const Option = Select.Option

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function AddBookPage({id}) {
    const authContextValue = useContext(AuthContext);
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [count, setCount] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [fileListRemoved, setFileListRemoved] = useState([]);

    const [maTienTo, setMaTienTo] = useState('');
    const [viTri, setViTri] = useState('');
    const [soThuTuBatDau, setSoThuTuBatDau] = useState(0);
    const [soLuong, setSoLuong] = useState(0);
    const [taiLieuStatus, setTaiLieuStatus] = useState('')
    const [isUpdate, setIsUpdate] = useState(false)

    const [listNXB, setListNXB] = useState([])
    const [listTacGia, setListTacGia] = useState([])
    const [listTheLoai, setListTheLoai] = useState([])
    const [listQuocGia, setListQuocGia] = useState([])
    const [listLoaiTaiLieu, setListLoaiTaiLieu] = useState([])
    const [listNgonNgu, setListNgonNgu] = useState([])
    const [listTLStatus, setListTLStatus] = useState([])
    const [listTaiLieu, setListTaiLieu] = useState([]);
    const router = useRouter();
    const [thongTinTaiLieu, setThongTinTaiLieu] = useState({
        maThongTinTaiLieu: '',
        tenTaiLieu: '',
        theLoaiIds: [],
        tacGiaIds: [],
        soISBN: '',
        ngayXuatBan: null,
        nhaXuatBanId: null,
        loaiTaiLieu: null,
        ngonNguId: null,
        quocGiaId: null,
        images: [],
        giaSach: 0,
        listTaiLieu: [],
        giaMuon: 0,
        tomTatND: null
    })
    const [paramSearchTaiLieu, setParamSearchTaiLieu] = useState({
        statues: [],
        maTaiLieu: '',
        viTri: '',
    })

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChangeUploadFile = (info) => {
        // console.log(info)
        const {status, originFileObj} = info.file;
        if (status === 'uploading') {
            apiUploadSingleFile(authContextValue?.token,
                'DOCUMENT',
                originFileObj, (res) => {
                    // console.log("successful post file")
                    // console.log(res)
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
            const newObjectInfo = {
                ...info.file,
                command: 'DELETE'
            }
            const newListFile = fileList.filter((ele, currentIndex) => ele.id !== info.file.id)
            const newFileListRemoved = [...fileListRemoved, newObjectInfo]
            console.log('file list removed ' + JSON.stringify(newFileListRemoved))
            setFileList(newListFile)
            setFileListRemoved(newFileListRemoved);
        }

    };

    useEffect(() => {
        apiListTacGia((res) => {
            setListTacGia(res.data.content);
        })
        apiListTheLoai((res) => {
            setListTheLoai(res.data.content);
        })
        apiListNhaXuatBan((res) => {
            setListNXB(res.data.content);
        })
        apiListQuocGia((res) => {
            setListQuocGia(res.data);
        })
        apiListNgonNgu((res) => {
            setListNgonNgu(res.data);
        })
        apiListLoaiTaiLieu((res) => {
            setListLoaiTaiLieu(res.data);
        })
        apiListTaiLieuStatus((res) => {
            setListTLStatus(res.data);
        })

        if (id === undefined || id === null || id.length === 0) {
            console.log("case create")
            setIsUpdate(false)
        } else {
            chiTietTailieu(authContextValue?.token, id, (res) => {
                console.log("case update" + JSON.stringify(res.data))
                console.log(res.data)
                setIsUpdate(true)
                setListTaiLieu(res.data.listTaiLieu.map((value, index, array) => {
                    return {
                        ...value,
                        key: nanoid()
                    }
                }))
                setFileList(res.data.images.map((value, index, array) => {
                    return {
                        ...value,
                        key: nanoid()
                    }
                }))
                setThongTinTaiLieu({...res.data})
                setFormData(res.data)
            }, (err) => {
                console.log(err)
                message.error("lỗi khi call get api")
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

    /* eslint-disable no-template-curly-in-string */
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

    const getFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };


    const onFinish = () => {
        form.validateFields()
            .then((values) => {
                updateOrCreate();
            })
            .catch((errorInfo) => {
                console.log('Form validation failed:', errorInfo);
            })
    };

    const updateOrCreate = () => {
        const newValues = {
            ...thongTinTaiLieu,
            listTaiLieu: listTaiLieu,
            images: [...fileList, ...fileListRemoved]
        }
        if (!isUpdate) {
            console.log("create book")
            console.log(newValues)
            themTaiLieu(authContextValue?.token, newValues, (res) => {
                    router.push("/book/list_book")
                },
                (error) => {
                    message.error(error.data)
                })
        } else {
            console.log("update book")
            console.log(newValues)
            suaTaiLieu(authContextValue?.token, id, newValues, (res) => {
                router.push("/book/list_book")
            }, (error) => {
                message.error(error.data)
                    .then(r => {
                        console.log(r)
                    })
            })
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8,}}>Upload</div>
        </div>
    );

    const handleInputChange = (key, dataIndex, value) => {
        const updatedDataSource = listTaiLieu.map((item) => {
            if (item.key === key) {
                return {...item, [dataIndex]: value};
            }
            return item;
        });
        setListTaiLieu(updatedDataSource);
    };

    const columns = [
        {
            title: 'Mã tài liệu',
            dataIndex: 'maTaiLieu',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'maTaiLieu', e.target.value)}
                />
            ),
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'ngayNhap',
            render: (text, record) => (
                <Input
                    readOnly
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'ngayNhap', e.target.value)}
                />
            ),
        },
        {
            title: 'Vị trí',
            dataIndex: 'viTri',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'viTri', e.target.value)}
                />
            ),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'ghiChu', e.target.value)}
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text, record) => (
                <Select
                    placeholder="Trang thai tai lieu"
                    defaultValue={record.status}
                    value={record.status}
                    onChange={(value) => handleInputChange(record.key, 'status', value)}>
                    {listTLStatus.map((item, index) => (
                        <Option value={item.code} label={item.name}>{item.name}</Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Action',
            render: (text, record) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa tài liệu này sau khi xóa s không thể khôi phục?"
                    onConfirm={() =>
                        handleRemoveRow(record.key, record)}

                    okText="Xác nhận"
                    cancelText="Hủy bỏ"
                >
                    <Button type='danger'>Remove</Button>
                </Popconfirm>


            ),
        },
    ];

    const handleAddRow = () => {
        if (soLuong === undefined || soLuong === null || soLuong <= 0)
            return;
        const rowAdds = [];
        const dateNow = new Date();
        for (let i = 0; i < soLuong; i++) {
            const newData = {
                key: nanoid(),
                maTaiLieu: maTienTo + '-' + (soThuTuBatDau + i),
                ngayNhap: moment(dateNow).format("DD-MM-yyyy hh:mm:ss"),
                viTri: viTri,
                ghiChu: '',
                status: taiLieuStatus,
            };
            rowAdds.push(newData)
        }

        setListTaiLieu([...listTaiLieu, ...rowAdds]);
        setCount(count + 1);
    };


    const handleRemoveRow = (key, record) => {
        const newListTaiLieu = listTaiLieu
            .filter((item) => {
                if (item.key !== key)
                    return true;
                else {
                    if (item.id === undefined || item.id === null) {
                        return false;
                    }
                    let value;
                    xoaTaiLieuDetail(authContextValue?.token, item.id, (res) => {
                        value = false;
                    }, (err) => {
                        message.error(err.data.errorMessage)
                        value = true;
                    })
                    console.log(value);
                    return value;
                }
            });
        setListTaiLieu(newListTaiLieu);
    };

    const setFormData = (info) => {
        form.setFieldsValue(info);
    }

    const handleSearchTaiLieu = () => {
        console.log("search tai lieu")
        console.log(paramSearchTaiLieu)
        timKiemTaiLieuDetail(authContextValue?.token, id, paramSearchTaiLieu, (res) => {
            setListTaiLieu(addKeyToRecord(res.data));
        }, (err) => {
            message.error("co loi xay ra")
        })
    };

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
                    // onBack={() => router.push('/book/list_book')}
                    title={isUpdate ? 'Chỉnh sửa tài liệu' : 'Tạo mới tài liệu'}
                />
            </Form.Item>

            <Form.Item
                name={"maThongTinTaiLieu"}
                label="Mã Tài Liệu"
                rules={[{required: true,},]}
            >
                <Input onChange={(e) => {
                    const newTTTLValue = {
                        ...thongTinTaiLieu,
                        maThongTinTaiLieu: e.target.value
                    }
                    setThongTinTaiLieu(newTTTLValue)
                }} value={thongTinTaiLieu.maThongTinTaiLieu}/>
            </Form.Item>

            <Form.Item
                name={"tenTaiLieu"}
                label="Tên Tài Liệu"
                rules={[{required: true,},]}
            >
                <Input onChange={(e) => {
                    const newTTTLValue = {
                        ...thongTinTaiLieu,
                        tenTaiLieu: e.target.value
                    }
                    setThongTinTaiLieu(newTTTLValue)
                }} value={thongTinTaiLieu.tenTaiLieu}/>
            </Form.Item>
            <Form.Item
                name={"loaiTaiLieu"}
                label="Loại tài liệu"
                rules={[{required: true,},]}>
                <Select
                    placeholder="Chọn loại tài liệu"
                    value={thongTinTaiLieu.loaiTaiLieu}
                    defaultValue={thongTinTaiLieu.loaiTaiLieu}
                    onChange={(value) => {
                        const newTTTLValue = {
                            ...thongTinTaiLieu,
                            loaiTaiLieu: value
                        }
                        setThongTinTaiLieu(newTTTLValue)
                    }}
                    allowClear={true}
                    optionLabelProp="label">
                    {listLoaiTaiLieu.map((item, index) => (
                        <Option key={nanoid()} value={item.code} label={item.name}>{item.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Thể Loại"
            >
                <Select
                    mode="multiple"
                    placeholder="Chọn thể loại"
                    value={thongTinTaiLieu.theLoaiIds}
                    defaultValue={thongTinTaiLieu.theLoaiIds}
                    onChange={(value) => {
                        const newTTTLValue = {
                            ...thongTinTaiLieu,
                            theLoaiIds: value
                        }
                        setThongTinTaiLieu(newTTTLValue)
                    }}
                    allowClear={true}
                    optionLabelProp="label">
                    {listTheLoai.map((item, index) => (
                        <Option key={nanoid()} value={item.id} label={item.tenTheLoai}>{item.tenTheLoai}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Tác giả"
            >
                <Select
                    mode="multiple"
                    placeholder="Chọn tác giả"
                    value={thongTinTaiLieu.tacGiaIds}
                    defaultValue={thongTinTaiLieu.tacGiaIds}
                    onChange={(value) => {
                        const newTTTLValue = {
                            ...thongTinTaiLieu,
                            tacGiaIds: value
                        }
                        setThongTinTaiLieu(newTTTLValue)
                    }}
                    allowClear={true}
                    optionLabelProp="label"
                >
                    {listTacGia.map((item, index) => (
                        <Option key={nanoid()} value={item.id} label={item.tenTG}>{item.tenTG}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="số ISBN"
            >
                <Input onChange={(e) => {
                    const newTTTLValue = {
                        ...thongTinTaiLieu,
                        soISBN: e.target.value
                    }
                    setThongTinTaiLieu(newTTTLValue)
                }} value={thongTinTaiLieu.soISBN}/>
            </Form.Item>

            <Form.Item
                label="Ngày xuất bản"
            >
                <DatePicker
                    value={thongTinTaiLieu.ngayXuatBan !== null ? moment(thongTinTaiLieu.ngayXuatBan, 'YYYY-MM-DD') : undefined}
                    onChange={(date, dateString) => {
                        const newTTTLValue = {
                            ...thongTinTaiLieu,
                            ngayXuatBan: date?.format('YYYY-MM-DD') ?? null
                        }
                        setThongTinTaiLieu(newTTTLValue)
                    }}/>
            </Form.Item>

            <Form.Item
                label="Nhà xuất bản"
            >
                <Select
                    placeholder="Cho nhà xuất bản"
                    optionLabelProp="label"
                    value={thongTinTaiLieu.nhaXuatBanId}
                    defaultValue={thongTinTaiLieu.nhaXuatBanId}
                    onChange={(value) => {
                        const newTTTLValue = {
                            ...thongTinTaiLieu,
                            nhaXuatBanId: value
                        }
                        setThongTinTaiLieu(newTTTLValue)
                    }}
                    allowClear={true}
                >
                    {listNXB.map((item, index) => (
                        <Option key={nanoid()} value={item.id} label={item.tenNXB}>{item.tenNXB}</Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item
                label="Ngôn Ngữ"
            >
                <Select
                    placeholder="Chọn ngôn ngữ"
                    value={thongTinTaiLieu.ngonNguId}
                    defaultValue={thongTinTaiLieu.ngonNguId}
                    onChange={(value) => {
                        const newTTTLValue = {
                            ...thongTinTaiLieu,
                            ngonNguId: value
                        }
                        setThongTinTaiLieu(newTTTLValue)
                    }}
                    allowClear={true}
                    optionLabelProp="label">
                    {listNgonNgu.map((item, index) => (
                        <Option value={item.id} label={item.tenNgonNgu}>{item.tenNgonNgu}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Quốc gia"
            >
                <Select
                    placeholder="Chọn quốc gia"
                    value={thongTinTaiLieu.quocGiaId}
                    defaultValue={thongTinTaiLieu.quocGiaId}
                    onChange={(value) => {
                        const newTTTLValue = {
                            ...thongTinTaiLieu,
                            quocGiaId: value
                        }
                        setThongTinTaiLieu(newTTTLValue)
                    }}
                    allowClear={true}
                    optionLabelProp="label">
                    {listQuocGia.map((item, index) => (
                        <Option value={item.id} label={item.tenQuocGia}>{item.tenQuocGia}</Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item
                label="Giá Sách"
                rules={[
                    {
                        type: 'number'
                    },
                ]}
            >
                <InputNumber onChange={(value) => {
                    const newTTTLValue = {
                        ...thongTinTaiLieu,
                        giaSach: value
                    }
                    setThongTinTaiLieu(newTTTLValue)
                }} value={thongTinTaiLieu.giaSach}/>
            </Form.Item>

            <Form.Item
                label="Giá mượn"
                rules={[
                    {
                        type: 'number'
                    },
                ]}
            >
                <InputNumber onChange={(value) => {
                    const newTTTLValue = {
                        ...thongTinTaiLieu,
                        giaMuon: value
                    }
                    setThongTinTaiLieu(newTTTLValue)
                }} value={thongTinTaiLieu.giaMuon}/>
            </Form.Item>

            <Form.Item
                label="Tóm tắt nội dung">
                <Input.TextArea onChange={(e) => {
                    const newTTTLValue = {
                        ...thongTinTaiLieu,
                        tomTatND: e.target.value
                    }
                    setThongTinTaiLieu(newTTTLValue)
                }} value={thongTinTaiLieu.tomTatND}/>
            </Form.Item>


            <Form.Item
                label="Ảnh tài liệu" getValueFromEvent={getFile}>
                <Upload
                    accept={"image/*"}
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={false}
                    onPreview={handlePreview}
                    onChange={handleChangeUploadFile}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>

            </Form.Item>

            <Form.Item label={"Thêm mới tài liệu"}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
                >
                    <Input style={{
                        marginRight: 10,
                        width: '20%'
                    }}
                           value={maTienTo}
                           placeholder={"Mã tiền tố"}
                           onChange={(e) => {
                               setMaTienTo(e.target.value)
                           }}/>

                    <Input style={{
                        marginRight: 10,
                        width: '20%'
                    }}
                           value={viTri}
                           placeholder={"Vị Trí"}
                           onChange={(e) => {
                               setViTri(e.target.value)

                           }}/>
                    <InputNumber
                        style={{
                            marginRight: 10,
                            width: '20%'
                        }}
                        value={soThuTuBatDau}
                        placeholder={"Số thứ tự bắt đầu"}
                        onChange={(value) => {
                            setSoThuTuBatDau(value)
                        }}/>
                    <InputNumber
                        style={{
                            marginRight: 10,
                            width: '20%'
                        }}
                        value={soLuong}
                        placeholder={"Số lượng"} onChange={(value) => {
                        setSoLuong(value)
                    }}/>
                    <Select
                        style={{
                            marginRight: 10,
                            width: '20%'
                        }}
                        value={taiLieuStatus}
                        placeholder="Trang thai tai lieu"
                        onChange={(value) => {
                            setTaiLieuStatus(value)
                        }}>
                        {listTLStatus.map((item, index) => (
                            <Option key={nanoid()} value={item.code} label={item.name}>{item.name}</Option>
                        ))}
                    </Select>
                    <Button
                        onClick={handleAddRow}
                        type="primary">
                        Thêm tài liệu
                    </Button>
                </div>
            </Form.Item>

            <Form.Item label={"Danh sách tài liệu"}>
                <div>
                    {
                        isUpdate ? (<div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 16,
                        }}
                        >
                            <Input style={{
                                marginRight: 10,
                                width: '20%'
                            }}
                                   value={paramSearchTaiLieu.maTaiLieu}
                                   placeholder={"Mã TL"}
                                   onChange={(e) => {
                                       const newParam = {
                                           ...paramSearchTaiLieu,
                                           maTaiLieu: e.target.value
                                       }
                                       setParamSearchTaiLieu(newParam)
                                   }}/>
                            <Input
                                style={{
                                    marginRight: 10,
                                    width: '20%'
                                }}
                                value={paramSearchTaiLieu.viTri}
                                placeholder={"Vị trí"}
                                onChange={(e) => {
                                    const newParam = {
                                        ...paramSearchTaiLieu,
                                        viTri: e.target.value
                                    }
                                    setParamSearchTaiLieu(newParam)
                                }}
                            />
                            <Select
                                style={{
                                    marginRight: 10,
                                    width: '20%'
                                }}
                                value={paramSearchTaiLieu.statues}
                                placeholder="Trang thai tai lieu"
                                onChange={(value) => {
                                    const newParam = {
                                        ...paramSearchTaiLieu,
                                        statues: [value]
                                    }
                                    setParamSearchTaiLieu(newParam)
                                }}>
                                {listTLStatus.map((item, index) => (
                                    <Option key={nanoid()} value={item.code} label={item.name}>{item.name}</Option>
                                ))}
                            </Select>
                            <Button
                                onClick={handleSearchTaiLieu}
                                type="primary">
                                Tìm kiếm
                            </Button>
                        </div>) : (<div/>)
                    }

                    <Table
                        bordered
                        dataSource={listTaiLieu}
                        scroll={{y: 300}}
                        columns={columns}
                    />
                    <div>Tổng số: <span>{listTaiLieu.length}</span></div>
                </div>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
            >
                <Button style={{marginRight: 10,}} type="primary" htmlType="submit">
                    {isUpdate ? 'Chỉnh sửa thông tin' : 'Tạo mới tài liệu'}
                </Button>

                <Button style={{marginRight: 10,}} type="danger" onClick={() => {
                    router.push("/book/list_book")
                }}>Hủy</Button>
            </Form.Item>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
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
}

AddBookPage.getInitialProps = async ({query}) => {
    const {id} = query;

    return {
        id,
    }
}

export default AddBookPage