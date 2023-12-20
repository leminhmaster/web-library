import {Button, Input, message, PageHeader, Pagination, Popconfirm, Select, Space, Table, Tag, Tooltip} from "antd";
import {nanoid} from "nanoid";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import {useRouter} from "next/router";
import {CheckOutlined, DeleteOutlined, EditOutlined, StopOutlined} from "@ant-design/icons";
import {apiListNhanVienStatus} from "../../api/publicApi";
import {activateNhanVien, deleteNhanVien, inactivateNhanVien, timKiemNhanVien} from "../../api/nhanVienApi"
import {nhanVienIsActivate, nhanVienIsDeactivate, nhanVienIsDelete} from "../../utils/conditionUtils";

export default function ListCustomerPage() {
    const authContextValue = useContext(AuthContext);
    const [list, setList] = useState([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 20, total: 0});
    const router = useRouter();
    const [listStatus, setListStatus] = useState([])
    const [keyword, setKeyword] = useState('')
    const [status, setStatus] = useState(null)
    let timeOutId;

    function callApiGetList(params) {
        timKiemNhanVien(authContextValue?.token, params, (res) => {
            const {content, pageable, totalPages, totalElements} = res.data;
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
            console.log(err.data)
            message.error("lỗi api")
        })
    }

    function getParams() {
        return {
            page: pagination.current,
            size: pagination.pageSize,
            keyword: keyword,
            status: status,
        }
    }

    const handlePaginationChange = (page, pageSize) => {
        const params = {
            ...getParams()
        }
        callApiGetList(params)
    };

    function actionDeleteNhanVien(id) {
        deleteNhanVien(authContextValue?.token, id, (res) => {
            callApiGetList(getParams())
        }, (err) => {
            message.error("xay ra loi khi xoa nhan vien")
        })
    }

    function openEditNhanVienForm(id) {
        router.push(`/staff/add_staff?id=${id}`)
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: nanoid(),
            // sorter: true,
            // defaultSortOrder: 'ascend',
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'maNV',
            key: nanoid(),
            // sorter: true,
        },
        {
            title: 'Họ tên nhân viên',
            dataIndex: 'hoten',
            key: nanoid(),
            // sorter: true,
        },
        {
            title: 'Số CCCD',
            dataIndex: 'soCCCD',
            key: nanoid(),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdt',
            key: nanoid(),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: nanoid(),
            render: (text, record) => (
                <Tag color="blue" key={nanoid()}>
                    {record.statusText}
                </Tag>
            )
        },
        {
            title: "Action",
            key: nanoid(),
            render: (_, record) => (
                <Space size="middle">

                    <Tooltip title={"Chỉnh sửa"} placement="bottom">
                        <Button icon={<EditOutlined/>}
                                onClick={() => openEditNhanVienForm(record.id)}
                        />
                    </Tooltip>

                    {nhanVienIsDelete(record.status) ? (<Tooltip title={"Xóa"} placement="bottom">
                        <Popconfirm
                            title={"Bạn có chắc chắn muốn xóa"}
                            onConfirm={() => actionDeleteNhanVien(record.id)}
                            okText={"Xác nhận"}
                            cancelText={"Hủy"}
                        >
                            <Button icon={<DeleteOutlined/>}/>
                        </Popconfirm>
                    </Tooltip>) : (null)}

                    {nhanVienIsActivate(record.status) ? (<Tooltip title={"activate nhân viên"} placement="bottom">
                        <Popconfirm
                            title={"Bạn có chắc chắn muốn cho nhân viên này làm việc"}
                            onConfirm={() => {
                                activateNhanVien(authContextValue?.token, record.id, (res) => {
                                    message.success("activate thanh cong")
                                }, (err) => {
                                    message.error("activate khong thanh cong")
                                })
                            }}
                            okText={"Xác nhận"}
                            cancelText={"Hủy"}
                        >
                            <Button icon={<CheckOutlined/>}/>
                        </Popconfirm>
                    </Tooltip>) : (null)
                    }

                    {nhanVienIsDeactivate(record.status) ? (<Tooltip title={"deactivate nhân viên"} placement="bottom">
                        <Popconfirm
                            title={"Bạn có chắc chắn đổi cho nhân viên này nghỉ làm việc"}
                            onConfirm={() => {
                                inactivateNhanVien(authContextValue?.token, record.id, (res) => {
                                    message.success("deactivate thanh cong")
                                }, (err) => {
                                    message.error("deactivate khong thanh cong")
                                })
                            }}
                            okText={"Xác nhận"}
                            cancelText={"Hủy"}
                        >
                            <Button icon={<StopOutlined/>}/>
                        </Popconfirm>
                    </Tooltip>) : <div/>
                    }

                </Space>
            )
        }
    ]

    useEffect(() => {
        apiListNhanVienStatus((res) => {
            setListStatus(res.data)
        })
        const params = {
            page: 1,
            size: 20
        }
        callApiGetList(params)
    }, []);

    const handleInputkeywordChange = (e) => {
        const value = e.target.value;
        setKeyword(value)
        const params = {
            ...getParams(),
            keyword: value
        }
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            callApiGetList(params)
        })
    }


    function handleSelectStatusChange(value) {
        setStatus(value);
        const params = {
            ...getParams(),
            status: value
        }
        callApiGetList(params)
    }

    return (
        <div>
            <PageHeader
                title="Danh sách nhân viên"
                extra={[
                    <div key="selects" style={{display: 'flex', alignItems: 'center'}}>
                        <Button onClick={() => router.push("/staff/add_staff")} type={"primary"}>Thêm mới nhân
                            viên</Button>
                    </div>
                ]}
            />
            <PageHeader
                extra={[
                    <div key="selects" style={{display: 'flex', alignItems: 'center'}}>
                        <Input
                            placeholder={"Nhập SDT, CCCD, tên NV"}
                            value={keyword}
                            onChange={handleInputkeywordChange}
                        />
                        <Select
                            key={nanoid()}
                            style={{marginLeft: '10px', marginRight: '10px'}}
                            allowClear={true}
                            value={status}
                            placeholder={"Trạng thái nhân viên"}
                            onChange={handleSelectStatusChange}
                        >
                            {listStatus.map((item, index) => (
                                <Option key={nanoid()} value={item.code} label={item.name}>{item.name}</Option>
                            ))}
                        </Select>
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