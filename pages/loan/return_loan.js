import {Button, Form, Input, InputNumber, message, Modal, PageHeader, Popconfirm, Select, Table} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {AuthContext} from "../../contexts/AuthContext";
import {nanoid} from "nanoid";
import {useRouter} from "next/router";
import {chiTietPhieuMuon, timKiemPhieuMuon} from "../../api/phieuMuonApi";
import {apiListAllViPham, capNhatTra, kiemTraVaBaoGia, xacNhanTraPhieu} from "../../api/traApi";
import {addKeyToRecord, genButton, genTagNoIcon} from "../../utils/anotherUtils";

const Option = Select.Option

function ReturnLoanPage({maPM}) {
    const authContextValue = useContext(AuthContext);
    const router = useRouter();

    const [previewOpen, setPreviewOpen] = useState(false);

    const [taiLieuVP, setTaiLieuVP] = useState('');
    const [viPham, setViPham] = useState();
    const [heSo, setHeSo] = useState(0);

    const [listPhieuMuonSelect, setListPhieuMuonSelect] = useState([])
    const [listViPhamSelect, setListViPhamSelect] = useState([])
    const [phieuMuonInfo, setPhieuMuonInfo] = useState({})//co thong tin khach hang
    const [phiCoc, setPhiCoc] = useState({
        feeTaiLieus: [],
        tongPhi: 0
    });
    const [phiMuon, setPhiMuon] = useState({
        feeTaiLieus: [],
        tongPhi: 0
    });
    const [phiViPham, setPhiViPham] = useState({
        feeTaiLieus: [],
        tongPhi: 0
    });

    const handleCancel = () => setPreviewOpen(false);

    useEffect(() => {
        apiListAllViPham(authContextValue?.token, (res) => {
            setListViPhamSelect(res.data);
        }, (err) => {
            message.error("loi khi call api get list vi pham")
        });

        if (maPM !== undefined && maPM !== null && maPM !== '') {
            console.log("case have maPM " + maPM)
            callGetDetailApi(maPM);
        }

    }, []);

    const callGetDetailApi = (maPM) => {
        chiTietPhieuMuon(authContextValue?.token, maPM, (res) => {
            setPhieuMuonInfo(res.data);
            setFeeFromResponseApi(res.data)

        }, (err) => {
            message.error("lõi call api" + err.data.message)

        })
    }

    const setFeeFromResponseApi = (response) => {
        setPhiCoc({
            tongPhi: response.phiCoc.tongPhi,
            feeTaiLieus: addKeyToRecord(response.phiCoc.feeTaiLieus)
        });
        setPhiMuon({
            tongPhi: response.phiMuon.tongPhi,
            feeTaiLieus: addKeyToRecord(response.phiMuon.feeTaiLieus)
        });
        setPhiViPham({
            tongPhi: response.phiViPham.tongPhi,
            feeTaiLieus: addKeyToRecord(response.phiViPham.feeTaiLieus)
        });
    }


    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const handleInputChange = (key, dataIndex, value) => {
        const updatedDataSource = phiCoc.feeTaiLieus.map((item) => {
            if (item.key === key) {
                return {...item, [dataIndex]: value};
            }
            return item;
        });
        const request = {
            listTaiLieuStatus: [...phiCoc.feeTaiLieus],
            listTaiLieuViPham: [...updatedDataSource]
        }
        callApiValidateAndTinhPhiTra(request)
    };

    function actionChangeStatusCTPM(key, status) {
        const newTLStatusRequest = phiCoc.feeTaiLieus.map((item, index) => {
            if (item.key === key) {
                return {
                    ...item,
                    status: status
                }
            }
            return {...item}
        })
        const request = {
            listTaiLieuStatus: [...newTLStatusRequest],
            listTaiLieuViPham: [...phiViPham.feeTaiLieus]
        }
        callApiValidateAndTinhPhiTra(request);

    }

    const columnsGiaCoc = [
        {
            title: 'Mã tài liệu',
            dataIndex: 'maTaiLieu',
        },
        {
            title: 'Tên tài liệu',
            dataIndex: 'tenTaiLieu',
        },
        {
            title: 'Gía đặt cọc',
            dataIndex: 'giaCoc',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text, record) => {
                switch (record.status) {
                    case 'DANG_MUON':
                        return genTagNoIcon("warning", record.statusText);
                    case 'DA_TRA':
                        return genTagNoIcon("success", record.statusText);
                    default:
                        return (<div/>)
                }
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                switch (record.status) {
                    case 'DANG_MUON':
                        return genButton("Xác nhận trả",
                            <CheckOutlined/>, 'success', () => actionChangeStatusCTPM(record.key, 'DA_TRA'));
                    case 'DA_TRA':
                        return genButton("Hủy trả",
                            <CloseOutlined/>, 'danger', () => actionChangeStatusCTPM(record.key, 'DANG_MUON'));
                    default:
                        return (<div/>)
                }
            }
        }
    ];

    const columnsGiaMuon = [
        {
            title: 'Mã tài liệu',
            dataIndex: 'maTaiLieu',

        },
        {
            title: 'Tên tài liệu',
            dataIndex: 'tenTaiLieu',

        },
        {
            title: 'Ngày mượn',
            dataIndex: 'ngayMuon',
        },
        {
            title: 'Ngày trả',
            dataIndex: 'ngayTra',
        },
        {
            title: 'Số ngày mượn',
            dataIndex: 'soNgayMuon',
        },
        {
            title: 'Giá mượn',
            dataIndex: 'giaMuon',
        },

        {
            title: 'Tổng giá mượn',
            dataIndex: 'thanhTien',
        },
    ];

    const columnsViPham = [
        {
            title: 'Mã tài liệu',
            dataIndex: 'maTaiLieu',
        },
        {
            title: 'Tên tài liệu',
            dataIndex: 'tenTaiLieu'
        },
        {
            title: 'Vi phạm',
            dataIndex: 'tenViPham',
        },
        {
            title: 'Giá phạt',
            dataIndex: 'soTienPhat',
            // render: (text, record) => (
            //     <Input
            //         value={text}
            //         onChange={(e) => handleInputChange(record.key, 'ghiChu', e.target.value)}
            //     />
            // ),
        },
        {
            title: 'Hệ số',
            dataIndex: 'heSoViPham',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleInputChange(record.key, 'heSoViPham', e.target.value)}
                />
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'thanhTien'
        },
        {
            title: 'Action',
            render: (text, record) => (
                <Button onClick={() => handleRemoveRow(record.key, record)}>Remove</Button>
            ),
        },
    ];

    const handleAddRow = () => {
        const newVpValue = {
            maTaiLieu: taiLieuVP,
            viPhamId: viPham,
            heSoViPham: heSo
        }
        const request = {
            listTaiLieuStatus: [...phiCoc.feeTaiLieus],
            listTaiLieuViPham: [...phiViPham.feeTaiLieus, newVpValue]
        }
        callApiValidateAndTinhPhiTra(request);
    };

    const callApiValidateAndTinhPhiTra = (request) => {
        kiemTraVaBaoGia(authContextValue?.token, maPM, request, (res) => {
            setFeeFromResponseApi(res.data)
        }, (err) => {
            console.log(err)
            message.error("loi khi call api validation va bao gia")
        })
    }


    const handleRemoveRow = (key, record) => {
        const updatedDataSource = phiViPham.feeTaiLieus.filter((item) => item.key !== key);
        const request = {
            listTaiLieuStatus: [...phiCoc.feeTaiLieus],
            listTaiLieuViPham: updatedDataSource
        }
        callApiValidateAndTinhPhiTra(request)
    };

    const handleConfirmTraPhieuMuon = () => {
        const request = {
            listTaiLieuStatus: [...phiCoc.feeTaiLieus],
            listTaiLieuViPham: [...phiViPham.feeTaiLieus]
        }
        capNhatTra(authContextValue?.token, maPM, request, (res) => {
            setFeeFromResponseApi(res.data)
            setPreviewOpen(true);
        }, (err) => {
            message.error("cap nhat khong thanh cong")
        })
    };

    function handleSearch(value) {
        const params = {
            keyword: value,
            statues: ['XAC_NHAN_MUON', 'DEN_HAN_TRA', 'QUA_HAN_TRA'],
            page: 1,
            size: 1000
        }
        timKiemPhieuMuon(authContextValue?.token, params, (res) => {
            setListPhieuMuonSelect(res.data.content);
        }, (err) => {
            message.error("loi khi call api tim kiem phieu muon")
        })
    }

    const handleOk = () => {
        xacNhanTraPhieu(authContextValue?.token, maPM, (res) => {
            message.info("cap nhat tra thanh cong")
                .then(() => router.push("/loan/list_loan"))
        }, err => {
            message.error("xac nhan tra khong thanh cong")
        })
    };
    return (
        <Form
            {...layout}
        >
            <Form.Item>
                <PageHeader
                    className="site-page-header"
                    onBack={() => router.push('/loan/list_loan')}
                    title={'Trả phiếu mượn'}
                />
            </Form.Item>

            <Form.Item
                label="Phiếu mượn"
                name={"maPM"}
                rules={[{required: true,},]}>
                <div>
                    <Select
                        showSearch
                        onSearch={handleSearch}
                        placeholder="Nhập mã PM hoặc thông tin khách hàng"
                        onChange={(value) => {
                            router.push(`/loan/return_loan?maPM=${value}`)
                        }}
                        value={phieuMuonInfo.maPM}
                        allowClear={true}
                        optionLabelProp="label">
                        {listPhieuMuonSelect.map((item, index) => (
                            <Option key={nanoid()} value={item.maPM} label={item.maPM}>
                                {() => `${item.maPM}-${item.khachHang.hoTenKH}-${item.ngayMuon}->${item.ngayHenTraPhieu}`}
                            </Option>
                        ))}
                    </Select>
                </div>

            </Form.Item>

            <Form.Item label="Thông tin phiếu mượn">
                <div>
                    <div>Ngày mượn: <span>{phieuMuonInfo.ngayMuon}</span></div>
                    <div>Hạn trả: <span>{phieuMuonInfo.ngayHenTraPhieu}</span></div>
                    <div>Trạng thái: <span>{phieuMuonInfo.statusText}</span></div>
                </div>
            </Form.Item>

            <Form.Item label="Thông tin khách hàng">
                <div>
                    <div>Tên khách hàng: <span>{phieuMuonInfo.khachHang?.hoTenKH}</span></div>
                    <div>Số điện thoại: <span>{phieuMuonInfo.khachHang?.sdt}</span></div>
                    <div>Trạng thái: <span>{phieuMuonInfo.khachHang?.statusPhieuMuonText}</span></div>
                </div>
            </Form.Item>

            <Form.Item
                name={"tblPhiCoc"}
                label={"Danh sách tài liệu mượn"}>
                <div>
                    <Table
                        bordered
                        dataSource={phiCoc.feeTaiLieus}
                        scroll={{y: 200}}
                        columns={columnsGiaCoc}
                        pagination={false}
                    />
                </div>
            </Form.Item>

            <Form.Item
                name={"tblPhiMuon"}
                label={"Danh sách tài liệu đã trả"}>
                <Table
                    bordered
                    dataSource={phiMuon.feeTaiLieus}
                    scroll={{y: 200}}
                    columns={columnsGiaMuon}
                    pagination={false}
                />

            </Form.Item>

            <Form.Item label={"Thêm vi phạm"}>
                <div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}>


                        <Select
                            placeholder="Chọn tài liệu"
                            onChange={(value) => {
                                setTaiLieuVP(value);
                            }}
                            allowClear={true}
                            optionLabelProp="label">
                            {phiCoc.feeTaiLieus.map((item, index) => (
                                <Option key={nanoid()}
                                        value={item.maTaiLieu}>{item.maTaiLieu}-{item.tenTaiLieu}</Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Chọn vi phạm"
                            onChange={(value) => {
                                setViPham(value)
                            }}
                            allowClear={true}
                            optionLabelProp="label">
                            {listViPhamSelect.map((item, index) => (
                                <Option key={nanoid()} value={item.id} label={item.tenviPham}>{item.tenviPham}</Option>
                            ))}
                        </Select>
                        <InputNumber
                            style={{
                                marginRight: 10,
                                width: '20%'
                            }}
                            value={heSo}
                            placeholder={"Hệ số"} onChange={(value) => {
                            setHeSo(value)
                        }}/>
                        <Button
                            onClick={handleAddRow}
                            type="primary">
                            Thêm vi phạm
                        </Button>
                    </div>
                </div>
            </Form.Item>

            <Form.Item
                name={"tblPhiViPham"}
                label={"Danh sách vi phạm"}>
                <Table
                    bordered
                    dataSource={phiViPham.feeTaiLieus}
                    scroll={{y: 200}}
                    columns={columnsViPham}
                    pagination={false}
                />
            </Form.Item>


            <Form.Item label={"Tổng giá"}>
                <div>
                    <div>Tổng giá cọc: <span>{phiCoc.tongPhi}</span></div>
                    <div>Tổng giá mượn: <span>{phiMuon.tongPhi}</span></div>
                    <div>Tổng giá vi phạm: <span>{phiViPham.tongPhi}</span></div>
                    <div>Tổng trả lại: <span>{phiCoc.tongPhi - phiMuon.tongPhi - phiViPham.tongPhi}</span></div>
                </div>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    ...layout.wrapperCol,
                    offset: 8,
                }}
            >
                <Popconfirm
                    title={"xác nhận trả phiếu mượn"}
                    onConfirm={handleConfirmTraPhieuMuon}
                    okText={"Xác nhận"}
                    cancelText={"Hủy"}
                >
                    <Button
                        type="primary"
                        style={{
                            marginRight: 10,
                            width: '150px'
                        }}>
                        Xác nhận trả
                    </Button>
                </Popconfirm>

                <Button
                    style={{
                        marginRight: 10,
                        width: '100px'
                    }}
                    danger onClick={() => {
                    router.push("/loan/list_loan")
                }}
                >Thoát</Button>
            </Form.Item>


            <Modal open={previewOpen}
                   title={"Xác nhận đã trả hết và thanh toán"}
                   onOk={handleOk}
                   centered
                   onCancel={handleCancel}>
                <div>
                    <div>Tổng giá cọc: <span>{phiCoc.tongPhi}</span></div>
                    <div>Tổng giá mượn: <span>{phiMuon.tongPhi}</span></div>
                    <div>Tổng giá vi phạm: <span>{phiViPham.tongPhi}</span></div>
                    <div>Tổng trả lại: <span>{phiCoc.tongPhi - phiMuon.tongPhi - phiViPham.tongPhi}</span></div>
                </div>
            </Modal>
        </Form>

    );
}

ReturnLoanPage.getInitialProps = async ({query}) => {
    const {maPM} = query;

    return {
        maPM,
    }
}

export default ReturnLoanPage