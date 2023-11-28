import {Button, Input, message, PageHeader, Pagination, Popconfirm, Select, Space, Table, Tag, Tooltip} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {timKiemTaiLieu, xoaTaiLieu} from "../../api/taiLieuApi";
import {AuthContext} from "../../contexts/AuthContext";
import {nanoid} from "nanoid";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {apiListLoaiTaiLieu, apiListThongTinTaiLieuStatus} from "../../api/publicApi";

const Option = Select.Option;

export default function ListBookPage() {
    const authContextValue = useContext(AuthContext);
    const [list, setList] = useState([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 20, total: 0});
    const router = useRouter();
    const [listStatus, setListStatus] = useState([])
    const [listLoaiTaiLieu, setListLoaiTaiLieu] = useState([])
    const [keyword, setKeyword] = useState('')
    const [status, setStatus] = useState(null)
    const [loaiTaiLieu, setLoaiTaiLieu] = useState(null)
    let timeOutId;

    const handleSelectTTTLStatusChange = (value) => {
        setStatus(value)
        callApiGetList({
            ...getParams(),
            status: value,
        })
    };

    const handleSelectLoaiTaiLieuChange = (value) => {
        setLoaiTaiLieu(value)
        callApiGetList({...getParams(),
            loaiTaiLieu: value
        })
    };

    const getParams = () => {
        return {
            page: pagination.current,
            size: pagination.pageSize,
            keyword: keyword,
            loaiTaiLieu: loaiTaiLieu,
            status: status
        }
    }

    useEffect(() => {
        apiListThongTinTaiLieuStatus((res) => {
            setListStatus(res.data);
        })
        apiListLoaiTaiLieu((res) => {
            setListLoaiTaiLieu(res.data)
        })
        const testValue = {
            page: pagination.current,
            size: pagination.pageSize
        }
        callApiGetList(testValue)

    }, []);
    const handlePaginationChange = (page, pageSize) => {
        const params = {
            page: page,
            size: pageSize,
            keyword: keyword,
            loaiTaiLieu: loaiTaiLieu,
            status: status
        }
        callApiGetList(params)
    };

    const callApiGetList = (params) => {
        timKiemTaiLieu(authContextValue?.token, params, (res) => {
            const {content, pageable, totalPages, totalElements} = res.data;
            const list = content.map(content => {
                const newRecord = {
                    ...content,
                    key: nanoid()
                }
                return newRecord;
            })
            const pageginationNew = {
                current: pageable.pageNumber + 1,
                pageSize: pageable.pageSize,
                total: totalElements
            }
            console.log("pageginationNew")
            console.log(pageginationNew)
            setList(list)
            setPagination(pageginationNew)
        }, (err) => {
            console.log(err)
            message.error("lỗi api")
        })
    }

    function openEditTaiLieuForm(id) {
        router.push(`/book/add_book?id=${id}`)
    }

    function deleteTaiLieu(id) {
        if (id === undefined || id === null)
            return;
        const params = {
            page: pagination.current,
            size: pagination.pageSize,
            keyword: keyword,
            loaiTaiLieu: loaiTaiLieu,
            status: status
        }
        xoaTaiLieu(authContextValue?.token, id, (res) => {
            callApiGetList(params)
        }, (err) => {
            message.error("xóa không thành công")
        })
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
            title: 'Mã tài liệu',
            dataIndex: 'maThongTinTaiLieu',
            key: nanoid(),
            // sorter: true,
        },
        {
            title: 'Tên tài liệu',
            dataIndex: 'tenTaiLieu',
            key: nanoid(),
            // sorter: true,
        },
        {
            title: 'Loại tài liệu',
            dataIndex: 'loaiTaiLieuText',
            key: nanoid(),
        },
        {
            title: 'Ngày xuất bản',
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
                        <Button icon={<EditOutlined/>} onClick={() => openEditTaiLieuForm(record.id)}/>
                    </Tooltip>
                    <Tooltip title={"Xóa"} placement="bottom">
                        <Popconfirm
                            title={"Bạn có chắc chắn muốn xóa"}
                            onConfirm={() => deleteTaiLieu(record.id) }
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


    const handleInputkeywordChange = (e) => {
        const value = e.target.value;
        setKeyword(value)
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            callApiGetList({
                ...getParams(),
                keyword: value
            })
        })
    }
    return (
        <div>
            <PageHeader
                className="ontop-header"
                title="Danh sách tài liệu"
                extra={[
                    <div key="selects" style={{display: 'flex', alignItems: 'center'}}>
                        <Input
                            placeholder={"Nhập mã tài liệu hoặc tên tài liệu"}
                            value={keyword}
                            onChange={handleInputkeywordChange}
                        />
                        <Select
                            key="select1"
                            style={{marginLeft: '10px', marginRight: '10px'}}
                            allowClear={true}
                            placeholder={"Trạng thái tài liệu"}
                            onChange={handleSelectTTTLStatusChange}
                        >
                            {listStatus.map((value, index, array) =>
                                (<Option key={nanoid()} value={value.code}>{value.name}</Option>))}
                        </Select>
                        <Select
                            key="select2"
                            placeholder={"Loại tài liệu"}
                            allowClear={true}
                            onChange={handleSelectLoaiTaiLieuChange}>
                            {listLoaiTaiLieu.map((value, index, array) =>
                                (<Option key={nanoid()} value={value.code}>{value.name}</Option>))}
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