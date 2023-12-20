import {Button, Form, Input, message, Modal, PageHeader, Popconfirm, Select, Table} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import {nanoid} from "nanoid";
import {useRouter} from "next/router";
import {timKiemKhachHang} from "../../api/khachHangApi";
import {timKiemTaiLieuPhieuMuon} from "../../api/searchApi";
import {
    baoGia,
    chiTietPhieuMuon,
    huyPhieuMuon,
    suaPhieuMuon,
    themPhieuMuon,
    xacNhanPhieuMuon
} from "../../api/phieuMuonApi";

const Option = Select.Option

function AddLoanPage({maPM}) {
    const authContextValue = useContext(AuthContext);
    const router = useRouter();
    const [form] = Form.useForm();

    const [isUpdate, setIsUpdate] = useState(false)

    const [listTaiLieuSelect, setListTaiLieuSelect] = useState([]);
    const [taiLieuSelect, setTaiLieuSelect] = useState({})
    const [listKhachHang, setListKhachHang] = useState([])
    const [maTaiLieus, setMaTaiLieus] = useState([]);

    const [khachHang, setKhachHang] = useState({});
    const [maPhieuMuon, setMaPhieuMuon] = useState(null);
    const [ngayMuonTra, setNgayMuonTra] = useState({});

    const [listTaiLieu, setListTaiLieu] = useState([]);
    const [tongGiaCoc, setTongGiaCoc] = useState();

    const [confirmVisible, setConfirmVisible] = useState(false);

    const [tttlOrder, setTttlOrder] = useState([])

    const handleConfirm = () => {

        const request = {
            taiLieus: listTaiLieu,
            maKH: khachHang.maKH
        }
        console.log("request phiếu mượn");
        console.log(request)
        if (!isUpdate) {
            themPhieuMuon(authContextValue?.token, request, (res) => {
                setMaPhieuMuon(res.data.maPM)
                setIsUpdate(true);
                setNgayMuonTra({
                    ngayMuon: res.data.ngayMuon,
                    ngayHenTraPhieu: res.data.ngayHenTraPhieu
                })
                setConfirmVisible(true);
            }, (err) => {
                message.error(err.data?.errorMessage)
            })
        } else {
            suaPhieuMuon(authContextValue?.token, maPhieuMuon, request, (res) => {
                setNgayMuonTra({
                    ngayMuon: res.data.ngayMuon,
                    ngayHenTraPhieu: res.data.ngayHenTraPhieu
                })
                setConfirmVisible(true);
            }, (err) => {
                message.error(err.data?.errorMessage)
            })
        }

    };

    const handleCancel = () => {
        setConfirmVisible(false);
    };

    const handleOk = () => {
        // Xử lý hành động khi xác nhận
        xacNhanPhieuMuon(authContextValue?.token, maPhieuMuon, (res) => {
            router.push('/loan/list_loan')
        }, (err) => {
            console.log(err)
            message.error(err.data?.errorMessage)
        })
        setConfirmVisible(false);
    };


    useEffect(() => {
        if (maPM === undefined || maPM === null || maPM.length === 0) {
            console.log("case create")
            setIsUpdate(false)
        } else {
            chiTietPhieuMuon(authContextValue?.token, maPM, (res) => {

                setMaPhieuMuon(res.data.maPM)
                setNgayMuonTra({
                    ngayMuon: res.data.ngayMuon,
                    ngayHenTraPhieu: res.data.ngayHenTraPhieu
                })
                setListTaiLieu(res.data.phiCoc?.feeTaiLieus)
                setMaTaiLieus(res.data.phiCoc?.feeTaiLieus.map((value, index, array) => value.maTaiLieu))
                setKhachHang(res.data.khachHang)
                setTongGiaCoc(res.data.phiCoc?.tongGiaCoc)
                setIsUpdate(true)
            }, (err) => {
                message.error(err.data?.message)
                console.log(err)
                setIsUpdate(false)
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
                    readOnly
                    onChange={(e) => handleInputChange(record.key, 'maTaiLieu', e.target.value)}
                />
            ),
        },
        {
            title: 'Tên tài liệu',
            dataIndex: 'tenTaiLieu',
            render: (text, record) => (
                <Input
                    readOnly
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'ngayNhap', e.target.value)}
                />
            ),
        },
        {
            title: 'Giá tài liệu',
            dataIndex: 'giaSach',
            render: (text, record) => (
                <Input
                    value={text}
                    readOnly
                    onChange={(e) => handleInputChange(record.key, 'viTri', e.target.value)}
                />
            ),
        },
        {
            title: 'Gía mượn',
            dataIndex: 'giaMuon',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'ghiChu', e.target.value)}
                />
            ),
        },
        {
            title: 'Gía đặt cọc',
            dataIndex: 'giaCoc',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'ghiChu', e.target.value)}
                />
            ),
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     render: (text, record) => (
        //         <Select
        //             placeholder="Trang thai tai lieu"
        //             defaultValue={record.status}
        //             value={record.status}
        //             onChange={(value) => handleInputChange(record.key, 'status', value)}>
        //             {listKhachHang.map((item, index) => (
        //                 <Option value={item.code} label={item.name}>{item.name}</Option>
        //             ))}
        //         </Select>
        //     ),
        // },
        {
            title: 'Action',
            render: (text, record) => (
                <Button danger onClick={() => handleRemoveRow(record.key, record)}>Remove</Button>
            ),
        },
    ];

    const columnsView = [
        {
            title: 'Mã tài liệu',
            dataIndex: 'maTaiLieu',
            width: '10%',
        },
        {
            title: 'Tên tài lệu',
            dataIndex: 'tenTaiLieu',
            width: '20%',
        },
        {
            title: 'Giá đặt cọc',
            dataIndex: 'giaCoc',
            width: '10%',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            width: '40%',
        },

    ]

    const handleAddRow = () => {
        const newCustomerSelect = [
            ...maTaiLieus,
            taiLieuSelect.maTaiLieu
        ]

        const requestBaoGia = {
            maTaiLieus: newCustomerSelect,
            maKH: khachHang.maKH,
            maPM: maPhieuMuon
        }
        baoGia(authContextValue?.token, requestBaoGia, (res) => {
                setListTaiLieu(res.data.taiLieuVaGias)
                setTongGiaCoc(res.data.tongGiaCoc)
                setMaTaiLieus(newCustomerSelect);
                setTaiLieuSelect({})
            },
            (err) => {
                console.log(err)
                message.error("loi api hoac du lieu khong hop le")
            })
    };


    const handleRemoveRow = (key, record) => {
        const updatedDataSource = maTaiLieus.filter((item) => item !== record.maTaiLieu);
        const requestBaoGia = {
            maTaiLieus: updatedDataSource,
            maKH: khachHang.maKH,
            maPM: maPhieuMuon
        }
        baoGia(authContextValue?.token, requestBaoGia, (res) => {
                setListTaiLieu(res.data.taiLieuVaGias)
                setTongGiaCoc(res.data.tongGiaCoc)
                setMaTaiLieus(updatedDataSource);
            },
            (err) => {
                console.log(err)
                message.error("loi api hoac du lieu khong hop le")
            })

    };

    function handleSearch(value) {
        const param = {
            page: 1,
            size: 1000,
            keyword: value
        }
        timKiemKhachHang(authContextValue?.token, param, (res) => {
            setListKhachHang(res.data.content);
        }, (err) => {
            console.log(err)
            message.error("lỗi api tìm kiếm khách hàng")
        })
    }

    function handleSearchTaiLieu(value) {
        const params = {
            keyword: value
        };
        timKiemTaiLieuPhieuMuon(authContextValue?.token, params, (res) => {
            setListTaiLieuSelect(res.data)
        }, (err) => {
            console.log(err)
            message.error("loi api tim kiem tai lieu")
        })
    }

    function handleConfirmHuy() {
        if (!isUpdate) {
            router.push("/loan/list_loan")
        } else {
            huyPhieuMuon(authContextValue?.token, maPM, (res) => {
                message.info("huy phieu muon thanh cong")
                router.push("/loan/list_loan")
            }, (err) => {
                message.info("huy phieu muon that bai")
            })
        }
    }

    return (
        <Form
            {...layout}
            form={form}
            validateMessages={validateMessages}
        >
            <Form.Item>
                <PageHeader
                    className="site-page-header"
                    onBack={() => router.push('/loan/list_loan')}
                    title={isUpdate ? 'Chỉnh sửa phiếu mượn' : 'Tạo mới phiếu mượn'}
                />
            </Form.Item>


            <Form.Item
                name={"Mã khách hàng"}
                label="Khách hàng"
                rules={[{required: true,},]}>
                <Select
                    showSearch
                    placeholder="Nhập mã khách hàng"
                    onSearch={handleSearch}
                    value={khachHang.maKH}
                    onChange={(value) => {
                        let value1 = '';
                        if (typeof value === "string")
                            value1 = value;
                        else value1 = value.value;
                        const kh = listKhachHang.find((item, index, obj) => item?.maKH === value1);
                        setKhachHang(kh)
                    }}
                    defaultActiveFirstOption={false}
                    filterOption={false}
                >
                    {listKhachHang.map((item, index) => (
                        <Option key={nanoid()} value={item.maKH}>{item.maKH}-{item.hoTenKH}</Option>
                    ))}
                </Select>
            </Form.Item>

            {isUpdate ? (
                <Form.Item label={"Mã phiếu mượn"}>
                    <Input readOnly value={maPhieuMuon}/>
                </Form.Item>
            ) : <div/>}

            {
                tttlOrder.length > 0 ? (
                    <Form.Item label={"Danh sách tài liệu order"}>
                        <Table
                            bordered
                            pagination={false}
                            dataSource={listTaiLieu}
                            scroll={{y: 200}}
                            columns={columnsView}
                        />
                    </Form.Item>) : <div/>
            }

            <Form.Item label="Thông tin khách hàng">
                <div>
                    <div>Tên khách hàng: <span>{khachHang.hoTenKH}</span></div>
                    <div>Số điện thoại: <span>{khachHang.sdt}</span></div>
                    <div>Trạng thái: <span>{khachHang.statusPhieuMuonText}</span></div>
                </div>
            </Form.Item>
            <Form.Item name={"selectTaiLieu"} label={"Chọn tài liệu"} rules={[{required: true,},]}>
                <Select
                    style={{
                        display: 'flex',
                        marginRight: 10,
                    }}
                    showSearch
                    onSearch={handleSearchTaiLieu}
                    placeholder="Nhập mã tài liệu"
                    value={taiLieuSelect.maTaiLieu}
                    onChange={(value1) => {
                        setTaiLieuSelect(listTaiLieuSelect.find((value, index, obj) => value.maTaiLieu === value1))
                    }}
                    allowClear={true}
                    optionLabelProp="label">
                    {listTaiLieuSelect.map((item, index) => (
                        <Option key={nanoid()} value={item.maTaiLieu}
                                label={item.maTaiLieu}>{item.maTaiLieu} - {item.tenTaiLieu}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label={"Thông tin tài liệu"}>
                <div>
                    <div style={{
                        alignItems: 'center',
                        marginBottom: 16,
                    }}>

                        <div style={{
                            marginRight: 10,
                            width: '50%'
                        }}>
                            <div style={{marginRight: 10,}}>Tên tài liệu: <span>{taiLieuSelect.tenTaiLieu}</span></div>
                            <div style={{marginRight: 10,}}>Loại tài liệu: <span>{taiLieuSelect.loaiTaiLieu}</span>
                            </div>
                            <div style={{marginRight: 10,}}>Trạng thái: <span>{taiLieuSelect.statusText}</span></div>
                        </div>
                        <Button
                            onClick={handleAddRow}
                            type="primary">
                            Thêm tài liệu
                        </Button>
                    </div>
                </div>
            </Form.Item>
            <Form.Item name={"dsTaiLieu"} label={"Danh sách tài liệu mượn"} rules={[{required: true,},]}>
                <Table
                    bordered
                    dataSource={listTaiLieu}
                    pagination={false}
                    scroll={{y: 200}}
                    columns={columns}
                />
            </Form.Item>

            <Form.Item label={"Tổng giá:"}>
                <div>
                    <div>Tổng giá cọc: <span>{tongGiaCoc}</span> VND</div>
                </div>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
            >

                {/*<Button*/}
                {/*    style={{*/}
                {/*        marginRight: 10,*/}
                {/*        width: '150px'*/}
                {/*    }}*/}
                {/*    type="primary" onClick={handleCreateNewLoan}>*/}
                {/*    {isUpdate ? 'Sửa đơn đặt mượn' : 'Tạo đơn đặt mượn'}*/}
                {/*</Button>*/}
                <Popconfirm
                    title={isUpdate ? "Chỉnh sủa và xác nhận phiếu mượn" : "Tao và xác nhận phiếu mượn"}
                    onConfirm={handleConfirm}
                    okText={"Xác nhận"}
                    cancelText={"Hủy"}
                >
                    <Button
                        style={{
                            marginRight: 10,
                            width: '150px'
                        }}
                        type="primary">
                        Xác nhận
                    </Button>
                </Popconfirm>

                <Popconfirm
                    title={isUpdate ? "xác nhận hủy phiếu mượn" : "xác nhận thoát"}
                    onConfirm={handleConfirmHuy}
                    okText={"Xác nhận"}
                    cancelText={"Hủy"}
                >
                    <Button
                        style={{
                            marginRight: 10,
                            width: '150px'
                        }}
                        onClick={() => {
                        }}
                        type="danger">
                        Hủy đặt mượn
                    </Button>
                </Popconfirm>

                <Button
                    style={{
                        marginRight: 10,
                        width: '100px'
                    }}
                    danger
                    onClick={() => router.push("/loan/list_loan")}
                >Thoát</Button>
            </Form.Item>

            <Modal
                title="Xác nhận cho mượn tài liêu"
                visible={confirmVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                centered
                width={1000}
            >
                <div>Mã phiếu mượn: <span>{maPhieuMuon}</span></div>
                <div>Mã khách hàng: <span>{khachHang.maKH}</span></div>
                <div>Tên khách hàng: <span>{khachHang.hoTenKH}</span></div>
                <div>Ngày mượn: <span>{ngayMuonTra.ngayMuon}</span></div>
                <div>Hạn trả: <span>{ngayMuonTra.ngayHenTraPhieu}</span></div>
                <Table
                    bordered
                    pagination={false}
                    dataSource={listTaiLieu}
                    scroll={{y: 200}}
                    columns={columnsView}
                />
                <div>Tổng tiền cọc: <span>{tongGiaCoc}</span></div>
            </Modal>
        </Form>

    );
}

AddLoanPage.getInitialProps = async ({query}) => {
    const {maPM} = query;

    return {
        maPM,
    }
}

export default AddLoanPage