import {
    Button,
    DatePicker,
    Input,
    message,
    PageHeader,
    Pagination,
    Popconfirm,
    Select,
    Space,
    Table,
    Tooltip
} from "antd";
import {nanoid} from "nanoid";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import {useRouter} from "next/router";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    RollbackOutlined
} from "@ant-design/icons";
import {apiListPhieuMuonStatus} from "../../api/publicApi";
import {timKiemPhieuMuon, xoaPhieuMuon} from "../../api/phieuMuonApi";
import {fromMomentRangeToObjectRange} from "../../utils/dateTimeUtils";
import {genTag} from "../../utils/anotherUtils";
import {phieuMuonIsDeleted, phieuMuonIsReturn, phieuMuonIsUpdated} from "../../utils/conditionUtils";

const {RangePicker} = DatePicker;
export default function ListCustomerPage() {

    const authContextValue = useContext(AuthContext);
    const [list, setList] = useState([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 20, total: 0});
    const router = useRouter();
    const [listStatus, setListStatus] = useState([])
    const [phieuMuonKey, setPhieuMuonKey] = useState('')
    const [khachHangKey, setKhachHangKey] = useState('')
    const [ngayMuonRange, setNgayMuonRange] = useState([])
    const [ngayTraRange, setNgayTraRange] = useState([])
    const [status, setStatus] = useState(null)
    const dateFormat = 'DD-MM-YYYY';
    let timeOutId;

    function callApiGetList(params) {
        timKiemPhieuMuon(authContextValue?.token, params, (res) => {
            const {content, pageable, totalElements} = res.data;
            const list = content.map(content => {
                return {
                    ...content,
                    key: nanoid()
                };
            })
            const pageginationNew = {
                current: pageable.pageNumber + 1,
                pageSize: pageable.pageSize,
                total: totalElements
            }
            setList(list)
            setPagination(pageginationNew)

        }, (err) => {
            message.error("co loi khi call api tim kiem phieu muon")
        })
    }

    function getParams() {
        const rangeMuon = fromMomentRangeToObjectRange(ngayMuonRange)
        const rangeTra = fromMomentRangeToObjectRange(ngayTraRange)
        return {
            page: pagination.current,
            size: pagination.pageSize,
            khachHangKey: khachHangKey,
            phieuMuonKey: phieuMuonKey,
            status: status,
            ngayTaoStart: rangeMuon.start,
            ngayTaoEnd: rangeMuon.end,
            ngayTraStart: rangeTra.start,
            ngayTraEnd: rangeTra.end
        }
    }

    const handlePaginationChange = (page, pageSize) => {
        const params = {
            ...getParams(),
            page: page,
        }
        callApiGetList(params)
    };

    function actionDeletePhieuMuon(maPM) {
        xoaPhieuMuon(authContextValue?.token, maPM, (res) => {
            callApiGetList(getParams())
        }, (err) => {
            message.error("xay ra loi khi xoa phieu muon")
        })
    }

    function openEditPhieuMuonForm(maPM) {
        router.push(`/loan/add_loan?maPM=${maPM}`)
    }

    function openReturnLoanForm(maPM) {
        router.push(`/loan/return_loan?maPM=${maPM}`)
    }

    const columns = [
        {
            title: 'Mã phiếu mượn',
            dataIndex: 'maPM',
            key: nanoid(),
            // sorter: true,
            // defaultSortOrder: 'ascend',
        },
        {
            title: 'Mã khách hàng',
            dataIndex: 'maKH',
            key: nanoid(),
            // sorter: true,
        },
        {
            title: 'Họ tên khách hàng',
            dataIndex: 'khachHang',
            key: nanoid(),
            render: (text, record) => {
                return <div>{record.khachHang.hoTenKH}</div>
            }
        },
        {
            title: 'Ngày mượn',
            dataIndex: 'ngayMuon',
            key: nanoid(),
        },
        {
            title: 'Ngày trả',
            dataIndex: 'ngayHenTraPhieu',
            key: nanoid(),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: nanoid(),
            render: (text, record) => {
                switch (record.status) {
                    case 'TAO_MOI':
                        return genTag("blue", <ClockCircleOutlined/>, record.statusText)
                    case 'HET_HAN_XAC_NHAN':
                        return genTag("default", <MinusCircleOutlined/>, record.statusText)
                    case 'XAC_NHAN_MUON':
                        return genTag("success", <CheckCircleOutlined/>, record.statusText)
                    case 'HUY_DON_MUON':
                        return genTag("default", <MinusCircleOutlined/>, record.statusText);
                    case 'DEN_HAN_TRA':
                        return genTag("geekblue", <ClockCircleOutlined/>, record.statusText);
                    case 'QUA_HAN_TRA':
                        return genTag("error", <ExclamationCircleOutlined/>, record.statusText);
                    case 'DA_TRA':
                        return genTag("default", <CheckCircleOutlined/>, record.statusText);
                    default:
                        return null
                }

            }
        },
        {
            title: "Action",
            key: nanoid(),
            render: (_, record) => (
                <Space size="middle">
                    {phieuMuonIsUpdated(record.status) ?
                        <Tooltip title={"Chỉnh sửa"} placement="bottom">
                            <Button icon={<EditOutlined/>}
                                    onClick={() => openEditPhieuMuonForm(record.maPM)}
                            />
                        </Tooltip> : null
                    }

                    {phieuMuonIsDeleted(record.status) ?
                        <Tooltip title={"Xóa"} placement="bottom">
                            <Popconfirm
                                title={"Bạn có chắc chắn muốn xóa"}
                                onConfirm={() => actionDeletePhieuMuon(record.maPM)}
                                okText={"Xác nhận"}
                                cancelText={"Hủy"}
                            >
                                <Button icon={<DeleteOutlined/>}/>
                            </Popconfirm>
                        </Tooltip> : null
                    }
                    {phieuMuonIsReturn(record.status) ?
                        <Tooltip title={"Trả phiếu mượn"} placement="bottom">
                            <Button icon={<RollbackOutlined/>}
                                    onClick={() => openReturnLoanForm(record.maPM)}
                            >
                            </Button>
                        </Tooltip> : null
                    }
                </Space>
            )
        }
    ]


    useEffect(() => {
        apiListPhieuMuonStatus((res) => {
            setListStatus(res.data)
        })
        const params = {
            page: 1,
            size: 20
        }
        callApiGetList(params)
    }, []);

    const handleInputPhieuMuonKeywordChange = (e) => {
        const value = e.target.value;
        setPhieuMuonKey(value);
        var params = {
            ...getParams(),
            page: 1,
            phieuMuonKey: value
        }
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            callApiGetList(params)
        })
    }

    const handleInputKhachHangKeywordChange = (e) => {
        const value = e.target.value;
        setKhachHangKey(value)
        var params = {
            ...getParams(),
            page: 1,
            khachHangKey: value
        }
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            callApiGetList(params)
        })
    }

    function handleSelectStatusChange(value) {
        setStatus(value)
        var params = {
            ...getParams(),
            page: 1,
            status: value
        }
        callApiGetList(params)
    }

    const ngayTraRangeHandleChange = (dates, dateStrings) => {
        setNgayTraRange(dates)
        const range = fromMomentRangeToObjectRange(dates);
        var params = {
            ...getParams(),
            page: 1,
            ngayTraStart: range.start,
            ngayTraEnd: range.end
        }
        callApiGetList(params);
    }

    const ngayMuonRangeHandleChange = (dates, dateStrings) => {
        setNgayMuonRange(dates)
        const range = fromMomentRangeToObjectRange(dates);
        const params = {
            ...getParams(),
            page: 1,
            ngayTaoStart: range.start,
            ngayTaoEnd: range.end,
        }
        callApiGetList(params);
    }

    return (
        <div>
            <PageHeader
                title="Danh sách phiếu mượn"
                extra={[
                    <div key="selects" style={{display: 'flex', alignItems: 'center'}}>
                        <Button onClick={() => router.push("/loan/add_loan")} type={"primary"}>Thêm mới phiếu
                            mượn</Button>
                    </div>
                ]}
            />
            <PageHeader
                className="ontop-header"
                extra={[
                    <div key="selects" style={{display: 'flex', alignItems: 'center'}}>
                        <Input
                            placeholder={"Nhập mã phiếu mượn"}
                            value={phieuMuonKey}
                            onChange={handleInputPhieuMuonKeywordChange}
                        />
                        <Input
                            placeholder={"Nhập SDT, CCCD, tên KH"}
                            value={khachHangKey}
                            style={{marginLeft: '10px', marginRight: '10px'}}
                            onChange={handleInputKhachHangKeywordChange}
                        />
                        <Select
                            key={nanoid()}
                            style={{marginLeft: '10px', marginRight: '10px'}}
                            allowClear={true}
                            value={status}
                            placeholder={"Trạng thái phiếu mượn"}
                            onChange={handleSelectStatusChange}
                        >
                            {listStatus.map((item, index) => (
                                <Option key={nanoid()} value={item.code} label={item.name}>{item.name}</Option>
                            ))}
                        </Select>

                    </div>,
                    <div key="datePickers" style={{display: 'flex', alignItems: 'center'}}>
                        <RangePicker
                            value={ngayMuonRange}
                            style={{marginLeft: '10px', marginRight: '10px'}}
                            placeholder={['Ngày mượn bắt đầu', 'Ngày mượn kết thúc']}
                            onChange={ngayMuonRangeHandleChange}
                            format={dateFormat}
                        />
                        <RangePicker
                            value={ngayTraRange}
                            style={{marginLeft: '10px', marginRight: '10px'}}
                            placeholder={['Ngày trả bắt đầu', 'Ngày trả kết thúc']}
                            onChange={ngayTraRangeHandleChange}
                            format={dateFormat}
                        />
                    </div>
                ]}
            />
            <div align={'right'}>
                <Table
                    dataSource={list}
                    columns={columns}
                    pagination={false}/>
                <Pagination
                    style={{
                        marginTop: '10px',
                    }}
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePaginationChange}
                />
            </div>
        </div>
    )
}