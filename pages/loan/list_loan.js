import {Button, Input, message, PageHeader, Pagination, Popconfirm, Select, Space, Table, Tag, Tooltip} from "antd";
import {nanoid} from "nanoid";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import {useRouter} from "next/router";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {apiListNhanVienStatus} from "../../api/publicApi";
import {deleteNhanVien, timKiemNhanVien} from "../../api/nhanVienApi"

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
            title: 'Mã khách hàng',
            dataIndex: 'maKH',
            key: nanoid(),
            // sorter: true,
        },
        {
            title: 'Họ tên khách hàng',
            dataIndex: 'hotenKH',
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
            dataIndex: 'ngayXuatBan',
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
                    <Tooltip title={"Xóa"} placement="bottom">
                        <Popconfirm
                            title={"Bạn có chắc chắn muốn xóa"}
                            onConfirm={() => actionDeleteNhanVien(record.id) }
                            okText={"Xác nhận"}
                            cancelText={"Hủy"}
                        >
                            <Button icon={<DeleteOutlined/>} />
                        </Popconfirm>
                    </Tooltip>
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
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            //todo CALL api get list
        })
    }


    function handleSelectStatusChange() {

    }

    return (
        <div>
            <PageHeader
                className="ontop-header"
                title="Danh sách khách hàng"
                extra={[
                    <div key="selects" style={{display: 'flex', alignItems: 'center'}}>
                        <Input
                            placeholder={"Nhập SDT, CCCD, tên KH"}
                            value={keyword}
                            onChange={handleInputkeywordChange}
                        />
                        <Select
                            key={nanoid()}
                            style={{marginLeft: '10px', marginRight: '10px'}}
                            allowClear={true}
                            placeholder={"Trạng thái khách hàng"}
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